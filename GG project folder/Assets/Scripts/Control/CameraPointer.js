#pragma strict

var snap		: float;

var pointHit	: RaycastHit;
var workerAI	: WorkerAI;
var floating	: boolean;
var construction: Construction;
var ray			: Ray;
var layerMask	: LayerMask;

var hitPoint	: Vector3;
var placePoint	: Vector3;

function Update ()
{
	if (Input.GetButtonDown ("Fire1"))
	{	LeftClickFunc ();	}
	if (Input.GetButtonDown ("Fire2"))
	{	RightClickFunc ();	}
	if (floating)
	{	FloatingUpdate ();	}
}

function LeftClickFunc	()
{
	ray = Camera.main.ScreenPointToRay (Input.mousePosition);
	if (Physics.Raycast (ray, pointHit))
	{
		if (pointHit.transform.gameObject.tag == "Worker")
		{
			workerAI	= pointHit.transform.gameObject.GetComponent (WorkerAI);
//			layerMask	-= 10;
		}
		
		else if (pointHit.transform.gameObject.tag == "Resource" && workerAI != null)
		{	
			workerAI.targ	= pointHit.transform;
			workerAI.AssignedTask ();
			workerAI = null;
//			Debug.Log ("AssignedTarg");
		}
		else
		{
			workerAI	= null;
		}
	}
}

function FloatingUpdate ()
{
	ray = Camera.main.ScreenPointToRay (Input.mousePosition);
	
	if (Physics.Raycast (ray, pointHit, Mathf.Infinity, layerMask))
	{
		hitPoint	= pointHit.point;
		placePoint	= pointHit.point;
		placePoint	/= snap;
		placePoint	= Vector3	(Mathf.Round (placePoint.x), placePoint.y, Mathf.Round (placePoint.z));
		placePoint	*= snap;
		construction.floating	= true;
		construction.position	= placePoint;
//			Debug.Log	(placePoint);
	}
}

function RightClickFunc	()
{
	
}