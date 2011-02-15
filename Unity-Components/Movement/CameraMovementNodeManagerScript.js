var movementActive:boolean = true;

var firstMovementNode:GameObject;

var moveSpeed:float = 4.0;

var upCursorImage:Texture2D;
var downCursorImage:Texture2D;
var leftCursorImage:Texture2D;
var rightCursorImage:Texture2D;
var lockImage:Texture2D;
var notAllowedImage:Texture2D;
var talkImage:Texture2D;
var activeMovementNode:GameObject;

// --
private var inMotion:boolean = false;
private var targetMovementNode:GameObject;
private var activeScreenSector:String;
private var cursorImage:Texture2D;


function Start() {
    transform.position = firstMovementNode.transform.position;
    transform.eulerAngles = firstMovementNode.transform.eulerAngles;
    activeMovementNode = firstMovementNode;

    ActivateMovementControls();
}

public function ActivateMovementControls() {
    Screen.showCursor = false;
    movementActive = true;
    inMotion = false;
}

public function DeactivateMovementControls() {
    Screen.showCursor = true;
    movementActive = false;
}

function MoveCameraToTargetNode(target:GameObject) {
    targetMovementNode = target;
    var targetTransform = target.transform;
    inMotion = true;

    var distance:float = Vector3.Distance(target.transform.position, activeMovementNode.transform.position);

    var timeToMove:float = Mathf.Clamp(distance / moveSpeed, 1, 5);
    
    iTween.MoveTo(gameObject, {
        "position": targetTransform.position,
        "time": timeToMove,
        "easeType": "easeInOutSine",
        "oncomplete": "CompleteCameraMovement",
        "oncompletetarget": gameObject
    });
    
    iTween.RotateTo(gameObject, {
        "rotation": targetTransform.eulerAngles,
        "time": timeToMove,
        "easeType": "easeInOutSine",
        "oncomplete": "CompleteCameraMovement",
        "oncompletetarget": gameObject
    });
}

function CompleteCameraMovement() {
    //Debug.Log("MN: " + activeMovementNode.name);
    activeMovementNode = targetMovementNode;
    inMotion = false;
}

function CanMoveToNode(node:GameObject) {
    if(node == null) {
        return false;
    }

    // TODO: check game state flags to see if this node is locked.
    var movementNodeComponent = node.GetComponent(MovementNodeScript);

    // Everything's ok to move.
    return true;
}

function TryMovementToNode(node:GameObject) {
    if(CanMoveToNode(node)) {
        MoveCameraToTargetNode(node);
    }
}

function Update() {
    SetCursor();
}

function SetCursor() {
    var camera = GetComponent(Camera);
    var screenWidth = camera.pixelWidth;
    var screenHeight = camera.pixelHeight;
    
    if(movementActive && !inMotion) {
        // Check for objects that may be interacted with
        var objectHit:RaycastHit;
        var ray = camera.ScreenPointToRay(Input.mousePosition);
        if(Physics.Raycast(ray, objectHit)) {
            var characterScript:CharacterScript = objectHit.collider.gameObject.GetComponent(CharacterScript);
            if(characterScript && characterScript.movementNode == activeMovementNode) {
                cursorImage = talkImage;
                return;
            }
        }
        
        // Check for available movement & cursor position
        var movementNodeComponent:MovementNodeScript = activeMovementNode.GetComponent(MovementNodeScript);
        var hoveringMovementNode:GameObject;
        
        if(Input.mousePosition.x < screenWidth * 0.25) {
            activeScreenSector = "left";
            hoveringMovementNode = movementNodeComponent.leftNode;
            cursorImage = leftCursorImage;
        } else if(Input.mousePosition.x > screenWidth * 0.75) {
            activeScreenSector = "right";
            hoveringMovementNode = movementNodeComponent.rightNode;
            cursorImage = rightCursorImage;
        } else if(Input.mousePosition.y > screenHeight * 0.3) {
            activeScreenSector = "up";
            hoveringMovementNode = movementNodeComponent.upNode;
            cursorImage = upCursorImage;
        } else {
            activeScreenSector = "down";
            hoveringMovementNode = movementNodeComponent.downNode;
            cursorImage = downCursorImage;
        }

        if(CanMoveToNode(hoveringMovementNode)) {
            if(Input.GetMouseButtonDown(0)) {
                if(activeScreenSector == "left") {
                    TryMovementToNode(movementNodeComponent.leftNode);
                    if(movementNodeComponent.leftNode != null) {
                        MoveCameraToTargetNode(movementNodeComponent.leftNode);
                    }
                } else if(activeScreenSector == "right") {
                    if(movementNodeComponent.rightNode != null) {
                        MoveCameraToTargetNode(movementNodeComponent.rightNode);
                    }
                } else if(activeScreenSector == "up") {
                    if(movementNodeComponent.upNode != null) {
                        MoveCameraToTargetNode(movementNodeComponent.upNode);
                    }
                } else if(activeScreenSector == "down") {
                    if(movementNodeComponent.downNode != null) {
                        MoveCameraToTargetNode(movementNodeComponent.downNode);
                    }                
                }
            }
        } else if(hoveringMovementNode == null) {
            cursorImage = notAllowedImage;
        } else if(hoveringMovementNode.GetComponent(MovementNodeScript).IsLocked()) {
            cursorImage = lockImage;
        } else {
            cursorImage = notAllowedImage;
        }
    }
    
}

function OnGUI() {
    if(movementActive && !inMotion) {
        var mousePos : Vector3 = Input.mousePosition;
        var pos : Rect = Rect(mousePos.x, Screen.height - mousePos.y, 128, 64);
        
        GUI.Label(pos, cursorImage);
    }
}