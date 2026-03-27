import * as THREE from 'three'
import { BufferGeometryUtils } from 'bufferGeometryUtils';
function makeObject(position/*THREE.Vector3*/, rotation/*THREE.Quaternion */, id/*can be furniture, interactable, or room*/, name, cornerOfAlignment /*br bl tr tl*/, mat) {
    if (name === null) return;
    function geometryFromCubes(rawCubes) {
        const geometries = [];

        for (const cube of rawCubes) {
            const mesh = new THREE.Mesh(cube.geometry);
            mesh.position.copy(cube.position);
            mesh.updateMatrix();
            geometries.push(mesh.geometry);
        }

        return BufferGeometryUtils.mergeBufferGeometries(geometries, false);
    }

    let output = null;
    let full = null;
    let halfW = 0;   
    let halfD = 0;   

    let orient = 0;
    if (cornerOfAlignment == "bl") orient = 0;
    else if (cornerOfAlignment == "br") orient = 1;
    else if (cornerOfAlignment == "tl") orient = 2;
    else if (cornerOfAlignment == "tr") orient = 3;

    let cornerOffsetX = 0;
    let cornerOffsetZ = 0;

    const shift = new THREE.Matrix4();
    const quat  = new THREE.Quaternion();

    let arr = [];

    if (id == "1") {
        // furniture
        let geo = new THREE.BufferGeometry();

        if (name === "chair") {
            arr = [
                new THREE.BoxGeometry(1, 0.5, 1),      // seat
                new THREE.BoxGeometry(0.2, 0.7, 1),    // arms
                new THREE.BoxGeometry(1.4, 1, 0.2),    // back
                new THREE.BoxGeometry(0.1, 0.1, 0.1)   // legs
            ];

            const rawCubes = [];

            rawCubes.push({
                geometry: arr[0],
                position: new THREE.Vector3(0, 0, 0)
            });

            rawCubes.push({
                geometry: arr[1],
                position: new THREE.Vector3(0, 0.25, 0)
            });

            rawCubes.push({
                geometry: arr[2],
                position: new THREE.Vector3(0, 0.5, -0.6)
            });

           const legPositions = [
                [-0.4, 0.05, -0.4], // front left
                [ 0.4, 0.05, -0.4], // front right
                [ 0.4, 0.05,  0.4], // back right
                [-0.4, 0.05,  0.4], // back left
            ];

            for (const [x, y, z] of legPositions) {
                rawCubes.push({
                    geometry: arr[3],
                    position: new THREE.Vector3(x, y, z)
                });
            }

            full = geometryFromCubes(rawCubes);
            full.computeVertexNormals();
            halfD = 0.7;
            halfW = 0.7;
        }
    } else if (id == "2") {
        // interactable

    } else if (id == "3") {
        // rooms
    } else {
        return null;
    }
    if (!full) return null;

    if (orient === 0) {   // bl
        cornerOffsetX = -halfW;
        cornerOffsetZ = -halfD;
    } else if (orient === 1) { // br 
        cornerOffsetX =  halfW;
        cornerOffsetZ = -halfD;
    } else if (orient === 2) { // tl 
        cornerOffsetX = -halfW;
        cornerOffsetZ =  halfD;
    } else if (orient === 3) { // tr 
        cornerOffsetX =  halfW;
        cornerOffsetZ =  halfD;
    }

    shift.makeTranslation(-cornerOffsetX, 0, -cornerOffsetZ);
    full.applyMatrix4(shift);
    if (orient === 1) {
        quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);      // 90°
    } else if (orient === 2) {
        quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);          // 180°
    } else if (orient === 3) {
        quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);     // 270°
    }
    if (orient !== 0) {
        full.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(quat));
    }

    if (rotation) {
        full.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(rotation));
    }
    output = full;

    return output;
}
export { makeObject };