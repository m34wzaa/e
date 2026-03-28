import * as THREE from 'three';
import { makeObject } from './utils.js?v=2';
// make object, call function = pos, rot, id, name, corner, mat

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222)
let dist = 1000
const cam = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, dist)
cam.position.set(0, 0, 0)
cam.rotation.order = 'YXZ';
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);
scene.fog = new THREE.Fog(0x222222, dist - (dist * 0.2), dist);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener('resize', () => {
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
document.body.appendChild(renderer.domElement);
let keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});
const playerGeo = new THREE.BoxGeometry(0.8, 1.8, 0.8)
const playerMat = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    color: 0x000000,
    roughness: 0.7
});
const player = new THREE.Mesh(playerGeo, playerMat);
scene.add(player);
const chairMat = new THREE.MeshStandardMaterial({ color: 0x884400 });
const chair = new THREE.Mesh(
    makeObject(
        new THREE.Vector3(2, 0, 4),
        null,
        "1",
        "chair",
        "bl",
        chairMat
    ),
    chairMat
);
scene.add(chair);
let room = 1
const rooms = [
    [
    ],//1
    [
    ],//2
    [
    ] //3
]
cam.lookAt(chair);
const yawQ   = new THREE.Quaternion();
const pitchQ = new THREE.Quaternion(); 
const yy = new THREE.Vector3(0, 1, 0);
const xx = new THREE.Vector3(1, 0, 0);
let yaw   = 0;
let pitch = 0;
const sens = 0.02;
const lim = Math.PI / 2

function anim() {
    requestAnimationFrame(anim);
    if (keys['ArrowLeft']) yaw   += sens;
    if (keys['ArrowRight']) yaw   -= sens;
    if (keys['ArrowUp']) pitch += sens;
    if (keys['ArrowDown']) pitch -= sens;
    pitch = Math.max(-lim, Math.min(lim, pitch));
    yawQ.setFromAxisAngle(yy, yaw);
    pitchQ.setFromAxisAngle(xx, pitch);
    cam.quaternion.multiplyQuaternions(yawQ, pitchQ);
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(yawQ);
    const right   = new THREE.Vector3(1, 0, 0).applyQuaternion(yawQ);
    if (keys['w'])    player.position.addScaledVector(forward, sens * 5);
    if (keys['s'])  player.position.addScaledVector(forward, -sens * 5);
    if (keys['a'])  player.position.addScaledVector(right,   -sens * 5);
    if (keys['d']) player.position.addScaledVector(right,   sens * 5);
    cam.position.copy(player.position).add(new THREE.Vector3(0, 0.8, 0));
    player.quaternion.copy(yawQ);
    cam.quaternion.multiplyQuaternions(yawQ, pitchQ);
    renderer.render(scene, cam);
}
anim();