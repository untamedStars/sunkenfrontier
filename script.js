import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js';

// ====================
// SCENE
// ====================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x081421);

// ====================
// CAMERA
// ====================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 1.7, 0);
camera.rotation.order = "YXZ";

// ====================
// RENDERER
// ====================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    window.devicePixelRatio
);

renderer.setClearColor(0x000000);

document.body.appendChild(
    renderer.domElement
);

const canvas = renderer.domElement;

// ====================
// POINTER LOCK
// ====================

canvas.addEventListener("click", () => {
    canvas.requestPointerLock();
});

document.addEventListener(
    "pointerlockchange",
    () => {
        if (
            document.pointerLockElement === canvas
        ) {
            console.log("Pointer locked");
        } else {
            console.log("Pointer unlocked");
        }
    }
);

document.addEventListener(
    "pointerlockerror",
    () => {
        console.log("Pointer lock failed");
    }
);

// ====================
// LIGHTING
// ====================

const ambient = new THREE.AmbientLight(
    0xaaccff,
    1.2
);
scene.add(ambient);
// ====================
// MATERIALS
// ====================

const wallMat = new THREE.MeshStandardMaterial({
    color: 0x6b7280,
    metalness: 0.3,
    roughness: 0.6
});

const floorMat = new THREE.MeshStandardMaterial({
    color: 0x2a3440,
    metalness: 0.2,
    roughness: 0.8
});

const accentMat = new THREE.MeshStandardMaterial({
    color: 0xffaa00,
    metalness: 0.4,
    roughness: 0.4
});

const bedMat = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    metalness: 0.1,
    roughness: 0.7
});

// ====================
// ROOM
// ====================

function wall(x, y, z, w, h, d, material = wallMat) {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        material
    );

    mesh.position.set(x, y, z);
    scene.add(mesh);
}

// Floor
wall(0, -0.1, 0, 10, 0.2, 10, floorMat);

// Ceiling
wall(0, 5, 0, 10, 0.2, 10);

// Walls
wall(0, 2.5, -5, 10, 5, 0.2);
wall(0, 2.5, 5, 10, 5, 0.2);
wall(-5, 2.5, 0, 0.2, 5, 10);
wall(5, 2.5, 0, 0.2, 5, 10);

// ====================
// OBJECTS
// ====================

const locker = new THREE.Mesh(
    new THREE.BoxGeometry(1, 3, 1),
    accentMat
);

scene.add(locker);

const bed = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.5, 1),
    bedMat
);
scene.add(bed);

// ====================
// INPUT
// ====================

const keys = {};

document.addEventListener(
    "keydown",
    e => {
        keys[e.key.toLowerCase()] = true;
    }
);

document.addEventListener(
    "keyup",
    e => {
        keys[e.key.toLowerCase()] = false;
    }
);

// ====================
// MOUSE LOOK
// ====================

let yaw = 0;
let pitch = 0;

document.addEventListener(
    "mousemove",
    e => {

        if (
            document.pointerLockElement !== canvas
        ) return;

        const sensitivity = 0.002;

        yaw -=
            e.movementX *
            sensitivity;

        pitch -=
            e.movementY *
            sensitivity;

        const limit =
            Math.PI / 2 - 0.1;

        pitch = Math.max(
            -limit,
            Math.min(
                limit,
                pitch
            )
        );
    }
);

// ====================
// MOVEMENT
// ====================

const speed = 0.08;

function move() {

    const forward =
        new THREE.Vector3();

    camera.getWorldDirection(
        forward
    );

    forward.y = 0;
    forward.normalize();

    const right =
        new THREE.Vector3()
            .crossVectors(
                forward,
                new THREE.Vector3(
                    0,
                    1,
                    0
                )
            )
            .normalize();

    if (keys["w"]) {
        camera.position.add(
            forward
                .clone()
                .multiplyScalar(
                    speed
                )
        );
    }

    if (keys["s"]) {
        camera.position.add(
            forward
                .clone()
                .multiplyScalar(
                    -speed
                )
        );
    }

    if (keys["a"]) {
        camera.position.add(
            right
                .clone()
                .multiplyScalar(
                    -speed
                )
        );
    }

    if (keys["d"]) {
        camera.position.add(
            right
                .clone()
                .multiplyScalar(
                    speed
                )
        );
    }

    camera.position.x =
        Math.max(
            -4.5,
            Math.min(
                4.5,
                camera.position.x
            )
        );

    camera.position.z =
        Math.max(
            -4.5,
            Math.min(
                4.5,
                camera.position.z
            )
        );
}

// ====================
// ANIMATION LOOP
// ====================

function animate() {

    requestAnimationFrame(
        animate
    );

    camera.rotation.y =
        yaw;

    camera.rotation.x =
        pitch;

    move();

    renderer.render(
        scene,
        camera
    );
}

animate();

// ====================
// RESIZE
// ====================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);
