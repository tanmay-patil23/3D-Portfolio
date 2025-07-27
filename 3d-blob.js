// 3d-blob.js - Advanced Noomo Labs Style 3D Animated Blob
// Enhanced version with glass material, Perlin noise, and interactive features
// Compatible with modern Three.js versions

let scene, camera, renderer, blob, clock, mouse, raycaster;
let originalPositions, positions, geometry, material;
let envMap, controls = {};
const canvas = document.getElementById('hero-canvas');

// Simple Perlin noise implementation (self-contained)
class PerlinNoise {
  constructor(seed = Math.random()) {
    this.perm = new Uint8Array(512);
    this.p = new Uint8Array(256);
    this.seed = seed;
    this.init();
  }

  init() {
    // Generate permutation table
    for (let i = 0; i < 256; i++) {
      this.p[i] = Math.floor(this.seededRandom(i) * 256);
    }
    // Double the permutation table
    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
    }
  }

  seededRandom(x) {
    x = (x << 13) ^ x;
    return (1.0 - ((x * (x * x * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0);
  }

  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(a, b, t) {
    return a + t * (b - a);
  }

  grad(hash, x, y, z) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise3D(x, y, z) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);

    const u = this.fade(x);
    const v = this.fade(y);
    const w = this.fade(z);

    const A = this.perm[X] + Y;
    const AA = this.perm[A] + Z;
    const AB = this.perm[A + 1] + Z;
    const B = this.perm[X + 1] + Y;
    const BA = this.perm[B] + Z;
    const BB = this.perm[B + 1] + Z;

    return this.lerp(
      this.lerp(
        this.lerp(
          this.grad(this.perm[AA], x, y, z),
          this.grad(this.perm[BA], x - 1, y, z),
          u
        ),
        this.lerp(
          this.grad(this.perm[AB], x, y - 1, z),
          this.grad(this.perm[BB], x - 1, y - 1, z),
          u
        ),
        v
      ),
      this.lerp(
        this.lerp(
          this.grad(this.perm[AA + 1], x, y, z - 1),
          this.grad(this.perm[BA + 1], x - 1, y, z - 1),
          u
        ),
        this.lerp(
          this.grad(this.perm[AB + 1], x, y - 1, z - 1),
          this.grad(this.perm[BB + 1], x - 1, y - 1, z - 1),
          u
        ),
        v
      ),
      w
    );
  }

  // Multi-octave noise for organic effects
  fBm(x, y, z, octaves = 4, persistence = 0.5) {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      total += this.noise3D(x * frequency, y * frequency, z * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= 2;
    }

    return total / maxValue;
  }
}

// Initialize Perlin noise
const noise = new PerlinNoise();

// Create environment map
function createEnvironmentMap() {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  // Create simple HDR-like environment using canvas
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Create gradient that simulates studio lighting
  const gradient = ctx.createLinearGradient(0, 0, 0, 128);
  gradient.addColorStop(0, '#87CEEB'); // Sky blue
  gradient.addColorStop(0.3, '#E0F6FF'); // Light blue
  gradient.addColorStop(0.7, '#FFFFFF'); // White
  gradient.addColorStop(1, '#F0F8FF'); // Alice blue

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.needsUpdate = true;

  envMap = pmremGenerator.fromEquirectangular(texture).texture;
  scene.environment = envMap;

  pmremGenerator.dispose();
}

// Initialize blob
function initBlob() {
  scene = new THREE.Scene();
  clock = new THREE.Clock();
  mouse = new THREE.Vector2();
  raycaster = new THREE.Raycaster();

  // Camera setup
  const fov = 55;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 1000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 5;

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true, 
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  // Create environment map
  createEnvironmentMap();

  // Enhanced geometry with higher detail
  geometry = new THREE.IcosahedronGeometry(2, 64);

  // Store original positions for morphing
  const positionAttribute = geometry.getAttribute('position');
  positions = positionAttribute;
  originalPositions = new Float32Array(positionAttribute.array);

  // Advanced glass material inspired by Noomo Labs
  material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.0,
    roughness: 0.05,
    transmission: 0.95,
    thickness: 0.5,
    ior: 1.4,
    reflectivity: 0.8,
    envMap: envMap,
    envMapIntensity: 1.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide,
    // Add subtle blue tint like Noomo's jellyfish
    attenuationColor: new THREE.Color(0.8, 0.9, 1.0),
    attenuationDistance: 0.5
  });

  blob = new THREE.Mesh(geometry, material);
  scene.add(blob);

  // Enhanced lighting setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
  keyLight.position.set(10, 10, 5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x87CEEB, 0.3);
  fillLight.position.set(-10, 0, -5);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
  rimLight.position.set(0, 0, -10);
  scene.add(rimLight);

  // Mouse interaction setup
  setupMouseInteraction();

  // Create UI controls
  createControls();

  // Start animation
  animate();
}

