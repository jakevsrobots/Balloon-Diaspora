var skin:GUISkin;

private var skipping:boolean = false;

function Start() {
    Screen.showCursor = true;    
    yield WaitForSeconds(26);
    if(!skipping) {
        LoadNextLevel();
    }
}

function Update() {
}

function LoadNextLevel() {
    Camera.main.GetComponent(FadeInOutScript).fadeOut();
    GameStateManagerScript.instance.FadeOutAudio(4);
    yield WaitForSeconds(4);
    var levelName = GameStateManagerScript.instance.GetGameVar("next_location");
    Application.LoadLevel(levelName);    
}

function OnGUI() {
    GUI.skin = skin;

    var buttonWidth = 180;
    var buttonHeight = 30;
    var positionRect:Rect = new Rect(Screen.width - buttonWidth - buttonHeight * 0.5, Screen.height - buttonHeight * 1.5, buttonWidth, buttonHeight);
    
    if(GUI.Button(positionRect, "Skip to destination")) {
        skipping = true;
        LoadNextLevel();
    }
}