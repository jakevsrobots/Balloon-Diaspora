var leftNode:GameObject;
var rightNode:GameObject;
var upNode:GameObject;
var downNode:GameObject;


function Update () {
}

function OnDrawGizmos() {
    Gizmos.color = Color.blue;

    if(leftNode) {
        Gizmos.DrawLine(transform.position, leftNode.transform.position);
    }

    if(rightNode) {
        Gizmos.DrawLine(transform.position, rightNode.transform.position);
    }
    
    if(upNode) {
        Gizmos.DrawLine(transform.position, upNode.transform.position);
    }
    
    if(downNode) {
        Gizmos.DrawLine(transform.position, downNode.transform.position);
    }
}

function IsLocked() {
    return false;
}