import * as THREE from 'three';
import { GLTFLoader } from 'gltfloader';
import { makeObject } from 'utils';
// make object, call function = pos, rot, id, name, corner, mat

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222)
let dist = 1000
const cam = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, dist)
const fog = new THREE.Fog(0x222222, dist - (dist * 0.2), dist);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const playerGeo = new THREE.BoxGeometry(0.8, 1.8, 0.8)
const playerMat = new THREE.Material({
    metalness:0.3,
    color:0x000000,
    roughness:0.7
});
const player = new THREE.Mesh(playerGeo, playerMat);
let room = 1
const rooms = [
    [
        []/*walls */, [],/*furniture */ []/*interactable */
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