#pragma strict

var townCenterScript	: TownCenter;
var agent	: NavMeshAgent;
var targ	: Transform;
var navSpeedBase	: float;
var navSpeedSlow	: float;
var resourceTarg	: Transform;
var resourceName	: String;
var resourceType	: String;
var resourceDropType: String;
var warehouses	: GameObject [];
var warehouseTarg	: Transform;
var granaries		: GameObject [];
var granaryTarg		: Transform;
var carrying	: int;
var gatherTime	: float;
var gathering	: boolean;
var preyScript	: WandererAI;
var canAttack	: boolean;
var capacity	: int;
var velocity	: float;
var humanObj	: GameObject;
var alive		: boolean;
var lookTarg	: Vector3;

var chest	: GameObject;
var prop	: GameObject;
var empty	: GameObject;
var logProp	: GameObject;
var meatProp: GameObject;
var goldProp: GameObject;

var axe		: GameObject;
var pick	: GameObject;
var knife	: GameObject;

function Start ()
{
	agent	= GetComponent (NavMeshAgent);
	townCenterScript	= GameObject.Find ("TownCenter").GetComponent (TownCenter);
	navSpeedBase	= agent.speed;
//	if (warehouses.Length == 0) { Debug.Log ("NoWarehouses"); }

//	warehouses	= warehousesObj.transform;
}

function Update ()
{
	if (targ != null)
	agent.SetDestination (targ.position + (targ.forward * -0.25));
	
	if (targ != null && Vector3.Distance (transform.position, targ.position) < 5 && targ == resourceTarg)
	{
		GatheringFunc ();
	}
	if (targ != null && Vector3.Distance (transform.position, targ.position) < 5 && (targ == warehouseTarg || targ == granaryTarg))
	{
		DropOffFunc ();
	}
	velocity	= agent.velocity.sqrMagnitude;
	if (alive)
	{
		AnimationFunc	();
	}
}

function AssignedTask ()
{
	resourceTarg	= targ;
	resourceName	= targ.gameObject.name;
	carrying		= 0;
	if (resourceName == "Forest")	{	resourceType = "Wood";	resourceDropType = "Warehouse";	gatherTime	= 5;}
	if (resourceName == "GoldMine")	{	resourceType = "Gold";	resourceDropType = "Warehouse";	gatherTime	= 5;}
	if (resourceName == "Prey"	)	{	resourceType = "Food";	resourceDropType = "Granary";	gatherTime	= 5;	
										if (targ != null) preyScript = targ.gameObject.GetComponent (WandererAI);}
}

function GatheringFunc	()
{
	lookTarg	= targ.position + (targ.transform.right * -5);
	navSpeedSlow	= navSpeedBase * 0.25;
	agent.speed 	= navSpeedSlow;
//	Debug.Log ("GatheringFunc");
	
	axe.SetActive 	(false);
	pick.SetActive	(false);
	knife.SetActive	(false);

	if 		(resourceType	== "Wood")	{	axe.SetActive (true);	}
	else if (resourceType	== "Gold")	{	pick.SetActive (true);	}
	else if (resourceType	== "Food")	{	knife.SetActive (true);	}

	if (resourceName == "Prey")
	{
		preyScript.Damaged ();
		if (preyScript.health <= 0)
		{
			targ	= null;
			gathering	= true;
			yield WaitForSeconds (gatherTime);
			GatheredFunc ();
			preyScript.Carved (carrying);
		}
		else
		{
			targ	= null;
			gathering	= true;
			canAttack	= false;
			yield WaitForSeconds (3);
			canAttack	= true;
			targ	= resourceTarg;
		}
	}
	else
	{
		targ	= null;
		gathering	= true;
		yield WaitForSeconds (gatherTime);
		GatheredFunc ();
	}
}

function GatheredFunc ()
{
	agent.speed	= navSpeedBase;
	targ	= null;
	gathering	= false;
	
	axe.SetActive 	(false);
	pick.SetActive	(false);
	knife.SetActive	(false);
	
	logProp.SetActive 	(false);
	meatProp.SetActive 	(false);
	goldProp.SetActive 	(false);
	
	if 		(resourceType == "Wood") { logProp.SetActive 	(true); }
	else if (resourceType == "Gold") { goldProp.SetActive 	(true);}
	else if (resourceType == "Food") { meatProp.SetActive	(true); }
	
	if 		(resourceDropType	== "Warehouse")
	{
		warehouses	= GameObject.FindGameObjectsWithTag ("Warehouse");
		var closestWarehouse	: GameObject;
		if (closestWarehouse == null) { closestWarehouse = warehouses [0]; }
		
		var closestDis	: float;
		var testDis		: float;
		
		for (var testWarehouse in warehouses)
		{
			closestDis	= Vector3.Distance (transform.position, closestWarehouse.transform.position);
			testDis		= Vector3.Distance (transform.position, testWarehouse.transform.position);
			if (testDis < closestDis)
			{
				closestWarehouse	= testWarehouse;
			}
		}
		
		warehouseTarg	= closestWarehouse.transform;
		targ	= warehouseTarg;
	}
	else if	(resourceDropType	== "Granary")
	{	
		granaries	= GameObject.FindGameObjectsWithTag ("Granary");
		var closestGranary	: GameObject;
		if (granaries.Length > 0) { closestGranary = granaries [0]; }
		
		for (var testGranary in granaries)
		{
			closestDis	= Vector3.Distance (transform.position, closestGranary.transform.position);
			testDis		= Vector3.Distance (transform.position, testGranary.transform.position);
			if (testDis < closestDis)
			{
				closestGranary	= testGranary;
			}
		}
		
		granaryTarg	= closestGranary.transform;
		targ	= granaryTarg;
	}
	carrying	+= capacity;
}

function DropOffFunc ()
{
	prop.SetActive (false);
	if (resourceType == "Wood") { townCenterScript.wood += carrying; }
	if (resourceType == "Gold") { townCenterScript.gold += carrying; }
	if (resourceType == "Food") { townCenterScript.food += carrying; }
	
	logProp.SetActive 	(false);
	meatProp.SetActive 	(false);
	goldProp.SetActive 	(false);
	
	carrying	= 0;
	if (resourceTarg != null)	{	targ	= resourceTarg;	}
}

function AnimationFunc	()
{
	if (!gathering)
	{
		if (velocity > 1)
		{
			if (carrying < 1)	{	humanObj.GetComponent.<Animation>().Play ("Walk");	}
			else				{	humanObj.GetComponent.<Animation>().Play ("WalkCarrying");	}
		}
		else
		{
									humanObj.GetComponent.<Animation>().Play ("Idle");
		}
	}
	else
	{
		lookTarg.y	= transform.position.y;
		transform.LookAt (lookTarg + (Vector3.up * 0.925));
		if 		(resourceType	== "Wood")	{	humanObj.GetComponent.<Animation>().Play ("TreeChop");	}
		else if (resourceType	== "Gold")	{	humanObj.GetComponent.<Animation>().Play ("GoldPick");	}
		else if (resourceType	== "Food")	{	humanObj.GetComponent.<Animation>().Play ("Carve");	}
	}
}