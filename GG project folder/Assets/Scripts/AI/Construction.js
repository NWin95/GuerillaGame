#pragma strict
#pragma downcast

var townCenter	: TownCenter;
var camPointer	: CameraPointer;
var buildingsObj: Transform;
var position	: Vector3;
var type		: String;
var typePlace	: GameObject;
var canPlace	: boolean;
var floating	: boolean;

var placingObject	: GameObject;
var placeTag		: String;

var warehouse	: GameObject;
var granary		: GameObject;
var house		: GameObject;

var woodCost	: int;
var foodCost	: int;
var goldCost	: int;
var popCost		: int;
var popMaxCost: int;

function Start ()
{
	buildingsObj	= GameObject.Find ("Buildings").transform;
	townCenter		= GameObject.Find ("TownCenter").GetComponent (TownCenter);
}

function Update ()
{
	if (floating && placingObject != null)	
	{
		placingObject.transform.position	= position;							//comes from camera pointer script
		
		if (Input.GetButtonDown ("RotateRight"))	{	/* Debug.Log ("Rotate Right"); */	placingObject.transform.localEulerAngles.y	+= 45;	}
		if (Input.GetButtonDown ("RotateLeft"))		{	/* Debug.Log ("Rotate Left");  */	placingObject.transform.localEulerAngles.y	-= 45;	}
		
		if (Input.GetButtonDown ("Fire1") && canPlace)
		{
//			if ((townCenter.wood >= woodCost) && (townCenter.food >= foodCost) && (townCenter.gold >= goldCost) && (townCenter.population >= popCost))
//			{
				PlaceObjectFunc ();
//			}
		}
		if (Input.GetButtonDown ("Fire2"))					{	DeselectObjectFunc ();	}
		
//		Debug.Log (placingObject.name);
	}
}

function SelectBuildingGenaric ()
{
	if ((townCenter.wood >= woodCost) && (townCenter.food >= foodCost) && (townCenter.gold >= goldCost) && (townCenter.population >= popCost))
	{
//		Debug.Log ("Placing");
		floating			= true;
		camPointer.floating	= true;
		typePlace	= this.GetType().GetField(type).GetValue(this);
		placingObject	= Instantiate (typePlace, position, Quaternion (0,0,0,0));
		placingObject.layer	= 9;
		placingObject.tag	= "Placing";
		
		townCenter.wood			-= woodCost;
		townCenter.food 		-= foodCost;
		townCenter.gold			-= goldCost;
		townCenter.population	-= popCost;
		townCenter.populationMax-= popMaxCost;
	}
}

function PlaceObjectFunc ()
{
	Debug.Log ("PlaceObjectFunc");
	if (!Input.GetButton ("HoldPlace"))
	{
		floating			= false;
		camPointer.floating	= false;
		typePlace			= null;
	}
	placingObject.layer = 8;
	placingObject.tag	= placeTag;
	placingObject.transform.parent	= buildingsObj;
	placingObject		= null;
	if (Input.GetButton ("HoldPlace"))
	{
		SelectBuildingGenaric ();
	}
}

function DeselectObjectFunc ()
{
	Destroy	(placingObject);
	floating			= false;
	camPointer.floating	= false;
	typePlace			= null;
	type				= null;
	placingObject		= null;
	
	townCenter.wood			+= woodCost;
	townCenter.food 		+= foodCost;
	townCenter.gold			+= goldCost;
	townCenter.population	+= popCost;
	townCenter.populationMax+= popMaxCost;
}

function SelectWarehouse ()
{
	Debug.Log ("SelectWarehouse");
	type	= "warehouse";
	placeTag	= "Warehouse";
	
	woodCost	= 100;
	foodCost	= 0;
	goldCost	= 0;
	popCost		= 0;
	popMaxCost	= 0;
	
	SelectBuildingGenaric ();
}

function SelectGranary ()
{
	type	= "granary";
	placeTag	= "Granary";
	
	woodCost	= 100;
	foodCost	= 0;
	goldCost	= 0;
	popCost		= 0;
	popMaxCost	= 0;
	
	SelectBuildingGenaric ();
}

function SelectHouse ()
{
	type	= "house";
	placeTag	= "House";
	
	woodCost	= 50;
	foodCost	= 0;
	goldCost	= 0;
	popCost		= 0;
	popMaxCost	= -1;
	
	SelectBuildingGenaric ();
}