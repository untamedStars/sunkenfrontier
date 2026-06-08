import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 1.7, 0);
camera.rotation.order = "YXZ";

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// ===== POINTER LOCK SETUP =====

const canvas = renderer.domElement;

// request lock on click
canvas.addEventListener("click", () => {
    canvas.requestPointerLock();
});

// detect lock/unlock
document.addEventListener("pointerlockchange", () => {
    if (document.pointerLockElement === canvas) {
        console.log("Pointer locked");
    } else {
        console.log("Pointer unlocked");
    }
});

// error handler (helps debug if it fails)
document.addEventListener("pointerlockerror", () => {
    console.log("Pointer lock failed");
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.PointLight(0xffffff, 2);
light.position.set(0, 4, 0);
scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff, 0.3));

// Material
const mat = new THREE.MeshStandardMaterial({ color: 0x888888 });

// Room (lifepod)
function wall(x, y, z, w, h, d) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    scene.add(m);
}

// Floor / ceiling
wall(0, -0.1, 0, 10, 0.2, 10);
wall(0, 5, 0, 10, 0.2, 10);

// Walls
wall(0, 2.5, -5, 10, 5, 0.2);
wall(0, 2.5, 5, 10, 5, 0.2);
wall(-5, 2.5, 0, 0.2, 5, 10);
wall(5, 2.5, 0, 0.2, 5, 10);

// Objects
const bed = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.5, 1),
    mat
);
bed.position.set(-3, 0.25, 3);
scene.add(bed);

const locker = new THREE.Mesh(
    new THREE.BoxGeometry(1, 3, 1),
    mat
);
locker.position.set(3.5, 1.5, 3.5);
scene.add(locker);

// Movement
const keys = {};

document.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
});

// Pointer lock + mouse look
let yaw = 0;
let pitch = 0;

document.addEventListener("click", () => {
    document.body.requestPointerLock();
});

let yaw = 0;
let pitch = 0;


document.addEventListener("mousemove", (e) => {
    if (document.pointerLockElement !== document.body) return;

    const sens = 0.002;

    yaw -= e.movementX * sens;
    pitch -= e.movementY * sens;

    const limit = Math.PI / 2 - 0.1;
    pitch = Math.max(-limit, Math.min(limit, pitch));
});

// Movement speed
const speed = 0.08;

function move() {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    dir.y = 0;
    dir.normalize();

    const right = new THREE.Vector3()
        .crossVectors(dir, new THREE.Vector3(0, 1, 0))
        .normalize();

    if (keys["w"]) camera.position.add(dir.clone().multiplyScalar(speed));
    if (keys["s"]) camera.position.add(dir.clone().multiplyScalar(-speed));
    if (keys["a"]) camera.position.add(right.clone().multiplyScalar(speed));
    if (keys["d"]) camera.position.add(right.clone().multiplyScalar(-speed));
}

// Loop
function animate() {
    requestAnimationFrame(animate);

    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;

    camera.rotation.y = yaw;
    camera.rotation.x = pitch;

    move();

    renderer.render(scene, camera);
}

animate();

// Resize fix (IMPORTANT for no white edges)
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});
