
function Start () {
    GameStateManagerScript.instance.ClearAllData();
    
    yield WaitForSeconds(96);
    Camera.main.GetComponent(FadeInOutScript).fadeOut();
    GameStateManagerScript.instance.FadeOutAudio(4);    
    yield WaitForSeconds(4);
    Application.LoadLevel("Menu");
}