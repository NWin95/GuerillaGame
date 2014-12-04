#pragma strict

var inControlMovement	: boolean;
var animator	: Animator;
var thirdPersonCam	: Transform;
var forwardTrans	: Transform;
var playerVis		: Transform;

var grounded		: boolean;
var groundContact	: boolean;
var contactTime		: float;
var swimming		: boolean;
var waterLevel		: Vector3;
var swimUpTime		: float;

var jumpReady		: boolean;
var jumpVel			: float;

var velocity		: float;
var velocityDenom	: float;
var maxSlope		: float;

var moveSpeed			: float;
var maxVelocityChange	: float;
var bouyancy			: float;
var swimRatio			: float;

var humanRotTime		: float;
var waterMask		: LayerMask;
var waterHit		: RaycastHit;

function Start ()
{
//	Screen.showCursor = false;
//	Screen.lockCursor = true;

	Cursor.lockState	= CursorLockMode.Locked;
	Cursor.visible		= false;
	velocityDenom	= moveSpeed;
}

function Update ()
{
	var velXZ	= GetComponent.<Rigidbody>().velocity;
	velXZ.y		= 0;
	velocity	= velXZ.magnitude;
	
	GroundingFunc	();
	
	if (inControlMovement)
	{
		MovementUpdate	();
		Rotations		();
	}
	
	AnimKeeping		();
}

function FixedUpdate ()
{
	if (inControlMovement)
	{
		MovementFixed	();
	}
}

function GroundingFunc	()
{	
	if (groundContact)
	{
		contactTime	= 0.075;		
		grounded	= true;
		jumpReady	= true;
	}
	else
	{
		contactTime	-= Time.deltaTime;
			
		if (contactTime <= 0)
		{
			grounded	= false;
		}
	}
}

function OnCollisionStay (collision : Collision)
{
	for(var contact : ContactPoint in collision.contacts)
	{
		if (Vector3.Angle(contact.normal, Vector3.up) < maxSlope && !swimming)
		{
			groundContact	= true;
		}
	}
}

function MovementUpdate ()
{
	if (Input.GetButtonDown ("Jump") && grounded)
	{
		JumpFunc ();
	}
	
	if (swimming)
	{
//		transform.position.y	= waterLevel.y	- 1.55;
/*		if (Physics.Raycast (waterLevel + (Vector3.up * 3), Vector3.down, waterHit, 5, waterMask))
		{
			waterLevel	= waterHit.point;
		}
*/
		var swimUpTarg	: Vector3;
		swimUpTarg		= transform.position;
		swimUpTarg.y	= waterLevel.y + 0;
	
		if ((transform.position.y - waterLevel.y) < -0.5)
		{
//			transform.position	= Vector3.Lerp (transform.position, swimUpTarg, swimUpTime / Time.deltaTime);
			GetComponent.<Rigidbody>().velocity.y	+= bouyancy * Time.deltaTime;
//			Debug.Log ("swim up");
		}
		if ((transform.position.y - waterLevel.y) >= -0.5)
		{
//			Debug.Log ("stop");
			GetComponent.<Rigidbody>().velocity.y	= 0;
		}
		Debug.Log ((transform.position.y - waterLevel.y));
//		transform.position.y	= waterLevel.y - 0.25;
	}
}

function OnCollisionExit	()
{
	groundContact	= false;
}

function JumpFunc	()
{
	groundContact	= false;
	GetComponent.<Rigidbody>().velocity.y	= jumpVel;
//	Debug.Log (jumpReady);
	yield WaitForEndOfFrame ();
	jumpReady = false;
}

