var skin:GUISkin;

private var isPaused:boolean = false;
private var isQuitting:boolean = false;

function Update() {
    if(!isQuitting) {
        if(Input.GetKeyDown("escape")) {
            isPaused = !isPaused;

            if(isPaused) {
                Pause();
            } else {
                UnPause();
            }
        }
    }
}

function OnGUI () {
    GUI.skin = skin;
    
    if(isPaused) {
        var guiWidth = 0.6;
        var guiXMargin = 0.2;
        var guiYMargin = 0.2;        
        var guiHeight = 0.6;
        
        var positionRect:Rect = new Rect(Screen.width * guiXMargin, Screen.height * guiYMargin, Screen.width * guiWidth, Screen.height * guiHeight);
        
        var backgroundRect:Rect = new Rect(0, 0, Screen.width, Screen.height);
        GUI.Box(backgroundRect, "");
        
        GUILayout.BeginArea(positionRect);

        GUILayout.BeginHorizontal();
        GUILayout.BeginVertical();

        GUILayout.Label("Paused", "Title");

        if(GUILayout.Button("Return to game")) {
            UnPause();
            isPaused = false;
        }
        
        if(GUILayout.Button("Save and quit")) {
            isQuitting = false;
            UnPause();
            GameStateManagerScript.instance.SaveAndQuit();
        }

        GUILayout.EndVertical();
        GUILayout.EndHorizontal();    

        GUILayout.EndArea();
    } else {
        //Debug.Log("NOT paused");        
    }
}

function Pause() {
    Time.timeScale = 0;
    Camera.main.GetComponent("CameraMovementNodeManagerScript").DeactivateMovementControls();
}

function UnPause() {
    Time.timeScale = 1;                
    Camera.main.GetComponent("CameraMovementNodeManagerScript").ActivateMovementControls();
}