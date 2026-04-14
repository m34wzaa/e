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
            halfD = 0
            halfW = 0
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
        if (name == "lightswitch") {
            const rawCubes = []
            halfW = 0.1
            halfD = 0.1
            rawCubes.push({
                geometry: new THREE.BoxGeometry(0.1, 0.2, 0.05),
                position: new THREE.Vector3(0, 0, 0)
            })
            full = geometryFromCubes(rawCubes);
            full.computeVertexNormals();
            full.computeBoundingSphere();
        }
    } else if (id == "3") {//walls, floors, 
        // rooms
        const wallSizeX = 10
        const wallSizeY = 10
        if (name === "wallX") {
            const rawCubes = []
            halfW = 0.25
            halfD = wallSizeX / 2
            rawCubes.push({
                geometry: new THREE.BoxGeometry(0.5, wallSizeY, wallSizeX),
                position: new THREE.Vector3(0, wallSizeY / 2, 0)
            });
            full = geometryFromCubes(rawCubes);
            full.computeVertexNormals();
            full.computeBoundingSphere();
        }
        if (name === "wallZ") {
            const rawCubes = []
            halfW = wallSizeX / 2
            halfD = 0.25
            rawCubes.push({
                geometry: new THREE.BoxGeometry(wallSizeX, wallSizeY, 0.5),
                position: new THREE.Vector3(0, wallSizeY / 2, 0)
            });
            full = geometryFromCubes(rawCubes);
            full.computeVertexNormals();
            full.computeBoundingSphere();
        }
        if (name === "flat") {
            const rawCubes = []
            halfW = 5;
            halfD = 0.25;
            rawCubes.push({
                geometry: new THREE.BoxGeometry(wallSizeX, 0.5, wallSizeX),
                position: new THREE.Vector3(0, 0.25, 0)
            });
            full = geometryFromCubes(rawCubes);
            full.computeVertexNormals();
            full.computeBoundingSphere();
        }
        const windowSizeX = 2; //(width)
        const windowSizeY = 2; //(height)
        if (name === "window") {
            const rawCubes = []
            halfD = 5;
            halfW = 0.25;
            rawCubes.push({//top
                geometry: new THREE.BoxGeometry(wallSizeX, (wallSizeY / 2) - (windowSizeY / 2), 0.5),
                position: new THREE.Vector3(0, (wallSizeY / 2) - (2.5 - windowSizeY / 4), 0)
            });
            rawCubes.push({//bottom
                geometry: new THREE.BoxGeometry(wallSizeX, (wallSizeY / 2) - (windowSizeY / 2) / 2, 0.5),
                position: new THREE.Vector3(0, -(wallSizeY / 2) + (2.5 - windowSizeY / 4), 0)
            });
            rawCubes.push({//right
                geometry: new THREE.BoxGeometry(wallSizeX / 2 - (windowSizeX / 2), wallSizeY, 0.5),
                position: new THREE.Vector3(wallSizeX / 2 - (2.5 - windowSizeX / 4), 0, 0)
            });
            rawCubes.push({//left
                geometry: new THREE.BoxGeometry(wallSizeX / 2 - (windowSizeX / 2), wallSizeY, 0.5),
                position: new THREE.Vector3(-wallSizeX / 2 + (2.5 - windowSizeX / 4), 0, 0)
            });
            full = geometryFromCubes(rawCubes);
            full.computeVertexNormals();
            full.computeBoundingSphere();
        }
        if (name == "windowFrame") {
            const rawCubes = []
            rawCubes.push({
                geometry: new THREE.BoxGeometry(windowSizeX, windowSizeY, 0.25),
                position: new THREE.Vector3(0, 0, 0),
            });
            full = geometryFromCubes(rawCubes);
            full.computeVertexNormals();
            full.computeBoundingSphere();
            halfD = 5;
            halfW = 0.25;
        }
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
    } else if (name == "windowFrame") {
        const newmat = new THREE.MeshBasicMaterial({ 
            color: 0xaaffff,
            transparent: true,
            opacity: 0.07
        });
        mesh = new THREE.Mesh(full, newmat);
        mesh = new THREE.Mesh(full, newmat)
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
    if (name === "light") group.userData.pointLight = group.children.find(c => c.isPointLight);
    return group;
}
export { makeObject }