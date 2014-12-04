#pragma strict

import System.Collections.Generic;

var movementScript	: MovementPlayer;
var camScript		: CamScript;
var animator		: Animator;
var playerVis		: GameObject;
var canAttack		: boolean;
var targ			: Transform;
var thirdPersonCam	: Transform;
var rotTime			: float;

var acquisitionMask			: LayerMask;
var acquisitionRadius		: float;
var acquisitionAngeMargin	: float;
var aimVector				: Vector3;

var acquisitionColliders	: Collider [];
var inAimColliders			: List.<Collider>;
var closestInAim			: Collider;

var shouldMove		: boolean;
var initialTargDis	: float;
var targPos			: Vector3;
var curTargDis		: float;
var moveToSpeed		: float;
var jumpToForce		: float;
var jumpYBase		: float;

var attackRange		: float;
var attackString	: String;

function Start	()
{
	canAttack	= true;
}

function Update ()
{
	if (Input.GetKeyDown (KeyCode.U))
	{
		Debug.ClearDeveloperConsole ();
		Debug.Log ("ClearAttempt");
	}
	if (canAttack && Input.GetButtonDown ("Attack"))
	{
		AcquireTargFunc	();
	}
	if (shouldMove)
	{
		MoveToFunc ();
	}
}

function FixedUpdate ()
{
/*	if (shouldMove)
	{
		MoveToFunc ();
	}	*/
}

function AcquireTargFunc ()
{	
	var aimVectorBase	: Vector3;
	aimVectorBase	= Vector3 (Input.GetAxis ("StraWalk"), 0, Input.GetAxis ("ForWalk"));
	aimVector	= thirdPersonCam.TransformDirection (aimVectorBase);
	aimVector.y	= 0;
	aimVector	= aimVector.normalized;
	
	acquisitionColliders	= Physics.OverlapSphere (transform.position, acquisitionRadius, acquisitionMask);
	inAimColliders.Clear ();
	
	
	for (var coll in acquisitionColliders)
	{	
		var angleTo	: Vector3;
		angleTo	= (coll.transform.position - transform.position);
		if (Vector3.Angle (angleTo, aimVector) < acquisitionAngeMargin)
		{
			inAimColliders.Add (coll);
		}
	}
	
	for (var coll2 in inAimColliders)
	{
//		Debug.Log ("We Exist");
		var disToPlayer	= Vector3.Distance (coll2.transform.position , transform.position);
		if (closestInAim == null)
		{
			closestInAim	= coll2;
		}	
		else if (disToPlayer < Vector3.Distance (closestInAim.transform.position, transform.position))
		{
			closestInAim	= coll2;
		}
	}
	
	if (inAimColliders.Count != 0)
	{
		if (closestInAim.gameObject.tag	== "Enemy")									//HAS TARGET
		{
			TargetAcquired ();
		}
		else
		{
			Debug.Log ("No Targ");
		}
	}
}

function TargetAcquired ()
{
//	animator.enabled	= false;
	animator.SetBool ("InCombat", true);
	movementScript.inControlMovement	= false;
	camScript.attacking		= true;
	targ	= closestInAim.transform;
	var initialTargPos	= targ.position + targ.GetComponent.<Rigidbody>().velocity;
	initialTargDis	= Vector3.Distance (transform.position, initialTargPos);
	curTargDis		= initialTargDis;
	GetComponent.<Rigidbody>().AddForce (Vector3.up * jumpToForce * GetComponent.<Rigidbody>().mass * (initialTargDis / 10));
//	Debug.Log (closestInAim.name);
	shouldMove	= true;
	canAttack	= false;
	movementScript.grounded	= false;
	jumpYBase	= 10000;
	yield WaitForSeconds (0.02);
	jumpYBase	= transform.position.y;
}

function MoveToFunc	()
{
	targPos	= targ.position + (targ.GetComponent.<Rigidbody>().velocity / (curTargDis / initialTargDis));
	curTargDis	= Vector3.Distance (targPos, transform.position);
	
	var targDir	= (targPos - transform.position).normalized;
	targDir.y	= 0;
//	Debug.Log (targPos);
	
	transform.position	+= targDir * moveToSpeed * Time.deltaTime;
	var targRot	= Quaternion.LookRotation (targDir, transform.forward);
	targRot.x	= 0;
	targRot.z	= 0;
	transform.rotation	= Quaternion.Slerp (transform.rotation, targRot, Time.deltaTime / rotTime);
	if (curTargDis <= attackRange)
	{
		InRangeFunc ();
	}
}

function InRangeFunc ()
{
	shouldMove	= false;
	AttackFunc ();
}

function AttackFunc ()
{
	var attackType	: int;
	attackType	= Random.Range (1,4);		//One more than number of attacks
	/*
		1: FightKickFrontHighSide		2: FightPuchCrossRight		3: FightKickHighSpinBack
	*/
	animator.SetInteger ("FightAction", attackType);
//	Debug.Log (attackType);
	switch (attackType)
	{
		case 1: yield WaitForSeconds (0.79); break;
		case 2: yield WaitForSeconds (0.37); break;
		case 3: yield WaitForSeconds (1.12); break;
	}
//	yield WaitForSeconds (animator.GetCurrentAnimatorStateInfo(0).length * 0.95);
	ResetFunc ();
}

function ResetFunc ()
{
//	Debug.Log ("ResetFunc");
	animator.SetBool ("InCombat", false);
	animator.SetInteger ("FightAction", 0);	
	movementScript.inControlMovement	= true;
	camScript.attacking		= false;
//	animator.enabled		= true;
	canAttack				= true;
	targ					= null;
	closestInAim			= null;
}