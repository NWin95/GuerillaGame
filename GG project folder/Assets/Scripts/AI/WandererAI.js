#pragma strict
#pragma downcast

var mesh		: GameObject;
var animals		: Transform;

var health		: int;
var alive		: boolean;
var food		: int;

var startPos		: Vector3;
var targPos			: Vector3;
var range			: float;
var distance		: float;
var allowence		: float;
var allowenceBase	: float;
var agent			: NavMeshAgent;

var grangeTime	: float;
var grangeRange	: Vector2;

var decayTime	: float;
var decayBase	: float;

var lifeRange		: Vector2;
var lifeExpectancy	: float;

var heatDis		: float;
var heatToTime	: float;
var heatToTimeBase: float;
var inHeat		: boolean;
var heatLimit	: float;
var heatLimitBase	: float;
var sentScent	: boolean;
var scentMask	: LayerMask;
var heatHit	: RaycastHit;
//var beau		: GameObject;
var hasBeau		: boolean;
var beauHold	: GameObject;
var baby		: GameObject;

function Start ()
{
//	alive	= true;
//	agent	= GetComponent (NavMeshAgent);
	startPos	= transform.position;
	targPos		= startPos;
	decayBase	= decayTime;
	lifeExpectancy	= Random.Range (lifeRange.x, lifeRange.y);
	LifeExpectancyFunc	();
	heatToTime	= lifeExpectancy / (Random.Range (3,4));
	heatToTimeBase	= heatToTime;
	heatLimitBase	= heatLimit;
	allowenceBase	= allowence;
	animals	= GameObject.Find ("Animals").transform;
}

function Update ()
{
	if (alive)
	{
		distance	= Vector3.Distance (transform.position, targPos);
		if (distance < allowence && !hasBeau)
		{
			NewTargPos ();
//			ReachedDestination ();
		}
		else if (distance < allowence && hasBeau)
		{
			FoundBeau ();
		}
		else
		{
			agent.SetDestination (targPos);
		}
		HeatFunc ();
	}
	else
	{
		DeadUpdate	();
	}
	if (food <= 0)	{	Destroy (this);	Destroy (gameObject);	}
}
/*
function ReachedDestination ()
{
	grangeTime	= Random.Range (grangeRange.x, grangeRange.y);
	yield WaitForSeconds (grangeTime);
	NewTargPos ();
}
*/
function NewTargPos	()
{
	targPos = startPos + (Vector3 (Random.Range (-range, range), 0, Random.Range (-range, range)));
}

function Damaged ()
{
//	Debug.Log ("Damaged");
	health -= 100;
	if (health <= 0 && alive)
	{
		Dead ();
	}
}

function Dead ()
{
	alive	= false;
	gameObject.name	= "Prey";
//	Debug.Log (alive);
	mesh.transform.localEulerAngles.z 	= 90;
	mesh.transform.position.y			+= 0.1;
	Destroy (gameObject.GetComponent (NavMeshAgent));
}

function DeadUpdate ()
{
	decayTime	-= Time.deltaTime;
	
	if (decayTime <= 0)
	{
		decayTime	= decayBase;
		food	-= 5;
//		Debug.Log ("Decay");
	}
}

function Carved (carrying : int)
{
	food -= carrying;
}

function HeatFunc ()
{
	if (!inHeat)
	{
		heatToTime	-= Time.deltaTime;
	}
	if (inHeat)
	{
		if (!sentScent)
		{	
			var beauColliders : Collider[] = Physics.OverlapSphere (transform.position, heatDis);
			for (var beau : Collider in beauColliders)
			{
				if (beau.gameObject.name	== "PreyH")
				{
					hasBeau	= true;
					beauHold	= beau.gameObject;
//					targPos	= beau.transform.position;
				}
				gameObject.name	= "PreyH";
			}
			sentScent	= true;
		}
	}
	if (heatToTime <= 0)
	{
		heatToTime	= heatToTimeBase;
		allowence	= 0.25;
		inHeat	= true;
	}
	if (hasBeau)
	{
		targPos	= beauHold.transform.position;
	}
}

function FoundBeau ()
{
//	Debug.Log (Vector3.Distance (transform.position, targPos));
	var childRange	: float;
	childRange		= Random.Range (1,2);
	gameObject.name	= "Prey";
	allowence	= allowenceBase;
	inHeat		= false;
	sentScent	= false;
	beauHold	= null;
	hasBeau		= false;
	heatToTime	= heatToTimeBase;
	if (childRange	> 1.3)
	{
		Instantiate (baby, transform.position, transform.rotation);
		baby.transform.parent	= animals;
		Instantiate (baby, transform.position, transform.rotation);
		baby.transform.parent	= animals;
	}
	else if (childRange < 1.7)
	{
		Instantiate (baby, transform.position, transform.rotation);
	}
	NewTargPos ();
}

function LifeExpectancyFunc ()
{
	yield WaitForSeconds (lifeExpectancy);
	Dead ();
}