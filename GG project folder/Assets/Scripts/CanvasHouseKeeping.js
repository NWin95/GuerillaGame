#pragma strict

var construction	: Construction;

var warehouseButton	: UI.Button;
var granaryButton	: UI.Button;
var houseButton		: UI.Button;

function Start ()
{
	construction	= GameObject.Find ("GodCam").GetComponent (Construction);
	warehouseButton.onClick.AddListener (construction.SelectWarehouse);
	granaryButton.onClick.AddListener	(construction.SelectGranary);
	houseButton.onClick.AddListener		(construction.SelectHouse);
}