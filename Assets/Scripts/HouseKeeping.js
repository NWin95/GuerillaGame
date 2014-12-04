#pragma strict

function Update ()
{
	if (Input.GetKeyDown (KeyCode.Alpha1))	{	Application.LoadLevel ("GGTestLab");	}
	if (Input.GetKeyDown (KeyCode.Alpha2))	{	Application.LoadLevel ("FirstLand");	}
	if (Input.GetKeyDown (KeyCode.Alpha3))	{	Application.LoadLevel ("SecondLand");	}
}