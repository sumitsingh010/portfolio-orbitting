
// GSAP & Three.js Portfolio Animation

// Skills data with icon paths and descriptions
const skills = [
  { name: "JavaScript", icon: "./assets/icons/javascript.svg", desc: "Proficient in modern JavaScript, ES6+, and frameworks like React." },
  { name: "Python", icon: "./assets/icons/python.svg", desc: "Experienced with Python scripting, data analysis, and automation." },
  { name: "Git", icon: "./assets/icons/git.svg", desc: "Version control expertise with Git and GitHub workflows." },
  { name: "React", icon: "./assets/icons/react.svg", desc: "Building dynamic, performant SPAs with React and hooks." },
  { name: "Node.js", icon: "./assets/icons/node.svg", desc: "Backend development with Node.js, Express, and REST APIs." },  // ✅ renamed from `nodejs.svg` to `node.svg`
  { name: "Figma", icon: "./assets/icons/figma.svg", desc: "UI/UX designing skills with Figma prototyping." },
  { name: "VSCode", icon: "./assets/icons/vscode.svg", desc: "Efficient coding environment setup and extensions." }
];

// DOM Elements
const orbitContainer = document.querySelector(".orbit");
const skillTitle = document.getElementById("skill-title");
const skillDesc = document.getElementById("skill-desc");
const details = document.querySelector(".details");

// Create orbiting spheres
const radius = 150;
const centerX = 200;
const centerY = 200;
const total = skills.length;

skills.forEach((skill, i) => {
  const sphere = document.createElement("div");
  sphere.classList.add("skill-sphere");
  sphere.style.left = centerX + radius * Math.cos((i / total) * 2 * Math.PI) + "px";
  sphere.style.top = centerY + radius * Math.sin((i / total) * 2 * Math.PI) + "px";
  sphere.style.position = "absolute";

  const img = document.createElement("img");
  img.src = skill.icon;
  img.alt = skill.name;
  sphere.appendChild(img);

  sphere.addEventListener("click", () => {
    skillTitle.textContent = skill.name;
    skillDesc.textContent = skill.desc;
    details.classList.add("visible");
    // Animate sphere scale with GSAP
    gsap.to(sphere, { scale: 1.5, duration: 0.5, ease: "power2.out", onComplete: () => {
      gsap.to(sphere, { scale: 1, duration: 0.5, delay: 1 });
    }});
  });

  orbitContainer.appendChild(sphere);
});

// Animate orbiting movement using GSAP ticker
let angle = 0;
gsap.ticker.add(() => {
  angle += 0.01;
  const spheres = document.querySelectorAll(".skill-sphere");
  spheres.forEach((sphere, i) => {
    const x = centerX + radius * Math.cos(angle + (i / total) * 2 * Math.PI);
    const y = centerY + radius * Math.sin(angle + (i / total) * 2 * Math.PI);
    sphere.style.left = x + "px";
    sphere.style.top = y + "px";
  });
});

// THREE.js starfield background
const canvas = document.getElementById("bg");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 30;

const starsGeometry = new THREE.BufferGeometry();
const starCount = 600;
const positions = [];

for(let i = 0; i < starCount; i++) {
  positions.push(
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 200
  );
}

starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

const starsMaterial = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.7, sizeAttenuation: true });
const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

// Animate starfield rotation on mouse move
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', e => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
  requestAnimationFrame(animate);
  starField.rotation.x += 0.0005 + mouseY * 0.001;
  starField.rotation.y += 0.001 + mouseX * 0.001;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
});
