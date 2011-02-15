var speed = 1;
var chunkSize = 125;
var numChunks = 4;
var scale = 0.1;
var heightOffset = 70;

function Start() {
    //transform.Rotate(Random.value * 360, 0, 0);
    //transform.Rotate(0, Random.value * 360, 0);
    transform.localEulerAngles = Vector3(0, Random.value * 360, 0);
}

function Update() {
    //transform.Translate(0, 0, Time.deltaTime * speed * -1);
    transform.position = Vector3(0, heightOffset, transform.position.z - (Time.deltaTime * speed));
    
    if(transform.position.z < -(chunkSize / 2) * scale) {
        //transform.position.z = chunkSize * numChunks * scale;
        transform.position = Vector3(0, heightOffset, chunkSize * numChunks * scale);
        transform.localEulerAngles = Vector3(0, Random.value * 360, 0);        
    }
}
