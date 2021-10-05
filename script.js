//COLORS
var Colors = {
  red: 0xf25346,
  white: 0xd8d0d1,
  brown: 0x59332e,
  pink: 0xf5986e,
  brownDark: 0x23190f,
  blue: 0x68c3c0,

  // new airplane
  StrongBlue: "#14279B",
  MiddleBlue: "#3D56B2",
  WeekBlue: "#5C7AEA",
  gray: "#E6E6E6",
};

// THREEJS RELATED VARIABLES

var scene,
  camera,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  renderer,
  container;

//SCREEN & MOUSE VARIABLES

var HEIGHT,
  WIDTH,
  mousePos = { x: 0, y: 0, z: 0 };

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function createScene() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
  camera.position.x = 70;
  camera.position.z = 200;
  camera.position.y = 50;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  container = document.getElementById("world");
  container.appendChild(renderer.domElement);

  window.addEventListener("resize", handleWindowResize, false);
}

// HANDLE SCREEN EVENTS

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

// LIGHTS

var ambientLight, hemisphereLight, shadowLight;

function createLights() {
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
  shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;
  // an ambient light modifies the global color of a scene and makes the shadows softer
  ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);
  scene.add(ambientLight);
  scene.add(hemisphereLight);
  scene.add(shadowLight);
}

var AirPlane = function () {
  this.mesh = new THREE.Object3D();
  this.mesh.name = "airPlane";

  // Create Engine
  
  var geomEngine = new THREE.BoxGeometry(25, 50, 50, 1, 1, 1);
  var matEngine = new THREE.MeshPhongMaterial({
    color: Colors.gray,
    shading: THREE.FlatShading,
  });
  var engine = new THREE.Mesh(geomEngine, matEngine);
  engine.position.x = 40;
  engine.castShadow = true;
  engine.receiveShadow = true;
  this.mesh.add(engine);

  // Create Tailplane

  var geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
  var matTailPlane = new THREE.MeshPhongMaterial({
    color: Colors.WeekBlue,
    shading: THREE.FlatShading,
  });
  var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
  tailPlane.position.set(-35, 25, 0);
  tailPlane.castShadow = true;
  tailPlane.receiveShadow = true;
  this.mesh.add(tailPlane);

  // Create Wing

  var geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
  var matSideWing = new THREE.MeshPhongMaterial({
    color: Colors.WeekBlue,
    shading: THREE.FlatShading,
  });
  var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
  sideWing.position.set(0, 0, 0);
  sideWing.castShadow = true;
  sideWing.receiveShadow = true;
  this.mesh.add(sideWing);

  // Propeller

  var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
  var matPropeller = new THREE.MeshPhongMaterial({
    color: Colors.brown,
    shading: THREE.FlatShading,
  });
  this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
  this.propeller.castShadow = true;
  this.propeller.receiveShadow = true;

  // PropellerLeft

  var geomPropellerLeft = new THREE.BoxGeometry(10, 8, 10, 1, 1, 1);
  var matPropellerLeft = new THREE.MeshPhongMaterial({
    color: Colors.brown,
    shading: THREE.FlatShading,
  });
  this.propellerLeft = new THREE.Mesh(geomPropellerLeft, matPropellerLeft);
  this.propellerLeft.castShadow = true;
  this.propellerLeft.receiveShadow = true;

  // Blades

  var geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
  var matBlade = new THREE.MeshPhongMaterial({
    color: Colors.brownDark,
    shading: THREE.FlatShading,
  });

  var blade = new THREE.Mesh(geomBlade, matBlade);
  blade.position.set(8, 0, 0);
  blade.castShadow = true;
  blade.receiveShadow = true;
  this.propeller.add(blade);
  this.propeller.position.set(50, 0, 0);
  this.propellerLeft.position.set(20, 0, 80);
  this.mesh.add(this.propeller);

  // Cockpit

  var geomCockpit = new THREE.BoxGeometry(85, 50, 50, 1, 1, 1);
  var matCockpit = new THREE.MeshPhongMaterial({
    color: Colors.MiddleBlue,
    shading: THREE.FlatShading,
  });

  // we can access a specific vertex of a shape through
  // the vertices array, and then move its x, y and z property:
  geomCockpit.vertices[4].y -= 10;
  geomCockpit.vertices[4].z += 20;
  geomCockpit.vertices[5].y -= 10;
  geomCockpit.vertices[5].z -= 20;
  geomCockpit.vertices[6].y += 30;
  geomCockpit.vertices[6].z += 20;
  geomCockpit.vertices[7].y += 30;
  geomCockpit.vertices[7].z -= 20;

  var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
  cockpit.castShadow = true;
  cockpit.receiveShadow = true;
  this.mesh.add(cockpit);
};