// Setup mouse interaction
function setupMouseInteraction() {
  const updateMouse = (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };

  canvas.addEventListener('mousemove', updateMouse);
  canvas.addEventListener('touchmove', (event) => {
    event.preventDefault();
    updateMouse(event.touches[0]);
  });

  // Reset mouse on leave
  canvas.addEventListener('mouseleave', () => {
    mouse.set(0, 0);
  });
}

// Create interactive controls
function createControls() {
  controls = {
    deformationIntensity: 0.3,
    animationSpeed: 1.0,
    mouseInfluence: 0.5,
    transmission: 0.95,
    roughness: 0.05,
    envMapIntensity: 1.2,
    opacity: 0.9
  };

  // Create control panel (optional - can be styled with CSS)
  const controlPanel = document.createElement('div');
  controlPanel.id = 'blob-controls';
  controlPanel.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 15px;
    border-radius: 10px;
    font-family: Arial, sans-serif;
    font-size: 12px;
    z-index: 1000;
    backdrop-filter: blur(10px);
  `;

  // Add title
  const title = document.createElement('h4');
  title.textContent = 'Blob Controls';
  title.style.margin = '0 0 10px 0';
  controlPanel.appendChild(title);

  // Create sliders for each control
  Object.keys(controls).forEach(key => {
    const container = document.createElement('div');
    container.style.marginBottom = '8px';

    const label = document.createElement('label');
    label.textContent = key.replace(/([A-Z])/g, ' $1').toLowerCase();
    label.style.display = 'block';
    label.style.marginBottom = '2px';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '1';
    slider.step = '0.01';
    slider.value = controls[key];
    slider.style.width = '150px';

    slider.addEventListener('input', (e) => {
      controls[key] = parseFloat(e.target.value);
      updateMaterial();
    });

    container.appendChild(label);
    container.appendChild(slider);
    controlPanel.appendChild(container);
  });

  document.body.appendChild(controlPanel);
}

// Update material properties
function updateMaterial() {
  material.transmission = controls.transmission;
  material.roughness = controls.roughness;
  material.envMapIntensity = controls.envMapIntensity;
  material.opacity = controls.opacity;
  material.needsUpdate = true;
}

// Advanced morphing function with Perlin noise
function morphGeometry() {
  const time = clock.getElapsedTime();
  const mouseInfluence = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) * controls.mouseInfluence;

  for (let i = 0; i < positions.count; i++) {
    const i3 = i * 3;
    const x = originalPositions[i3];
    const y = originalPositions[i3 + 1];
    const z = originalPositions[i3 + 2];

    // Multi-octave Perlin noise for organic deformation
    const noise1 = noise.fBm(
      x * 0.5 + time * 0.3 * controls.animationSpeed,
      y * 0.5 + time * 0.2 * controls.animationSpeed,
      z * 0.5 + time * 0.1 * controls.animationSpeed,
      4,
      0.5
    );

    // Additional noise layer for complexity
    const noise2 = noise.noise3D(
      x * 1.2 + time * 0.4 * controls.animationSpeed,
      y * 1.2 + mouse.x * 0.5,
      z * 1.2 + mouse.y * 0.5
    ) * 0.3;

    // Mouse interaction effect
    const mouseDistance = Math.sqrt(
      (x - mouse.x * 2) ** 2 + 
      (y - mouse.y * 2) ** 2 + 
      z ** 2
    );
    const mouseEffect = Math.exp(-mouseDistance * 2) * mouseInfluence * 0.5;

    // Combine all deformation effects
    const totalDeformation = (noise1 + noise2 + mouseEffect) * controls.deformationIntensity;

    // Apply deformation
    const length = Math.sqrt(x * x + y * y + z * z);
    const normalizedX = x / length;
    const normalizedY = y / length;
    const normalizedZ = z / length;

    positions.array[i3] = x * (1 + totalDeformation);
    positions.array[i3 + 1] = y * (1 + totalDeformation);
    positions.array[i3 + 2] = z * (1 + totalDeformation);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Morph geometry
  morphGeometry();

  // Smooth blob rotation with mouse influence
  blob.rotation.y += 0.005 * controls.animationSpeed;
  blob.rotation.x += mouse.y * 0.001;
  blob.rotation.z += mouse.x * 0.001;

  // Update raycaster for potential future interactions
  raycaster.setFromCamera(mouse, camera);

  // Render scene
  renderer.render(scene, camera);
}

// Resize handler
function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

// Initialize on load
window.addEventListener('load', initBlob);
window.addEventListener('resize', handleResize);

// Export for potential external use
window.BlobAnimation = {
  scene,
  camera,
  renderer,
  blob,
  controls,
  updateMaterial
};
