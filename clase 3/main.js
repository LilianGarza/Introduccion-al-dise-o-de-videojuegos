import './style.css'; // <--- ¡Añade esta línea para que limpie la pantalla!
import * as THREE from 'three';

// 1. ESCENA
const scene = new THREE.Scene();

// 2. CÁMARA
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

// 3. RENDERIZADOR
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4. CUBO1
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xB700FF});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);


const material2 = new THREE.MeshStandardMaterial({ color: 0xFF00DD});
const cube2= new THREE.Mesh(geometry, material2);
cube2.position.x = 2;
scene.add(cube2);

const material3 = new THREE.MeshStandardMaterial({ color: 0xFF0062});
const cube3= new THREE.Mesh(geometry, material3);
cube3.position.x = -2;
scene.add(cube3);




// Diccionario para registrar qué teclas están presionadas
const keys = {

w: false,
a: false,
s: false,
d: false,
shift: false

};

// 5. BUCLE DE ANIMACIÓN (Game Loop)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(3, 5, 2);
scene.add(directionalLight);

function animate() {
requestAnimationFrame(animate);
console.log(cube.position.x);

// 1. CALCULAR VELOCIDAD (Si presiona Shift, corre al doble de velocidad)
let currentSpeed = 0.05;
if (keys.shift) {
currentSpeed = 0.12; // Velocidad de Sprint
}

// --- MECÁNICA DE MOVIMIENTO ---

if (keys.w) camera.position.y += currentSpeed; // Arriba
if (keys.s) camera.position.y -= currentSpeed; // Abajo
if (keys.a) camera.position.x -= currentSpeed; // Izquierda
if (keys.d) camera.position.x += currentSpeed; // Derecha

// --- LIMITAR LA POSICIÓN (Lógica de colisión con el borde) ---
// Límite Derecha (X positivo)
if (cube.position.x > 5) {
cube.position.x = 5;
}
// Límite Izquierda (X negativo)
else if (cube.position.x < -5) {
cube.position.x = -5;
}

// Límite Arriba (Y positivo)
if (cube.position.y > 3) {
cube.position.y = 3;
}
// Límite Abajo (Y negativo)
else if (cube.position.y < -3) {
cube.position.y = -3;
}

// Mantener una leve rotación para que se siga viendo en 3D
cube.rotation.x += 0.000;
cube.rotation.y += 0.000;

renderer.render(scene, camera);
}

animate();

// 6. AJUSTE DE PANTALLA (Hacer el juego responsivo)
window.addEventListener('resize', () => {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
});

// Detectar cuando se presiona la tecla
window.addEventListener('keydown', (event) => {
let key = event.key.toLowerCase();

// Si presionaron cualquier Shift, lo normalizamos a 'shift'
if (key === 'shift') key = 'shift';

if (key in keys) {
keys[key] = true;
}
});

window.addEventListener('keyup', (event) => {
let key = event.key.toLowerCase();

if (key === 'shift') key = 'shift';

if (key in keys) {
keys[key] = false;
}
});