function MovementFixed	()
{
//	Debug.Log	(Input.GetAxis ("ForWalk"));
	if (swimming)
	{
//		rigidbody.AddForce (Vector3.up * rigidbody.mass * bouyancy);
		
		if (velocity < 12.5)
		{
			var MoveForwardTarg	= Quaternion.LookRotation (thirdPersonCam.forward * 50);
			MoveForwardTarg.z	= 0;
			MoveForwardTarg.x	= 0;
			
			forwardTrans.rotation	= MoveForwardTarg;
			
			var targetVelocity = new Vector3(Input.GetAxis("StraWalk"), 0, Input.GetAxis("ForWalk"));
			targetVelocity = forwardTrans.TransformDirection(targetVelocity);
			targetVelocity *= moveSpeed * swimRatio;
			targetVelocity += Vector3.up;
	 
			// Apply a force that attempts to reach our target velocity
			var moveVelocity = GetComponent.<Rigidbody>().velocity;
			var moveVelocityChange = (targetVelocity - moveVelocity);
			moveVelocityChange.x = Mathf.Clamp(moveVelocityChange.x, -maxVelocityChange, maxVelocityChange);
			moveVelocityChange.z = Mathf.Clamp(moveVelocityChange.z, -maxVelocityChange, maxVelocityChange);
			moveVelocityChange.y = 0;
			GetComponent.<Rigidbody>().AddForce(moveVelocityChange, ForceMode.VelocityChange);
		}
	}
	if (grounded)
	{
		if (velocity < 12.5)
		{
			MoveForwardTarg	= Quaternion.LookRotation (thirdPersonCam.forward * 50);
			MoveForwardTarg.z	= 0;
			MoveForwardTarg.x	= 0;
			
			forwardTrans.rotation	= MoveForwardTarg;
			
			targetVelocity = new Vector3(Input.GetAxis("StraWalk"), 0, Input.GetAxis("ForWalk"));
			targetVelocity = forwardTrans.TransformDirection(targetVelocity);
			targetVelocity *= moveSpeed;
	 
			// Apply a force that attempts to reach our target velocity
			moveVelocity = GetComponent.<Rigidbody>().velocity;
			moveVelocityChange = (targetVelocity - moveVelocity);
			moveVelocityChange.x = Mathf.Clamp(moveVelocityChange.x, -maxVelocityChange, maxVelocityChange);
			moveVelocityChange.z = Mathf.Clamp(moveVelocityChange.z, -maxVelocityChange, maxVelocityChange);
			moveVelocityChange.y = 0;
			GetComponent.<Rigidbody>().AddForce(moveVelocityChange, ForceMode.VelocityChange);
		}
	}
}

function Rotations ()
{	
	var camLookTarg	= Quaternion.LookRotation (thirdPersonCam.forward * 50);
	camLookTarg.z	= 0;
	camLookTarg.x	= 0;
	
	var newRotTarg		= Quaternion.Slerp (transform.rotation, camLookTarg, Time.deltaTime / humanRotTime);
	
	if ((!grounded && !swimming) || ((grounded || swimming) && (Input.GetAxis ("ForWalk") != 0 || Input.GetAxis ("StraWalk") != 0)) || (grounded && Mathf.Abs (transform.localEulerAngles.z) > 0.5))
	{
		transform.rotation					= newRotTarg;
	}
//	Debug.Log ("human rotations");

}

function AnimKeeping ()
{
	animator.SetFloat	("VelocityXZ", velocity / velocityDenom);
	animator.SetFloat	("VelocityY", GetComponent.<Rigidbody>().velocity.y);
	animator.SetBool	("Grounded", grounded);
}

function OnTriggerEnter	(col : Collider)
{
	if (col.gameObject.tag == "Water")
	{
		swimming	= true;
		grounded	= false;
		animator.SetBool ("Swimming", true);
		GetComponent.<Rigidbody>().useGravity	= false;
		GetComponent.<Rigidbody>().velocity.y	*= 0.5;
		
//		waterLevel	= transform.position;
		if (col.transform.localEulerAngles.x > 200)
		{
			waterLevel	=	(col.transform.position + (Vector3.up * (col.bounds.size.y / 2)) + ((col.bounds.center.y - col.transform.position.y) * Vector3.up));
			Debug.Log (col.bounds.center.y - col.transform.position.y);
			Debug.Log ("got water level");

		}
		else if (col.transform.localEulerAngles.x < 20)
		{
			Debug.Log ("not this");
			waterLevel	= col.transform.position + (Vector3.up * (col.bounds.size.y / 2));
		}
//		Debug.Log ("Swimming");
	}
}

function OnTriggerExit ()
{
	if (swimming)
	{
		swimming	= false;
		animator.SetBool ("Swimming", false);
		GetComponent.<Rigidbody>().useGravity	= true;
		Debug.Log ("StoppedSwimming");
	}
}