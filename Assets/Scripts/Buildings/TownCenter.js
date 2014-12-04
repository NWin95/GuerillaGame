#pragma strict

var guiObj		: GameObject;

var food		: int;
var wood		: int;
var population	: int;
var gold		: int;

var canvas			: Canvas;
var foodText		: UI.Text;
var woodText		: UI.Text;
var populationText	: UI.Text;
var goldText		: UI.Text;

var foodStart		: int;
var woodStart		: int;
var populationStart	: int;
var goldStart		: int;

var populationMax	: int;

var worker			: Transform;
var eatMultiplyer	: int;
var dinnerTime		: float;
var readyToEat		: boolean;

function Start ()
{
//	guiObj	= GameObject.Find ("GUI");
	canvas			= GameObject.Find ("Canvas").GetComponent (Canvas);
	foodText		= GameObject.Find ("FoodText").GetComponent (UI.Text);
	woodText		= GameObject.Find ("WoodText").GetComponent (UI.Text);
	populationText	= GameObject.Find ("PopulationText").GetComponent (UI.Text);
	goldText		= GameObject.Find ("GoldText").GetComponent (UI.Text);
	
	foodText.color		= Color.white;
	woodText.color		= Color.white;
	populationText.color= Color.white;
	goldText.color		= Color.white;
	
	food		= foodStart;
	wood		= woodStart;
	population	= populationStart;
	gold		= goldStart;
	
	foodText.text		= "Food: " + food;
	woodText.text		= "Wood: " + wood;
	goldText.text		= "Gold: " + gold;
	populationText.text	= "Population: " + population + "/" + populationMax;
	
	DinnerTimeFunc ();
//	canvas.renderMode = RenderMode.Overlay;
}

function Update	()
{
	if (Input.GetKeyDown (KeyCode.P))
	{
		BuildSettler ();
	}
	
	if (readyToEat)
	{
		DinnerTimeFunc ();
	}
	
	foodText.text		= "Food: " + food;
	woodText.text		= "Wood: " + wood;
	goldText.text		= "Gold: " + gold;
	populationText.text	= "Population: " + population + "/" + populationMax;
}

function BuildSettler	()
{
//	Debug.Log ("BuildSettler");
	if ((population < populationMax) && (food > 50))
	{
		population += 1;	food -= 50;
		
//		foodText.text		= "Food: " + food;
//		woodText.text		= "Wood: " + wood;
//		populationText.text	= "Population: " + population + "/" + populationMax;
		
		Instantiate (worker, (transform.position + transform.forward * -2.5), (transform.rotation * Quaternion.Euler (0,180,0)));
	}
}

function DinnerTimeFunc	()
{
	readyToEat	= false;
//	Debug.Log ("DinnerTime");
	food -= population * eatMultiplyer;
	yield WaitForSeconds (dinnerTime);
	readyToEat	= true;
}