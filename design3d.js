import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* ─────────────────────────────
   SETUP
───────────────────────────── */

const container = document.getElementById("design-canvas");

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(
  container.clientWidth,
  container.clientHeight
);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;

container.appendChild(renderer.domElement);

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x050505);
scene.fog = new THREE.FogExp2(0x050505, 0.035);

/* ─────────────────────────────
   CAMERA
───────────────────────────── */

const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  100
);

camera.position.set(0, 2, 7);

/* ─────────────────────────────
   CONTROLS
───────────────────────────── */

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.8;

/* ─────────────────────────────
   LIGHTS
───────────────────────────── */

scene.add(new THREE.AmbientLight(0xffffff, 1.8));

const pinkLight = new THREE.PointLight(0xffd6e0, 30, 30);
pinkLight.position.set(4, 5, 4);
scene.add(pinkLight);

const blueLight = new THREE.PointLight(0xbfdcff, 25, 30);
blueLight.position.set(-5, 2, -4);
scene.add(blueLight);

const warmLight = new THREE.PointLight(0xfff0d0, 18, 20);
warmLight.position.set(0, -2, 5);
scene.add(warmLight);

/* ─────────────────────────────
   PALETA 3D
───────────────────────────── */

const paletteGroup = new THREE.Group();
scene.add(paletteGroup);

/* base */

const paletteBase = new THREE.Mesh(
  new THREE.CylinderGeometry(1.7, 1.7, 0.28, 64),
  new THREE.MeshStandardMaterial({
    color: 0xf5eee6,
    metalness: 0.15,
    roughness: 0.25
  })
);

paletteGroup.add(paletteBase);

/* hueco dedo */

const hole = new THREE.Mesh(
  new THREE.CylinderGeometry(0.28, 0.28, 0.3, 32),
  new THREE.MeshStandardMaterial({
    color: 0x050505
  })
);

hole.position.set(0.65, 0, 0.45);

paletteGroup.add(hole);

/* colores */

const colors = [
  0xffd6e0,
  0xffc6a8,
  0xffefad,
  0xd7f9c4,
  0xbfdcff,
  0xdcc6ff
];

colors.forEach((c, i) => {

  const sphere = new THREE.Mesh(

    new THREE.SphereGeometry(0.22, 64, 64),

    new THREE.MeshStandardMaterial({
      color: c,
      metalness: 0.25,
      roughness: 0.15
    })

  );

  sphere.position.set(
    Math.cos(i * 1.05) * 0.9,
    0.2,
    Math.sin(i * 1.05) * 0.9
  );

  paletteGroup.add(sphere);

});

/* pincel elegante */

const brush = new THREE.Group();

const handle = new THREE.Mesh(
  new THREE.CylinderGeometry(0.07, 0.07, 3.2, 32),
  new THREE.MeshStandardMaterial({
    color: 0xf6c7cf,
    metalness: 0.35,
    roughness: 0.25
  })
);

handle.rotation.z = Math.PI / 4;

brush.add(handle);

const ferrule = new THREE.Mesh(
  new THREE.CylinderGeometry(0.12, 0.12, 0.35, 32),
  new THREE.MeshStandardMaterial({
    color: 0xeaeaea,
    metalness: 1,
    roughness: 0.08
  })
);

ferrule.position.set(1.15, 1.15, 0);
ferrule.rotation.z = Math.PI / 4;

brush.add(ferrule);

const tip = new THREE.Mesh(
  new THREE.ConeGeometry(0.14, 0.5, 32),
  new THREE.MeshStandardMaterial({
    color: 0xf4ede4
  })
);

tip.position.set(1.45, 1.45, 0);
tip.rotation.z = -Math.PI / 4;

brush.add(tip);

brush.position.set(-0.8, 0.8, 0.2);

paletteGroup.add(brush);

/* ─────────────────────────────
   PARTICULAS
───────────────────────────── */

const particleGeo = new THREE.BufferGeometry();

const count = 500;

const pos = new Float32Array(count * 3);

for(let i = 0; i < count; i++){

  pos[i * 3] = (Math.random() - 0.5) * 12;
  pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
  pos[i * 3 + 2] = (Math.random() - 0.5) * 8;

}

particleGeo.setAttribute(
  'position',
  new THREE.BufferAttribute(pos, 3)
);

const particleMat = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.025,
  transparent: true,
  opacity: 0.55
});

const particles = new THREE.Points(
  particleGeo,
  particleMat
);

scene.add(particles);

/* ─────────────────────────────
   FLOOR GLOW
───────────────────────────── */

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(5, 64),
  new THREE.MeshBasicMaterial({
    color: 0x111111,
    transparent: true,
    opacity: 0.6
  })
);

floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.6;

scene.add(floor);

/* ─────────────────────────────
   RESIZE
───────────────────────────── */

window.addEventListener('resize', () => {

  camera.aspect =
    container.clientWidth / container.clientHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    container.clientWidth,
    container.clientHeight
  );

});

/* ─────────────────────────────
   ANIMATE
───────────────────────────── */

function animate(){

  requestAnimationFrame(animate);

  controls.update();

  paletteGroup.rotation.y += 0.003;

  brush.rotation.x =
    Math.sin(Date.now() * 0.0012) * 0.12;

  particles.rotation.y += 0.0005;

  renderer.render(scene, camera);

}

animate();