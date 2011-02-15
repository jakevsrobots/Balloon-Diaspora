// FadeInOut
//
//--------------------------------------------------------------------
//                        Public parameters
//--------------------------------------------------------------------

public var fadeOutTexture : Texture2D;
public var fadeSpeed = 0.3;

var drawDepth = -1000;

//--------------------------------------------------------------------
//                       Private variables
//--------------------------------------------------------------------

private var alpha = 1.0; 

private var fadeDir = -1;

//--------------------------------------------------------------------
//                       Runtime functions
//--------------------------------------------------------------------

//--------------------------------------------------------------------

function OnGUI(){
    
    alpha += fadeDir * fadeSpeed * Time.deltaTime;  
    alpha = Mathf.Clamp01(alpha);   
    
    GUI.color.a = alpha;
    
    GUI.depth = drawDepth;
    
    GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), fadeOutTexture);
}

//--------------------------------------------------------------------

public function fadeIn(){
    fadeDir = -1;   
}

//--------------------------------------------------------------------

public function fadeOut(){
    fadeDir = 1;    
}

public function Start(){
    alpha=1;
    fadeIn();
}
 