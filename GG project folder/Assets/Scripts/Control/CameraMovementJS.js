#pragma strict

var movementSpeed		: float;
var rotationSpeed		: float;
var verticalRatio		: float;
var mouseRotSensitivity	: float;
var borderRotSensitivity: float;
var rotationBorder		: float;
var height				: float;
var layerMask			: LayerMask;
var canFall				: boolean;
var camTrans			: Transform;
var dt					: float;

function Update ()
{	
	dt			= Time.deltaTime;
	
	if (Input.GetButton ("Fire2"))	{	RightClickRotFunc	();	}
	else							{	MousePosRotFunc	();		}
	
	MovementFunc	();
}

function MousePosRotFunc	()
{
	if		(Input.mousePosition.x > Screen.width * rotationBorder)
	{
		transform.localEulerAngles.y	+= rotationSpeed * borderRotSensitivity * dt;
	}
	else if	(Input.mousePosition.x < Screen.width * (1- rotationBorder))
	{
		transform.localEulerAngles.y	-= rotationSpeed * borderRotSensitivity * dt;
	}
	
	if		(Input.mousePosition.y > Screen.height * rotationBorder)
	{
		camTrans.localEulerAngles.x	-= rotationSpeed * borderRotSensitivity * verticalRatio * dt;
	}
	else if	(Input.mousePosition.y < Screen.height * (1- rotationBorder))
	{
		camTrans.localEulerAngles.x	+= rotationSpeed * borderRotSensitivity * verticalRatio * dt;
	}
	
	var camPitch	= camTrans.localEulerAngles.x;
		
	if		(camPitch < 180 && camPitch > 85)	{ camTrans.localEulerAngles.x = 85; }
	else if	(camPitch > 180 && camPitch < 275)	{ camTrans.localEulerAngles.x = 275; }
}

function RightClickRotFunc	()
{
//	Debug.Log ("RightClickRotFunc");
	camTrans.localEulerAngles.x		-= Input.GetAxis ("Mouse Y")	* rotationSpeed * mouseRotSensitivity * verticalRatio * dt;
	transform.localEulerAngles.y	+= Input.GetAxis ("Mouse X")	* rotationSpeed * mouseRotSensitivity * dt;
//	Debug.Log (Input.GetAxis ("Mouse X"));
	var camPitch	= camTrans.localEulerAngles.x;
	
	if		(camPitch < 180 && camPitch > 85)	{ camTrans.localEulerAngles.x = 85; }
	else if	(camPitch > 180 && camPitch < 275)	{ camTrans.localEulerAngles.x = 275; }
}

function MovementFunc	()
{
	if (canFall)
	{
		var movementInputs	= Vector3 (Input.GetAxis ("HorizontalCam"), 0, Input.GetAxis ("VerticalCam"));
	}
	else
	{
		movementInputs		= Vector3 (Input.GetAxis ("HorizontalCam"), 0, Input.GetAxis ("VerticalCam"));
	}
	transform.localPosition 	+= transform.localRotation * movementInputs * movementSpeed * dt;
	transform.position.y		+= Input.GetAxis ("AltitudeCam") * movementSpeed * dt;
	
	var rayHit	: RaycastHit;
	
	if (Physics.Raycast (transform.position, Vector3.down, rayHit, height, layerMask))
	{
		canFall	= false;
		transform.position = rayHit.point + (Vector3.up * (height + 0.025));
	}
	else
	{
		canFall = true;
	}
}