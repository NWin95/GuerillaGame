#pragma strict

@HideInInspector 	var rs	: Vector3;
@HideInInspector 	var ia	: Vector3;

var movement		: MovementPlayer;
var camCam			: Camera;
var camTrans		: Transform;
var baseCamPos		: Vector3;
var camTargPos		: Vector3;
var camTargRot		: Vector3;
var camMovementTime	: float;

var attacking		: boolean;
var inputAxes		: Vector3;

var playerTrans		: Transform;
var posOffset		: Vector3;
var humanEyes		: Transform;

var firstPerson		: boolean;
var camTargMode		: int;

var targFov			: float;
var targFovBase		: float;
var fovAttackMod	: float;
var zoomTime		: float;
var rotTime			: float;
var humanHood		: GameObject;

var differenceAllowence	: float;
var eyeSetTime			: float;

function Start ()
{
	baseCamPos	= camTargPos;
	movement	=	GetComponentInParent (MovementPlayer);
	transform.parent	= null;
	targFovBase		=	camCam.fieldOfView;
	targFov			= targFovBase;
}

function Update ()
{
	CameraRotation	();
	if 		(camTargMode	== 0)	{	transform.position	= playerTrans.position + posOffset;	}
	else if (camTargMode	== 2)	{	transform.position	= humanEyes.position;	}
	
	if (Input.GetKeyDown (KeyCode.M))	{	ModeSwitch ();	}
	
	camTrans.transform.localPosition	= Vector3.Lerp (camTrans.localPosition, camTargPos, Time.deltaTime / camMovementTime);
	camCam.fieldOfView	= Mathf.Lerp (camCam.fieldOfView, targFov, Time.deltaTime / camMovementTime);
	
//	if (Input.GetKeyDown (KeyCode.T))	{	Time.timeScale = 0.25;	}
//	if (Input.GetKeyDown (KeyCode.Y))	{	Time.timeScale = 1;		}
	
//	Debug.DrawRay (humanEyes.position, humanEyes.right * -3, Color.green);
//	Debug.DrawRay (transform.position, transform.forward * 3, Color.red);
}

function ModeSwitch		()
{
	yield WaitForEndOfFrame ();
	if (firstPerson)		//will be not FP
	{
		firstPerson	= false;
		targFovBase		= 60;
		camTargMode	= 0;
		camTargPos		= baseCamPos;	humanHood.SetActive (true);
	}
	else
	{						//will be FP
		firstPerson	= true;
		targFovBase		= 90;
		camTargMode	= 2;
		camTargPos		= Vector3 (0,0.1,0.1);	humanHood.SetActive (false);
	}
}

function CameraRotation	()
{
	inputAxes	= Vector3 (-Input.GetAxis ("Mouse Y"), Input.GetAxis ("Mouse X"), 0);
	rs			= Vector3 (1,1,1);
	ia			= inputAxes;
	
	var camTargRot	= Vector3 ( ia.x * rs.x , ia.y * rs.y , 0 );
	var zRot	= transform.localEulerAngles.z;
	
	if (!firstPerson || (firstPerson && !attacking))
	{
		if 		(zRot > 0 && zRot < 180)
		{	transform.localEulerAngles.z	= Mathf.Lerp (zRot, 0,		Time.deltaTime / eyeSetTime);	}
		else if	(zRot > 180 && zRot < 360)
		{	transform.localEulerAngles.z	= Mathf.Lerp (zRot, 360,	Time.deltaTime / eyeSetTime);	}
	}
	
	if (!firstPerson)
	{
		transform.localEulerAngles += camTargRot;
	}
	else
	{
		var difference : float;
		difference	= Vector3.Angle (transform.forward, humanEyes.forward);
		
		if (attacking)
		{
			targFov	= targFovBase + fovAttackMod;
			if (difference > differenceAllowence)
			{
				var eyeRot	: Quaternion;
				eyeRot	= humanEyes.rotation * Quaternion.Euler (0,-90,-90);
				transform.rotation	= Quaternion.Lerp (transform.rotation, eyeRot, Time.deltaTime / eyeSetTime);
			}
			else
			{
				transform.localEulerAngles += camTargRot;
				transform.forward	= -humanEyes.right;
			}
		}
		else
		{
//			var zRotTarg	: Vector3;
//			zRotTarg	= Vector3 (transform.localEulerAngles.x, transform.localEulerAngles.y, 0);
//			transform.localEulerAngles	= Vector3.Slerp (transform.localEulerAngles, zRotTarg, Time.deltaTime / eyeSetTime);
			targFov	= targFovBase;
			transform.localEulerAngles += camTargRot;
		}
	}
}