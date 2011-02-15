public var speed:float = 3.0;

function Update () {
    transform.position += Vector3.right * Time.deltaTime * speed;
    if(transform.position.x > 100) {
        transform.position.x = -26;
    }
}