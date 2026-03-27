import * as THREE from 'three';
import { makeObject } from './utils.js';
// make object, call function = pos, rot, id, name, corner, mat

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222)
let dist = 1000
const cam = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, dist)
cam.position.set(0, 2, 5)
cam.lookAt(4, 0, 4);
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);
const fog = new THREE.Fog(0x222222, dist - (dist * 0.2), dist);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const playerGeo = new THREE.BoxGeometry(0.8, 1.8, 0.8)
const playerMat = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    color: 0x000000,
    roughness: 0.7
});
const player = new THREE.Mesh(playerGeo, playerMat);
const chairMat = new THREE.MeshStandardMaterial({ color: 0x884400 });
const chair = new THREE.Mesh(
    makeObject(
        new THREE.Vector3(4, 0, 4),
        null,
        "1",
        "chair",
        "bl",
        chairMat
    ),
    chairMat
);
console.log(makeObject(
    new THREE.Vector3(4, 0, 4),
    null,
    "1",
    "chair",
    "bl",
    chairMat
));
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
function anim() {
    requestAnimationFrame(anim);
    renderer.render(scene, cam);
}
anim();