#pragma strict

var player			: Transform;
var alive			: boolean;
var inFOV			: boolean;
var visualContact	: boolean;
var eyes			: Transform;

var toPlayerVector	: Vector3;
var playerDis	: float;
var range		: float;
var FOV			: float;
var sightMask	: LayerMask;

function Start ()
{
	player	= GameObject.Find ("Player").transform;
}

function Update ()
{
	if (alive)
	{
		playerDis	= Vector3.Distance (transform.position , player.position);
		toPlayerVector	= -(eyes.position - (player.position + player.up)).normalized;
		
		if (playerDis < range)																			//within range
		{
			if (Vector3.Angle (-eyes.right, toPlayerVector) < FOV)										//within field of view
			{	inFOV	= true;		}
			else
			{	inFOV	= false;	}
		
			if (Physics.Linecast (eyes.position, player.position + (player.up), sightMask))				//if the raycast hits something
			{	visualContact	= false;	}
			
			else
			{
				if (inFOV)
				{	visualContact	= true;		}
				else
				{	visualContact	= false;	}
			}
		}
		else
		{	visualContact	= false;	}
		
		if (visualContact)
		{	HasVisualFunc ();	}
	}
	else
	{	visualContact	= false;	}
}

function HasVisualFunc ()
{
//	Debug.Log ("Has Visual");
//	transform.localEulerAngles.y += 10;

	
}