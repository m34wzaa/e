import * as THREE from 'three';
import { makeObject } from './utils.js?v=11';
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
const light2 = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light2);
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
    keys[e.key.toLowerCase()] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});
renderer.domElement.addEventListener('click', () => {
    renderer.domElement.requestPointerLock();
});
const mouseSens = 0.002;
document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement !== renderer.domElement) return;
    yaw -= e.movementX * mouseSens;
    pitch -= e.movementY * mouseSens;
    pitch = Math.max(-lim, Math.min(lim, pitch));
});
const playerGeo = new THREE.BoxGeometry(0.8, 1.8, 0.8)
const playerMat = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    color: 0x000000,
    roughness: 0.7
});
const player = new THREE.Mesh(playerGeo, playerMat);
scene.add(player);
const player2 = new THREE.Mesh(playerGeo, playerMat)
scene.add(player2)
player.position.set(0, 0.9, 0)
player2.position.set(4, 0.9, 0)
player.position.z += 5
//player2.position.x += 0.45
const redMat = new THREE.MeshStandardMaterial({ color: 0x831414 });
const orangeMat = new THREE.MeshStandardMaterial({ color: 0x724214 });
const yellowMat = new THREE.MeshStandardMaterial({ color: 0x727214 });
const greenMat = new THREE.MeshStandardMaterial({ color: 0x148314 });
const cyanMat = new THREE.MeshStandardMaterial({ color: 0x147272 });
const blueMat = new THREE.MeshStandardMaterial({ color: 0x141483 });
const purpleMat = new THREE.MeshStandardMaterial({ color: 0x721472 });
const lightmat = new THREE.MeshStandardMaterial({
    color: 0x1835f1,
    metalness: 0.3,
    roughness: 1
});
let timer = 1;
function lightClicked() {
    console.log("initializing")
    if (timer > 0) {
        console.log(`didnt work because timer = ${timer}`)
        return;
    }
    console.log("attempting light")
    on = lighte(on);
    timer = 100;
}
let on = 0;
const rooms = [
    [
        makeObject(
            new THREE.Vector3(-2, 0, 0),
            new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2),
            "1",
            "couch",
            "bl",
            blueMat
        ),
        makeObject(
            new THREE.Vector3(-4, 0, 0),
            null,
            "1",
            "chair",
            "bl",
            orangeMat
        ),
        makeObject(
            new THREE.Vector3(0, 3, 0),
            null, 
            "2",
            "light",
            "bl",
            lightmat
        ),
        makeObject(
            new THREE.Vector3(10, 0, 15),
            null,
            "3",
            "window",
            "bl",
            orangeMat
        ),
        makeObject(
            new THREE.Vector3(10, 0, 15),
            null,
            "3",
            "windowFrame",
            "bl",
            null
        ),
        makeObject(
            new THREE.Vector3(1, 1, 1),
            null,
            "2",
            "lightswitch",
            "bl",
            lightmat
        ),
        makeObject(
            new THREE.Vector3(4, 0, 0),
            null,
            "1",
            "couch",
            "bl",
            cyanMat
        ),
        makeObject(
            new THREE.Vector3(2, 0, 0),
            null,
            "1",
            "chair",
            "bl",
            redMat
        )
    ],//1
    [
       
    ],//2
    [
    ] //3
]
const pointLight = rooms[0][2].userData.pointLight;
pointLight.visible = false;
pointLight.intensity = 0;
for (const [index, room] of rooms.entries()) {
    for (const obj of room) {
        scene.add(obj);
    }
}
function lighte(state) {
    let output = state
    console.log(output)
    if (output == 0) {
        output = 1
    } else {
        output = 0
    }
    console.log(output)
    return(output);
}

const yawQ = new THREE.Quaternion();
const pitchQ = new THREE.Quaternion();
const yy = new THREE.Vector3(0, 1, 0);
const xx = new THREE.Vector3(1, 0, 0);
let yaw = 0;
let pitch = 0;
const sens = 0.02;
const lim = Math.PI / 2;

function anim() {
    requestAnimationFrame(anim);
    if (on == 1) {
        pointLight.visible = true;
        pointLight.intensity = 5;
    } else {
        pointLight.visible = false;
        pointLight.intensity = 0;
    }
    if (timer > 0) timer--;
    if (keys['x']) {
        lightClicked();
        console.log("attempted");
    }
    if (keys['arrowright']) rooms[0][0].position.x += 0.1;
    if (keys['arrowleft']) rooms[0][0].position.x -= 0.1;
    if (keys['arrowup']) rooms[0][0].position.z -= 0.1;
    if (keys['arrowdown']) rooms[0][0].position.z += 0.1;
    pitch = Math.max(-lim, Math.min(lim, pitch));
    yawQ.setFromAxisAngle(yy, yaw);
    pitchQ.setFromAxisAngle(xx, pitch);
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(yawQ);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(yawQ);
    if (keys['w']) player.position.addScaledVector(forward, sens * 5);
    if (keys['s']) player.position.addScaledVector(forward, -sens * 5);
    if (keys['a']) player.position.addScaledVector(right, -sens * 5);
    if (keys['d']) player.position.addScaledVector(right, sens * 5);
    cam.position.copy(player.position).add(new THREE.Vector3(0, 0.6, 0));
    player.quaternion.copy(yawQ);
    cam.quaternion.multiplyQuaternions(yawQ, pitchQ);
    renderer.render(scene, cam);
}
anim();