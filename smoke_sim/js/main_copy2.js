// global variables
var renderer;
var scene;
var camera;

var control;

function init() {

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
//        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

    camera.updateProjectionMatrix();

    // create a render, sets the background color and the size
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);


    // position and point the camera to the center of the scene
    camera.position.x = -0.5;
    camera.position.y = 0.2;
    camera.position.z = 0.3;
    camera.lookAt(scene.position);

    var dirLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
    scene.add(dirLight);
    dirLight.position.set(-0.5, 0.0, 0.5);

    var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
    scene.add(fillLight);
    fillLight.position.set(.5, 0, .5);
    
    var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    scene.add(backLight);
    backLight.position.set(.5, 0, -.5);

    // add the output of the renderer to the html element
    document.body.appendChild(renderer.domElement);




    control = new function () {
        this.left = camera.left;
        this.right = camera.right;
        this.top = camera.top;
        this.bottom = camera.bottom;
        this.far = camera.far;
        this.near = camera.near;

        this.updateCamera = function () {
            camera.left = control.left;
            camera.right = control.right;
            camera.top = control.top;
            camera.bottom = control.bottom;
            camera.far = control.far;
            camera.near = control.near;

            camera.updateProjectionMatrix();
        };
    };

    addControls(control);


    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath('/smoke_sim/obj/');
    mtlLoader.setPath('/smoke_sim/obj/');
    mtlLoader.load('CandleStick2.mtl', function (materials) {
        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setPath('/smoke_sim/obj/');
        objLoader.load('CandleStick2.obj', function (object) {

        scene.add(object);
        object.position.set(0, -0.4, 0);
        });
    });

    // call the render function
    render();
}

function addCube(x, y) {
    // create a cube and add to scene
    var cubeGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    var cubeMaterial = new THREE.MeshLambertMaterial();
    cubeMaterial.color = new THREE.Color(0xffffff * Math.random())
    cubeMaterial.transparent = true;
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.name = 'cube';
    cube.position.x = 0.1 * x - .5;
    cube.position.y = 0;
    cube.position.z = 0.1 * y - .5;
    scene.add(cube);

}

function addControls(controlObject) {
    var gui = new dat.GUI();
    gui.add(controlObject, 'left', -1, 0).onChange(controlObject.updateCamera);
    gui.add(controlObject, 'right', 0, 1).onChange(controlObject.updateCamera);
    gui.add(controlObject, 'top', 0, 1).onChange(controlObject.updateCamera);
    gui.add(controlObject, 'bottom', -1, 0).onChange(controlObject.updateCamera);
    gui.add(controlObject, 'far', 0, 1).onChange(controlObject.updateCamera);
    gui.add(controlObject, 'near', 0, 1).onChange(controlObject.updateCamera);
}

function render() {
    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

// calls the init function when the window is done loading.
window.onload = init;
