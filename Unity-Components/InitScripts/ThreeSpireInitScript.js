
function Start () {
    GameStateManagerScript.instance.SetGameVar("current_location", "ThreeSpireSettlement");
    
    if(GameStateManagerScript.instance.GetGameVar("travel_method") == "meditation") {
        var movementManager:CameraMovementNodeManagerScript = Camera.main.GetComponent("CameraMovementNodeManagerScript");
        movementManager.firstMovementNode = movementManager.activeMovementNode = GameObject.Find("mn_second_platform");
    }
}