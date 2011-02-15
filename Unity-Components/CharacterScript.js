import System.Text.RegularExpressions;

var mainCamera:GameObject;
var conversationXMLFile:TextAsset;
var skin:GUISkin;
var nativeVerticalResolution = 1200;

// The movement node that a player must be on in order to
// talk to this character.
var movementNode:GameObject;

//-

private var originalColor:Color;
private var originalMainCameraPosition:Vector3;
private var originalMainCameraRotation:Vector3;
private var conversationIsActive = false;
private var displayConversationControls = false;
private var conversationObject:Hash;

private var activeSceneName:String;
private var activeScene:Hash;
private var lineCounter:int = 0;

function Start() {
    //originalColor = renderer.material.color;

    // Parse the xml conversation data
    var parser = new XMLParser();
    var conversationXML:XMLNode = parser.Parse(conversationXMLFile.text);

    conversationObject = { "sceneList": new ArrayList(),
                           "sceneData": {} };
    
    for(var sceneNode:XMLNode in conversationXML["conversation"][0]["scene"]) {
        var sceneObject:Hash = {
            "name": sceneNode["@name"],
            "goto": sceneNode["@goto"],
            "flyTo": sceneNode["@flyTo"],
            "meditateTo": sceneNode["@meditateTo"],
            "lines": new ArrayList(),
            "gotos": new ArrayList(),
            "setGameVars": new ArrayList()
        };

        for(var lineNode:XMLNode in sceneNode["line"]) {
            var lineObject = {
                "text": lineNode["_text"].TrimEnd().TrimStart(),
                "options": new ArrayList()
            };

            for(var optionNode:XMLNode in lineNode["option"]) {
                var optionObject = {
                    "text": optionNode["_text"].TrimEnd().TrimStart(),
                    "goto": optionNode["@goto"]
                };

                if(optionNode["@condition"]) {
                    optionObject["condition"] = optionNode["@condition"];
                }

                if(optionNode["@hideIfNotAvailable"] == "true") {
                    optionObject["hideIfNotAvailable"] = true;
                } else {
                    optionObject["hideIfNotAvailable"] = false;                    
                }

                if(optionNode["@makeInvisibleCondition"]) {
                    optionObject["makeInvisibleCondition"] = optionNode["@makeInvisibleCondition"];
                }
                
                lineObject["options"].Add(optionObject);
            }
            
            sceneObject["lines"].Add(lineObject);
        }

        for(var setGameVarNode:XMLNode in sceneNode["setGameVar"]) {
            var setGameVarObject = {
                "name": setGameVarNode["@name"],
                "value": setGameVarNode["@value"]
            };

            sceneObject["setGameVars"].Add(setGameVarObject);
        }

        for(var gotoNode:XMLNode in sceneNode["goto"]) {
            var gotoObject = {
                "sceneName": gotoNode["@sceneName"]
            };

            if(gotoNode["@condition"]) {
                gotoObject["condition"] = gotoNode["@condition"];
            }

            sceneObject["gotos"].Add(gotoObject);
        }
        
        conversationObject["sceneData"][sceneObject["name"]] = sceneObject;
        conversationObject["sceneList"].Add(sceneObject["name"]);
    }

    Debug.Log(Screen.width);

    /*
    if(Screen.width < 1280) {
        skin.font = Resources.Load("Fonts/GeosansLight18");
    } else {
        skin.font = Resources.Load("Fonts/GeosansLight24");        
    }*/

    skin.font = Resources.Load("Fonts/GeosansLight24");
}

function OnMouseDown() {
    if(!conversationIsActive 
       && mainCamera.GetComponent(CameraMovementNodeManagerScript).activeMovementNode == movementNode) {
        StartConversation();
    }
}

function StartConversation() {
    lineCounter = 0;
    
    originalMainCameraPosition = mainCamera.transform.position;
    originalMainCameraRotation = mainCamera.transform.eulerAngles;
    
    mainCamera.GetComponent(CameraMovementNodeManagerScript).DeactivateMovementControls();
    
    var characterCameraTransform:Transform = transform.Find("CharacterCamera");
    if(characterCameraTransform == null) {
        throw "There is no camera called 'CharacterCamera' attached to this character.";
    }
    
    iTween.MoveTo(mainCamera, {
        "position": characterCameraTransform.position,
        "time": 1,
        "easeType": "easeInOutSine",
        "oncomplete": "ShowConversationGUI",
        "oncompletetarget": gameObject
    });
    iTween.RotateTo(mainCamera, {
        "rotation": characterCameraTransform.eulerAngles,
        "time": 1,
        "easeType": "easeInOutSine"
    });
    
    LoadScene(conversationObject["sceneList"][0]);
}

function ShowConversationGUI() {
    displayConversationControls = true;
    conversationIsActive = true;
}

function EndConversation() {
    iTween.MoveTo(mainCamera, {
        "position": originalMainCameraPosition,
        "time": 1,
        "easeType": "easeInOutSine",
        "oncomplete": "EndConverationCallback",
        "oncompletetarget": gameObject
    });
    iTween.RotateTo(mainCamera, {
        "rotation": originalMainCameraRotation,
        "time": 1,
        "easeType": "easeInOutSine"
    });
    
    displayConversationControls = false;
}

function EndConverationCallback() {
    conversationIsActive = false;
    mainCamera.GetComponent(CameraMovementNodeManagerScript).ActivateMovementControls();
}


