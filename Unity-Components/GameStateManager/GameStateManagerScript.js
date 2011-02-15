public var gameVariablesXMLFile:TextAsset;

public static var instance:GameStateManagerScript;

private var gameVariables:Hash;
private var gameState:Hash;

public function Awake() {
    if(!GameStateManagerScript.instance) {
        GameStateManagerScript.instance = this;
    } else {
        return;
    }
    
    CreateEmptyGameState();
    ReadGameStateFromPlayerPrefs();

    var listener = Camera.main.GetComponent(AudioListener);
    listener.volume = 0;
    FadeInAudio(4);
}

public function CreateEmptyGameState() {
    var parser = new XMLParser();
    var gameVariablesXML:XMLNode = parser.Parse(gameVariablesXMLFile.text);

    // Set up an empty game state.
    gameVariables = {};    
    gameState = {};
    
    for(var variableNode:XMLNode in gameVariablesXML["gameVariables"][0]["variable"]) {
        gameVariables[variableNode["@name"]] = {
            "name": variableNode["@name"],
            "type": variableNode["@type"]
        };

        SetGameVar(variableNode["@name"], variableNode["@default"]);
    }
}

public function SetGameVar(varName:String, value:String) {
    //Debug.Log("trying to set " + varName + " to " + value);
    if(!gameVariables.Contains(varName)) {
        throw "No such game variable " + varName;
    }

    if(gameVariables[varName]["type"] == "string") {
        gameState[varName] = value;
    } else if(gameVariables[varName]["type"] == "boolean") {
        if(value == "true" || value == "True") {
            gameState[varName] = true;
        } else {
            gameState[varName] = false;            
        }
    } else if(gameVariables[varName]["type"] == "integer") {
        if(value.StartsWith("+")) {
            gameState[varName] += parseInt(value);
        } else if(value.StartsWith("-")) {
            gameState[varName] -= parseInt(value);
        } else {
            gameState[varName] = parseInt(value);
        }
    }
}

public function GetGameVar(varName:String) {
    if(!gameVariables.Contains(varName)) {
        throw "No such game variable " + varName;
    }

    return gameState[varName];
}

public function CheckCondition(rawCondition:String):boolean {
    if(!rawCondition) {
        return false;
    }
    
    if(rawCondition.IndexOf("|") > -1 && rawCondition.IndexOf("&") > -1) {
        throw "You cannot mix '&' and '|' in conditions!";
    }

    var subConditions:String[];
    if(rawCondition.IndexOf("|") > -1) {
        subConditions = rawCondition.Split("|"[0]);

        var anyConditionPassed:boolean = false;
        for(var condition:String in subConditions) {
            if(CheckCondition(condition)) {
                anyConditionPassed = true;
            }
        }

        return anyConditionPassed;
    }

    if(rawCondition.IndexOf("&") > -1) {
         subConditions = rawCondition.Split("&"[0]);

        var anyConditionFailed:boolean = false;
        for(var condition:String in subConditions) {
            if(!CheckCondition(condition)) {
                anyConditionFailed = true;
            }
        }

        return !anyConditionFailed;
    }

    if(rawCondition.IndexOf("=") > -1) {
        subConditions = rawCondition.Split("="[0]);
        
        if(GetGameVar(subConditions[0]).ToString() == subConditions[1]) {
            return true;
        } else {
            return false;
        }
    }

    if(rawCondition.StartsWith("!")) {
        return !GetGameVar(rawCondition.Replace("!",""));
    } else {
        return GetGameVar(rawCondition);
    }
}

function Update() {
    /*
    if(Input.GetKeyDown("space")) {
        LoadLevel("ArchivesOfTheOldInstitution");
    }*/
}

public function LoadLevel(levelName:String) {
    SetGameVar("next_location", levelName);
    WriteGameStateToPlayerPrefs();
    Camera.main.GetComponent(FadeInOutScript).fadeOut();
    FadeOutAudio(4);
    yield WaitForSeconds(4);
    Application.LoadLevel("FlyThrough");
    //Application.LoadLevel(levelName);
}

public function LoadLevelWithoutFlyThrough(levelName:String) {
    Camera.main.GetComponent(FadeInOutScript).fadeOut();
    FadeOutAudio(4);    
    yield WaitForSeconds(4);
    SetGameVar("game_in_progress", "true");
    WriteGameStateToPlayerPrefs();
    Application.LoadLevel(levelName);
}

public function WriteGameStateToPlayerPrefs() {
    for(var variableName:String in gameState.Keys) {
        PlayerPrefs.SetString(variableName, GetGameVar(variableName).ToString());
    }
}

public function ReadGameStateFromPlayerPrefs() {
    for(var variableName:String in gameVariables.Keys) {
        if(PlayerPrefs.GetString(variableName, "") != "") {
            SetGameVar(variableName, PlayerPrefs.GetString(variableName));
        }
    }
}

public function ClearAllData() {
    CreateEmptyGameState();
    WriteGameStateToPlayerPrefs();
}

public function FadeOutAudio(duration:float) {
    var listener = Camera.main.GetComponent(AudioListener);
    var startTime = Time.time;
    var endTime = startTime + duration;

    while (Time.time < endTime) {
        var i = (Time.time - startTime) / duration;
        listener.volume = (1-i);
        yield;
    }
}

public function FadeInAudio(duration:float) {
    Debug.Log("fading in");
    var listener = Camera.main.GetComponent(AudioListener);
    var startTime = Time.time;
    var endTime = startTime + duration;

    while (Time.time < endTime) {
        var i = (Time.time - startTime) / duration;
        listener.volume = i;
        yield;
    }
    
    Debug.Log(listener.volume);    
    Debug.Log("done fading in");
}

public function SaveAndQuit() {
    WriteGameStateToPlayerPrefs();
    Camera.main.GetComponent(FadeInOutScript).fadeOut();
    FadeOutAudio(4);    
    yield WaitForSeconds(4);
    Application.LoadLevel("Menu");
}

/*
function Crossfade ( a1 : AudioSource, a2 : AudioSource, duration : float )
{
    var startTime = Time.time;
    var endTime = startTime + duration;

    while (Time.time < endTime) {

        var i = (Time.time - startTime) / duration;

        a1.volume = (1-i);
        a2.volume = i;

       yield;

    }
}*/