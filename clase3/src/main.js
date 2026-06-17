import './style.css';
import * as THREE from 'three';
// ¡IMPORTANTE! Importamos el cargador de modelos GLTF
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// 1. ESCENA
const scene = new THREE.Scene();

// 2. CÁMARA
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5); // Elevamos un poco la cámara para ver mejor el modelo

// 3. RENDERIZADOR
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// RELOJ PARA EL DELTA TIME
const clock = new THREE.Clock();

// Variable global para guardar nuestro modelo una vez que cargue
let miModelo3D = null;


// agrague keys y el const del primer codigo detectar cuando se pican teclas
const keys = {};

window.addEventListener('keydown', (event) => {
    keys[event.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (event) => {
    keys[event.key.toLowerCase()] = false;
});


// ==========================================
// 4. CARGADOR DE MODELOS 3D (GLTF / GLB)
// ==========================================
const loader = new GLTFLoader();

// Cargamos el archivo (deben cambiar esta ruta por la de su modelo)
loader.load(
    '/models/animal-cat.glb',
    (gltf) => {
        // Esta función se ejecuta cuando el modelo termina de cargarse con éxito
        miModelo3D = gltf.scene;
       
        // Opcional: Escalar el modelo si viene muy grande o muy chico del programa 3D
        miModelo3D.scale.set(1, 1, 1);
       
        // Añadimos el modelo a nuestra escena de Three.js
        scene.add(miModelo3D);
        console.log("¡Modelo 3D cargado con éxito!");
    },
    (xhr) => {
        // Opcional: Esto muestra el progreso de la descarga en la consola
        console.log((xhr.loaded / xhr.total * 100) + '% cargado');
    },
    (error) => {
        // Esto nos avisa si hay un error con la ruta o el archivo
        console.error('Hubo un error al cargar el modelo:', error);
    }
);

// LUCES (Los modelos importados necesitan buena luz para que se aprecien sus texturas)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// 5. BUCLE DE ANIMACIÓN (Game Loop)
function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();

    // Verificamos si el modelo YA terminó de cargarse en memoria antes de intentar moverlo
    if (miModelo3D) {

        // agregure mecanica de movimiento
        const currentSpeed = 0.1;

        if (keys.w) miModelo3D.position.y += currentSpeed; // Arriba
        if (keys.s) miModelo3D.position.y -= currentSpeed; // Abajo
        if (keys.a) miModelo3D.position.x -= currentSpeed; // Izquierda
        if (keys.d) miModelo3D.position.x += currentSpeed; // Derecha

        // RETO DE LA CLASE: Girar el objeto continuamente en su eje Y
        // Multiplicamos por deltaTime para garantizar un giro suave e independiente de los FPS
        miModelo3D.rotation.y += 0.0 * deltaTime;
    }

    renderer.render(scene, camera);
}

animate();

// 6. AJUSTE DE PANTALLA
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});