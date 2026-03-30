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
            const cloned = cube.geometry.clone();
            cloned.applyMatrix4(mesh.matrix);
            geometries.push(cloned);
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
    if (id == "1") {//chair, couch, bed, desk, 
        if (name === "chair") {
            const LEG_H = 0.1;
            const SEAT_H = 0.5;
            const BACK_H = 0.5;
            const rawCubes = [];
            // Seat — bottom face at y = LEG_H, so center at y = LEG_H + SEAT_H/2
            rawCubes.push({
                geometry: new THREE.BoxGeometry(1, SEAT_H, 1),
                position: new THREE.Vector3(0, LEG_H + SEAT_H / 2, 0)
            });
            // Left armrest
            rawCubes.push({
                geometry: new THREE.BoxGeometry(0.2, 0.3, 1),
                position: new THREE.Vector3(-0.4, LEG_H + SEAT_H + 0.15, 0)
            });
            // Right armrest
            rawCubes.push({
                geometry: new THREE.BoxGeometry(0.2, 0.3, 1),
                position: new THREE.Vector3(0.4, LEG_H + SEAT_H + 0.15, 0)
            });
            // Back — centered above seat, at back edge z = -0.5
            rawCubes.push({
                geometry: new THREE.BoxGeometry(1, BACK_H, 0.2),
                position: new THREE.Vector3(0, LEG_H + SEAT_H + BACK_H / 2, -0.4)
            });
            // Legs — y center = LEG_H / 2, so bottom face is at y = 0
            const legGeo = new THREE.BoxGeometry(0.1, LEG_H, 0.1);
            const legPositions = [
                [-0.4, LEG_H / 2,  0.4],
                [ 0.4, LEG_H / 2,  0.4],
                [-0.4, LEG_H / 2, -0.4],
                [ 0.4, LEG_H / 2, -0.4],
            ];
            for (const [x, y, z] of legPositions) {
                rawCubes.push({
                    geometry: legGeo.clone(),   // clone per leg to avoid shared geometry issues
                    position: new THREE.Vector3(x, y, z)
                });
            }
            full = geometryFromCubes(rawCubes);
            full.computeVertexNormals();
            full.computeBoundingSphere();
            halfD = 0.7;
            halfW = 0.7;
        } else if (name == "couch") {
            halfD = 0.7
            halfW = 1.2
            const LEG_H = 0.1
            const SEAT_H = 0.5;
            const BACK_H = 0.5;
            const rawCubes = [];
            rawCubes.push({
                geometry: new THREE.BoxGeometry(2.4, SEAT_H, 1),
                position: new THREE.Vector3(0, LEG_H + SEAT_H / 2, 0)
            });
            // Left armrest
            rawCubes.push({
                geometry: new THREE.BoxGeometry(0.2, 0.3, 1),
                position: new THREE.Vector3(-1.1, LEG_H + SEAT_H + 0.15, 0)
            });
            // Right armrest
            rawCubes.push({
                geometry: new THREE.BoxGeometry(0.2, 0.3, 1),
                position: new THREE.Vector3(1.1, LEG_H + SEAT_H + 0.15, 0)
            });
            // Back
            rawCubes.push({
                geometry: new THREE.BoxGeometry(2.4, BACK_H, 0.2),
                position: new THREE.Vector3(0, LEG_H + SEAT_H + BACK_H / 2, -0.4)
            });
            // Legs
            const legGeo = new THREE.BoxGeometry(0.1, LEG_H, 0.1);
            const legPositions = [
                [-1.1, LEG_H / 2,  0.4],
                [ 1.1, LEG_H / 2,  0.4],
                [-1.1, LEG_H / 2, -0.4],
                [ 1.1, LEG_H / 2, -0.4],
            ];
            for (const [x, y, z] of legPositions) {
                rawCubes.push({
                    geometry: legGeo.clone(),
                    position: new THREE.Vector3(x, y, z)
                });
            }
            full = geometryFromCubes(rawCubes);
            full.computeVertexNormals();
            full.computeBoundingSphere();
        }
    } else if (id == "2") {//door, window, lights
        // interactable
        if (name === "light") {
            const radius = 0.075
            const rawCubes = [];
            rawCubes.push({
                geometry: new THREE.CylinderGeometry(radius, radius, 0.002, 8, 1),
                position: new THREE.Vector3(0, 0, 0)
            });
            halfD = 0
            halfW = 0
            full = geometryFromCubes(rawCubes);
            full.computeVertexNormals();
            full.computeBoundingSphere();
        }
    } else if (id == "3") {//walls, floors, 
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
    let mesh;
    if (name == "light")  {
        const newmat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 5
        })
        mesh = new THREE.Mesh(full, newmat);
    } else {
        mesh = new THREE.Mesh(full, mat)
    }
    const group = new THREE.Group();
    if (name == "light") {
        const light = new THREE.PointLight(
            0xffffff,
            5,
            10,
            1.5
        )
        light.position.set(0, 0, 0);
        group.add(light);
    }
    group.add(mesh);
    if (position) group.position.copy(position);
    return group;
}
export { makeObject };