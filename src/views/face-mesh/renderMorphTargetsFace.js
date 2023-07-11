import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/**
 * 在给定容器放入3d模型，返回模型以便操控
 * @param {HTMLElement} container 
 * @returns {Promise<THREE.Object3D>}
 */
export default function randerMorphTargetsFace(container) {
  return new Promise((resolve) => {
    const offsetWidth = container.offsetWidth;
    const offsetHeight = container.offsetHeight;

    const camera = new THREE.PerspectiveCamera(45, offsetWidth / offsetHeight, 1, 20);
    camera.position.set(- 1.8, 0.8, 3);

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(offsetWidth, offsetHeight);
    renderer.useLegacyLights = false;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    container.appendChild(renderer.domElement);

    const ktx2Loader = new KTX2Loader()
      .setTranscoderPath('/three/libs/basis/')
      .detectSupport(renderer);

    new GLTFLoader()
      .setKTX2Loader(ktx2Loader)
      .setMeshoptDecoder(MeshoptDecoder)
      .load('/three/models/gltf/facecap.glb', (gltf) => {
        const mesh = gltf.scene.children[0];
        scene.add(mesh);

        resolve(mesh);

        mesh.position.x = -2;
        mesh.position.y = .5;
        mesh.position.z = -1;
      });

    const environment = new RoomEnvironment(renderer);
    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    scene.background = new THREE.Color(0x666666);
    scene.environment = pmremGenerator.fromScene(environment).texture;
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  });
}