function OnGUI() {
    if(!displayConversationControls) {
        return;
    }

    // Hack to undo pause screen stuff
    mainCamera.GetComponent(CameraMovementNodeManagerScript).DeactivateMovementControls();
    
    GUI.skin = skin;

    if(!conversationObject["sceneData"].Contains(activeSceneName)) {
        throw "No scene matches the name " + activeSceneName;
    }
    
    var activeScene:Hash = conversationObject["sceneData"][activeSceneName];
    var activeLineObject:Hash = conversationObject["sceneData"][activeSceneName]["lines"][lineCounter];
    
    var guiWidth = 0.8;
    var guiXMargin = 0.1;
    var guiHeight = 0.3;
    var guiYMargin = 0.7;

    if(Screen.width < 1280) {
        guiHeight = 0.4;
        guiYMargin = 0.6;
    }

    if(Screen.width < 1024) {
        guiHeight = 0.5;
        guiYMargin = 0.5;
    }

    if(Screen.width / Screen.height < 1.4) {
        guiWidth = 0.95;
        guiXMargin = 0.025;
    
    }
    
    var screenWidth = Screen.width;
    var screenHeight = Screen.height;
    var positionRect:Rect = new Rect(screenWidth * guiXMargin, screenHeight * guiYMargin, screenWidth * guiWidth, screenHeight * guiHeight);
    var backgroundRect:Rect = new Rect(0, positionRect.y, screenWidth, positionRect.height);
    GUI.Box(backgroundRect, "");
    GUILayout.BeginArea(positionRect);
    GUILayout.BeginHorizontal();
    GUILayout.BeginVertical();
    
    GUILayout.Label(InterpolateText(activeLineObject["text"]));
    if(activeLineObject["options"].Count > 0) {
        for(var optionObject:Hash in activeLineObject["options"]) {
            var optionResult:boolean;
            
            if(optionObject["hideIfNotAvailable"] && !CheckOptionAvailability(optionObject)) {
                optionResult = false;
            } else if(optionObject["makeInvisibleCondition"] && GameStateManagerScript.instance.CheckCondition(optionObject["makeInvisibleCondition"])) {
                optionResult = false;
            } else {
                optionResult = GUILayout.Button(GetDisplayTextForOption(optionObject));
            }
            
            if(optionResult) {
                if(CheckOptionAvailability(optionObject)) {
                    LoadScene(optionObject["goto"]);
                } else {
                    // Todo: play sound effect.
                }
            }
        }
    } else {
        var moreButtonText:String;

        if(lineCounter + 1 >= activeScene["lines"].Count) {
            if(activeScene["goto"]) {
                moreButtonText = "(more)";
            } else if(activeScene["flyTo"]) {
                moreButtonText = "(fly)";
            } else if(activeScene["meditateTo"]) {
                moreButtonText = "(close eyes)";
            } else {
                moreButtonText = "(end conversation)";
            }
        } else {
            moreButtonText = "(more)";
        }
        
        if(GUILayout.Button(moreButtonText)) {
            lineCounter += 1;
            
            if(lineCounter >= activeScene["lines"].Count) {
                if(activeScene["goto"]) {
                    LoadScene(activeScene["goto"]);
                    lineCounter = 0;
                } else if(activeScene["flyTo"]) {
                    GameStateManagerScript.instance.SetGameVar("travel_method", "balloon");
                    EndConversation();
                    GameStateManagerScript.instance.LoadLevel(activeScene["flyTo"]);
                } else if(activeScene["meditateTo"]) {
                    GameStateManagerScript.instance.SetGameVar("travel_method", "meditation");
                    displayConversationControls = false;                    
                    //EndConversation();
                    GameStateManagerScript.instance.LoadLevelWithoutFlyThrough(activeScene["meditateTo"]);
                } else {
                    EndConversation();
                }
            }
        }
    }
    
    GUILayout.EndVertical();
    GUILayout.EndHorizontal();
    GUILayout.EndArea();
}

function LoadScene(sceneName:String) {
    // Load a scene and update any variables it changes

    lineCounter = 0;
    
    activeSceneName = sceneName;

    if(!conversationObject["sceneData"].Contains(activeSceneName)) {
        throw "No scene matches the name " + activeSceneName;
    }
    
    var activeScene = conversationObject["sceneData"][activeSceneName];
    
    for(var setGameVarObject:Hash in activeScene["setGameVars"]) {
        GameStateManagerScript.instance.SetGameVar(setGameVarObject["name"], setGameVarObject["value"]);
    }

    for(var gotoObject:Hash in activeScene["gotos"]) {
        if(gotoObject.Contains("condition")) {
            if(GameStateManagerScript.instance.CheckCondition(gotoObject["condition"])) {
                LoadScene(gotoObject["sceneName"]);
                return;
            }
        } else {
            LoadScene(gotoObject["sceneName"]);
            return;
        }
    }
}

function InterpolateText(rawText:String):String {
    //var variableMatches:MatchCollection = Regex.Matches(rawText, "\$\[(.*)\]");
    var matches:MatchCollection = Regex.Matches(rawText, "\\$\\[(.*?)\\]");
    
    if(matches.Count) {
        for(var match:Match in matches) {
            var variableName:String = match.Groups[1].Value;
            var stringToReplace:String = match.Value;
            var variableValue:String = GameStateManagerScript.instance.GetGameVar(variableName).ToString();
            rawText = rawText.Replace(stringToReplace, variableValue);
        }
    }

    return rawText;
}

function GetDisplayTextForOption(optionObject:Hash):String {
    if(CheckOptionAvailability(optionObject)) {
        return InterpolateText(optionObject["text"]);
    } else {
        var allCharactersPattern:Regex = new Regex("\\w");
        return allCharactersPattern.Replace(optionObject["text"], "-");
    }
}

function CheckOptionAvailability(optionObject):boolean {
    if(!optionObject.Contains("condition") || GameStateManagerScript.instance.CheckCondition(optionObject["condition"])) {
        return true;
    } else {
        return false;
    }
}