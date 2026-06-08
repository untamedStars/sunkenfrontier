import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("game")
});

renderer.setSize(window.innerWidth, window.innerHeight);

// Ocean
const oceanGeometry = new THREE.PlaneGeometry(1000, 1000);

const oceanMaterial = new THREE.MeshBasicMaterial({
    color: 0x0066aa
});

const ocean = new THREE.Mesh(
    oceanGeometry,
    oceanMaterial
);

ocean.rotation.x = -Math.PI / 2;

scene.add(ocean);

// Floating science pod
const podGeometry = new THREE.BoxGeometry(2, 2, 2);

const podMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff
});

const pod = new THREE.Mesh(
    podGeometry,
    podMaterial
);

pod.position.y = 1;

scene.add(pod);

camera.position.set(0, 5, 10);

function animate() {
    requestAnimationFrame(animate);

    pod.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});
