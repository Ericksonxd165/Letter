import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';	
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import space from '../assets/img/astro.jpg'; 


const d = document;

// Import the 3D model in vite of the letter, the model is called carta.glb

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
d.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();  
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const axis = new THREE.AxesHelper(0);
const textureLoader = new THREE.TextureLoader();

const dLight = new THREE.DirectionalLight(0xffffff, 1);
dLight.position.set(0, 1, 1);
scene.add(dLight);

scene.background = textureLoader.load(space);

const letter = new URL('../assets/3Dmodels/carta.glb', import.meta.url).href;

let mixer;
let actions = {};
let model;
let initialPosition = { y: -2 };
let initialRotation = { y: Math.PI };

const loader = new GLTFLoader();
loader.load(letter, function(gltf){
    model = gltf.scene;
    model.position.y = initialPosition.y; // Baja el objeto un poco
    model.rotation.y = initialRotation.y; // Rota el objeto 180 grados
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);

    // Assuming the animations are named 'open', 'rotateCard', 'letter', 'rotateSeal'
    actions.open = mixer.clipAction(gltf.animations.find(clip => clip.name === 'open'));
    actions.rotateCard = mixer.clipAction(gltf.animations.find(clip => clip.name === 'rotateCard'));
    actions.letter = mixer.clipAction(gltf.animations.find(clip => clip.name === 'letter'));
    actions.rotateSeal = mixer.clipAction(gltf.animations.find(clip => clip.name === 'rotateSeal'));

    // Ensure animations stop at the last frame
    actions.open.setLoop(THREE.LoopOnce).clampWhenFinished = true;
    actions.rotateCard.setLoop(THREE.LoopOnce).clampWhenFinished = true;
    actions.letter.setLoop(THREE.LoopOnce).clampWhenFinished = true;
    actions.rotateSeal.setLoop(THREE.LoopOnce).clampWhenFinished = true;

    renderer.render(scene, camera);
});

camera.position.set(0, 2, 5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false; // Disable panning (moving the camera)
controls.enableRotate = true; // Enable rotation
controls.enableZoom = true; // Enable zoom

scene.add(axis);
renderer.render(scene, camera);

function animate() {
    requestAnimationFrame(animate);
    if (mixer) mixer.update(0.01); // Update the mixer for animations
    controls.update();
    renderer.render(scene, camera);
}

animate();

function adjustCameraForMobile() {
  if (window.innerWidth < 768) { // Typical breakpoint for mobile devices
      camera.position.set(0, 2, 10); // Move the camera back for mobile
  } else {
      camera.position.set(0, 2, 5); // Default camera position for larger screens
  }
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
}

// Initial adjustment
adjustCameraForMobile();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  adjustCameraForMobile();
});

const readButton = document.getElementById('readButton');
console.log(readButton)
const animateButton = document.getElementById('animateButton');
animateButton.addEventListener('click', () => {
    if (mixer && actions.open && actions.rotateCard && actions.letter && actions.rotateSeal) {
        // Reset model position and rotation to initial values
        model.position.set(0, initialPosition.y, 0);
        model.rotation.set(0, initialRotation.y, 0);

        // Update controls to reflect the new position and rotation
        controls.update();

        // Disable rotation and panning

        controls.enablePan = false;

        // Play animations
        actions.open.reset().setDuration(3).play();
        actions.rotateCard.reset().setDuration(3).play();
        actions.letter.reset().setDuration(3).play();
        actions.rotateSeal.reset().setDuration(3).play();

        animateButton.setAttribute('disabled', 'disabled');
    
        setTimeout(() => {
            animateButton.style.display = 'none';
            readButton.classList.toggle('invisible')
        }, 3000);
    }
});

const modal = document.getElementById('myModal');
readButton.addEventListener('click', () => { 
modal.classList.toggle('invisible')




})


// Modal logic


