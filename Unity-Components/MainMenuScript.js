var skin:GUISkin;

private var _alpha:float = 0;

function Start() {
    if(Screen.width < 1024) {
        skin.font = Resources.Load("Fonts/GeosansLight12");
    } else if(Screen.height < 768) {
        skin.font = Resources.Load("Fonts/GeosansLight18");
    } else {
        skin.font = Resources.Load("Fonts/GeosansLight24");
    }

    Screen.showCursor = true;
}

function OnGUI() {
    GUI.skin = skin;
    
    var guiHeight = 0.5;
    var guiYMargin = 0.5;

    var guiWidth;
    var guiXMargin;
    var labelFontName;
    var labelFontSize;
    
    if(Screen.width > 1024) {
        guiWidth = 0.6;
        guiXMargin = 0.2;
        labelFontName = "GeoSansLight24";
        labelFontSize = 24;
    } else {
        guiWidth = 0.8;
        guiXMargin = 0.1;
        labelFontName = "GeoSansLight16";
        labelFontSize = 16;
    }

    skin.button.fontSize = labelFontSize;
    skin.label.fontSize = labelFontSize;

    var positionRect:Rect = new Rect(Screen.width * guiXMargin, Screen.height * guiYMargin, Screen.width * guiWidth, Screen.height * guiHeight);    
    GUILayout.BeginArea(positionRect);

    GUILayout.BeginHorizontal();
    GUILayout.BeginVertical();


    GUILayout.Label("Balloon Diaspora", "Title");
    GUILayout.Label("a game by Cardboard Computer, with music by Oliver Blank\n", "Subtitle");

    if(GUILayout.Button("Start")) {
        GameStateManagerScript.instance.ClearAllData();
        GameStateManagerScript.instance.LoadLevelWithoutFlyThrough("Valley");
    } else if(GameStateManagerScript.instance.GetGameVar("game_in_progress") && GUILayout.Button("Continue")) {
        GameStateManagerScript.instance.LoadLevelWithoutFlyThrough(GameStateManagerScript.instance.GetGameVar("current_location"));
    }

    if(GUILayout.Button("Quit")) {
        Application.Quit();
    }

    
    GUILayout.EndVertical();
    GUILayout.EndHorizontal();    

    GUILayout.EndArea();
}