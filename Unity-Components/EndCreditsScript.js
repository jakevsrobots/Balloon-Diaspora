var skin:GUISkin;

private var credits:Array;
private var fadeState:FadeState;
private var fadeLength:float = 2;
private var holdLength:float = 5;
private var holdTimer:float = 0;
private var currentAlpha:float;
private var currentCreditsLine:int = 0;

enum FadeState {fading_out, fading_in, holding, stopped};

function Start() {
    if(Screen.width < 1024) {
        skin.font = Resources.Load("Fonts/GeosansLight12");
    } else if(Screen.height < 768) {
        skin.font = Resources.Load("Fonts/GeosansLight18");
    } else {
        skin.font = Resources.Load("Fonts/GeosansLight24");
    }

    credits = [
        "a game by Cardboard Computer",
        "with music by Oliver Blank",
        "sound effects from freesound users:",
        "ingeos, pooleside, acclivity, Arctura, and Robinhood",
        "all licensed cc-sampling-plus",
        "thanks to Julio Obelleiro & Claudia Hart for project guidance",
        "special thanks to testers: Mark Beasley, Ben Cabot,",
        "Bredon Clay, Chris Cobb, James Connolly,",
        "Richard Hofmeier, Nathan Klose, Przemysław Müller,",
        "Jack Nilssen, and Mike Oliphant.",
        ""
    ];

    fadeState = FadeState.fading_in;
    currentAlpha = 0;
}

function Update() {
    if(fadeState == FadeState.fading_in) {
        currentAlpha += (1 / fadeLength) * Time.deltaTime;
        if(currentAlpha >= 1) {
            currentAlpha = 1;
            holdTimer = 0;
            fadeState = FadeState.holding;
        }
    } else if(fadeState == FadeState.fading_out) {
        currentAlpha -= (1 / fadeLength) * Time.deltaTime;
        if(currentAlpha <= 0) {
            currentAlpha = 0;
            GetNextCreditsLine();
            fadeState = FadeState.fading_in;
        }
    } else if(fadeState == FadeState.holding) {
        holdTimer += Time.deltaTime;
        if(holdTimer >= holdLength) {
            fadeState = FadeState.fading_out;
        }
    }
}

function GetNextCreditsLine() {
    if(currentCreditsLine+1 >= credits.length) {
        fadeState = FadeState.stopped;
    } else {
        currentCreditsLine += 1;
    }
}

function OnGUI() {
    GUI.skin = skin;
    
    var guiHeight = 0.4;
    var guiYMargin = 0.6;

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

    GUI.color = new Color(1, 1, 1, 1);    
    GUILayout.Label("Balloon Diaspora", "Title");
    GUI.color = new Color(1, 1, 1, currentAlpha);
    
    GUILayout.Label(credits[currentCreditsLine], "Subtitle");
    
    GUILayout.EndVertical();
    GUILayout.EndHorizontal();    

    GUILayout.EndArea();
}