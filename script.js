import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202840);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 1.7, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambient);

const light = new THREE.PointLight(0xffffff, 10);
light.position.set(0, 4, 0);
scene.add(light);

// Materials
const wallMat = new THREE.MeshLambertMaterial({
    color: 0x888888
});

const objectMat = new THREE.MeshLambertMaterial({
    color: 0xaaaaaa
});

// Floor
const floor = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.2, 10),
    wallMat
);
floor.position.y = -0.1;
scene.add(floor);

// Ceiling
const ceiling = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.2, 10),
    wallMat
);
ceiling.position.y = 5;
scene.add(ceiling);

// Walls
function createWall(x, y, z, w, h, d) {
    const wall = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        wallMat
    );

    wall.position.set(x, y, z);
    scene.add(wall);
}

createWall(0, 2.5, -5, 10, 5, 0.2);
createWall(0, 2.5, 5, 10, 5, 0.2);
createWall(-5, 2.5, 0, 0.2, 5, 10);
createWall(5, 2.5, 0, 0.2, 5, 10);

// Bed
const bed = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.5, 1),
    objectMat
);

bed.position.set(-3, 0.25, 3);
scene.add(bed);

// Locker
const locker = new THREE.Mesh(
    new THREE.BoxGeometry(1, 3, 1),
    objectMat
);

locker.position.set(3.5, 1.5, 3.5);
scene.add(locker);

// Fabricator
const fabricator = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 0.5),
    objectMat
);

fabricator.position.set(4.4, 1, 0);
scene.add(fabricator);

// Movement
const keys = {};

document.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
});

const speed = 0.08;

function movePlayer() {

    if (keys["w"]) camera.position.z -= speed;
    if (keys["s"]) camera.position.z += speed;
    if (keys["a"]) camera.position.x -= speed;
    if (keys["d"]) camera.position.x += speed;

    // Keep player inside pod
    camera.position.x = Math.max(-4.5, Math.min(4.5, camera.position.x));
    camera.position.z = Math.max(-4.5, Math.min(4.5, camera.position.z));
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    movePlayer();

    renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});
