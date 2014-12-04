#pragma strict

function OnTriggerEnter (col : Collider)
{
//	Debug.Log ("enter col");
	if (col.gameObject.tag	== "Player")
	{
		col.transform.position	+= Vector3.up * 15;
	}
}