// 3D Models
var airplane;

function createPlane() {
  airplane = new AirPlane();
  airplane.mesh.scale.set(0.25, 0.25, 0.25);
  airplane.mesh.position.y = 100;
  scene.add(airplane.mesh);
}

function loop() {
  updatePlane();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

function updatePlane() {
  var targetY = normalize(mousePos.y, -0.75, 0.75, 25, 175);
  var targetX = normalize(mousePos.x, -0.75, 0.75, -100, 100);
  var targetZ = normalize(mousePos.z, -0.75, 0.75, -100, 100);

  // Move the plane at each frame by adding a fraction of the remaining distance
  airplane.mesh.position.y += (targetY - airplane.mesh.position.y) * 0.1;
  airplane.mesh.position.x += (targetX - airplane.mesh.position.x) * 0.1;
  airplane.mesh.position.z = mousePos.z;

  // Rotate the plane proportionally to the remaining distance
  airplane.mesh.rotation.z = (targetY - airplane.mesh.position.y) * 0.0128;
  airplane.mesh.rotation.x = (airplane.mesh.position.y - targetY) * 0.0064;
  airplane.mesh.rotation.x = mousePos.z * 0.0064;

  airplane.propeller.rotation.x += 0.3;
}

function normalize(v, vmin, vmax, tmin, tmax) {
  var nv = Math.max(Math.min(v, vmax), vmin);
  var dv = vmax - vmin;
  var pc = (nv - vmin) / dv;
  var dt = tmax - tmin;
  var tv = tmin + pc * dt;
  return tv;
}

var isAxisOn = false;
var worldAxis = new THREE.AxesHelper(50);
function switchAxis() {
  if (!isAxisOn) {
    isAxisOn = true;
    scene.add(worldAxis);
  } else {
    scene.remove(worldAxis);
    isAxisOn = false;
  }
}

isAnimationOn = true;
function switchAnimation() {
  if (!isAnimationOn) {
    isAnimationOn = true;
    scene.add(airplane.mesh);
  } else {
    scene.remove(airplane.mesh);
    isAnimationOn = false;
  }
}

const size = 100000;
const divisions = 10000;
const gridHelper = new THREE.GridHelper(size, divisions);
var isGridOn = false;
function switchGrid() {
  if (!isGridOn) {
    isGridOn = true;
    scene.add(gridHelper);
  } else {
    scene.remove(gridHelper);
    isGridOn = false;
  }
}

function init(event) {
  document.addEventListener("mousemove", handleMouseMove, false);
  document.addEventListener("mouseup", handleMouseUp, false);
  document.addEventListener("mousedown", handleMouseDown, false);
  createScene();
  createLights();
  createPlane();
  loop();
}

// HANDLE MOUSE EVENTS

var mousePos = { x: 0, y: 0, z: 1 };

function handleMouseMove(event) {
  var tx = -1 + (event.clientX / WIDTH) * 2;
  var ty = 1 - (event.clientY / HEIGHT) * 2;
  mousePos.x = tx;
  mousePos.y = ty;
}

var interval;
let downLeft = false;
let downRight = false;
let upLeft = true;
let upRight = true;
function handleMouseUp(event) {
  if (downLeft) {
    clearInterval(downIntervalLeft);
    downLeft = false;
    upIntervalLeft = setInterval(function () {
      if (mousePos.z > 1) mousePos.z = mousePos.z - 1;
    }, 24);
    upLeft = true;
  }
  if (downRight) {
    clearInterval(downIntervalRight);
    downRight = false;
    upIntervalRight = setInterval(function () {
      if (mousePos.z < 1) mousePos.z = mousePos.z + 1;
    }, 24);
    upRight = true;
  }
}
function handleMouseDown(event) {
  switch (event.which) {
    case 1:
      downIntervalLeft = setInterval(function () {
        mousePos.z = mousePos.z + 1;
      }, 24);
      downLeft = true;
      clearInterval(upIntervalLeft);
      break;
    case 2:
      alert("Middle Mouse button pressed.");
      break;
    case 3:
      downIntervalRight = setInterval(function () {
        mousePos.z = mousePos.z - 1;
      }, 24);
      downRight = true;
      clearInterval(upIntervalRight);
      break;
    default:
  }
}

window.addEventListener("load", init, false);
