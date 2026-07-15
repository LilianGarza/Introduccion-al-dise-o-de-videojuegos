import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// CONFIGURACIÓN DE LA ESCENA
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x47A9BA);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LUCES
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// VARIABLES
let buenas = 0;
let malas = 0;
const velocidadObstaculo = 0.15;

const buenasTxt = document.getElementById('buenas-txt');
const malasTxt = document.getElementById('malas-txt');

// SUELO
const sueloGeo = new THREE.PlaneGeometry(10, 50);
const sueloMat = new THREE.MeshStandardMaterial({ color: 0x64797D });
const suelo = new THREE.Mesh(sueloGeo, sueloMat);
suelo.rotation.x = -Math.PI / 2;
scene.add(suelo);

// LOADER
const loader = new GLTFLoader();

// JUGADOR (ABEJA)
const jugador = new THREE.Group();
jugador.position.set(0, 0.5, 5);
scene.add(jugador);

loader.load(
    '/models/animal-bee.glb',
    (gltf) => {
        const modelo = gltf.scene;
        modelo.scale.set(0.4, 0.4, 0.4);
        modelo.rotation.y = Math.PI;
        jugador.add(modelo);
    },
    undefined,
    (error) => {
        console.error('Error cargando animal-bee.glb:', error);
    }
);

// ===============================
// OBSTÁCULOS (TAXIS)
// ===============================
const obstaculos = [];
const cantidadObstaculos = 5;

function reiniciarObstaculo(obstaculo) {
    obstaculo.position.z = -20 - Math.random() * 40;
    obstaculo.position.x = (Math.random() - 0.5) * 6;
    obstaculo.position.y = 0.5;
}

function crearObstaculo() {
    const obstaculo = new THREE.Group();

    loader.load(
        '/models/taxi.glb',
        (gltf) => {
            const modelo = gltf.scene;
            modelo.scale.set(0.8, 0.8, 0.8);
            obstaculo.add(modelo);
        },
        undefined,
        (error) => {
            console.error('Error cargando taxi.glb:', error);
        }
    );

    reiniciarObstaculo(obstaculo);

    // Separación inicial entre taxis
    obstaculo.position.z -= Math.random() * 50;

    scene.add(obstaculo);
    obstaculos.push(obstaculo);
}

for (let i = 0; i < cantidadObstaculos; i++) {
    crearObstaculo();
}

// CONTROLES
const teclas = {
    Left: false,
    Right: false
};

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        teclas.Left = true;
    }

    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        teclas.Right = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        teclas.Left = false;
    }

    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        teclas.Right = false;
    }
});

function animate() {
    requestAnimationFrame(animate);

    // Movimiento del jugador
    if (teclas.Left && jugador.position.x > -3) {
        jugador.position.x -= 0.1;
    }

    if (teclas.Right && jugador.position.x < 3) {
        jugador.position.x += 0.1;
    }

    // Movimiento y colisiones de todos los taxis
    obstaculos.forEach((obstaculo) => {

        obstaculo.position.z += velocidadObstaculo;

        // Colisión
        const distancia = jugador.position.distanceTo(obstaculo.position);

        if (distancia < 1.0) {
            malas++;
            if (malasTxt) malasTxt.innerText = malas;
            reiniciarObstaculo(obstaculo);
        }

        // Esquivado
        if (obstaculo.position.z > jugador.position.z + 2) {
            buenas++;
            if (buenasTxt) buenasTxt.innerText = buenas;
            reiniciarObstaculo(obstaculo);
        }

    });

    renderer.render(scene, camera);
}

animate();

// Ajustar al cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});