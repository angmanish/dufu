/* ===== script.js ===== */

/* ---- Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // close mobile menu
      mobileMenu.classList.remove('open');
    }
  });
});

/* ---- Navbar scroll behavior ---- */
const navbar = document.getElementById('navbar');
const progressBar = document.getElementById('progressBar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;

  // Navbar state
  navbar.classList.toggle('scrolled', scrollY > 60);

  // Progress bar
  progressBar.style.width = `${(scrollY / docH) * 100}%`;

  // Back to top
  backToTop.classList.toggle('visible', scrollY > 400);

  // Reveal on scroll
  revealElements();
});

/* ---- Mobile menu ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));

/* ---- Scroll Reveal ---- */
function revealElements() {
  const reveals = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right, .reveal-fade'
  );
  const windowH = window.innerHeight;
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < windowH * 0.88) {
      el.classList.add('revealed');
    }
  });
}
revealElements(); // run on load

/* ---- Back to top ---- */
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---- Animated Counter ---- */
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    // ease out
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(step);
}

let countersStarted = false;
function checkCounters() {
  if (countersStarted) return;
  const section = document.getElementById('chapter-4');
  if (!section) return;
  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.75) {
    countersStarted = true;
    document.querySelectorAll('.counter-number').forEach(el => {
      if (el.dataset.infinity) return; // skip infinity
      animateCounter(el, parseInt(el.dataset.target, 10));
    });
  }
}
window.addEventListener('scroll', checkCounters);
checkCounters();

/* ---- Floating Hearts Canvas ---- */
const canvas = document.getElementById('heartsCanvas');
const ctx = canvas.getContext('2d');
let hearts = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function randomBetween(a, b) { return a + Math.random() * (b - a); }

function createHeart() {
  return {
    x: randomBetween(0, canvas.width),
    y: canvas.height + 20,
    size: randomBetween(10, 22),
    speed: randomBetween(0.4, 1.2),
    opacity: randomBetween(0.15, 0.45),
    drift: randomBetween(-0.3, 0.3),
    rotation: randomBetween(-0.5, 0.5),
    rotSpeed: randomBetween(-0.01, 0.01),
    emoji: ['❤️','💕','💗','💖','💝'][Math.floor(Math.random()*5)]
  };
}

// Seed initial hearts
for (let i = 0; i < 18; i++) {
  const h = createHeart();
  h.y = randomBetween(0, canvas.height);
  hearts.push(h);
}

function drawHeart(h) {
  ctx.save();
  ctx.globalAlpha = h.opacity;
  ctx.translate(h.x, h.y);
  ctx.rotate(h.rotation);
  ctx.font = `${h.size}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(h.emoji, 0, 0);
  ctx.restore();
}

function animateHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hearts.forEach(h => {
    h.y -= h.speed;
    h.x += h.drift;
    h.rotation += h.rotSpeed;
    drawHeart(h);
    if (h.y < -30) {
      Object.assign(h, createHeart());
    }
  });
  requestAnimationFrame(animateHearts);
}
animateHearts();

// Add new heart every 1.2s
setInterval(() => {
  if (hearts.length < 35) hearts.push(createHeart());
}, 1200);

/* ---- Hero Particles ---- */
const particlesContainer = document.getElementById('particles');
function createParticle() {
  const p = document.createElement('div');
  p.style.cssText = `
    position:absolute;
    width:${randomBetween(2, 5)}px;
    height:${randomBetween(2, 5)}px;
    background:rgba(255,214,222,${randomBetween(0.3, 0.7)});
    border-radius:50%;
    left:${randomBetween(0, 100)}%;
    top:${randomBetween(0, 100)}%;
    animation:particleFloat ${randomBetween(6, 14)}s ease-in-out ${randomBetween(0, 6)}s infinite alternate;
    pointer-events:none;
  `;
  particlesContainer.appendChild(p);
}
for (let i = 0; i < 30; i++) createParticle();

// Inject particle keyframes
const style = document.createElement('style');
style.textContent = `
@keyframes particleFloat {
  0%   { transform: translate(0,0) scale(1); opacity:0; }
  20%  { opacity:1; }
  100% { transform: translate(${randomBetween(-40,40)}px, ${randomBetween(-60,-20)}px) scale(0.4); opacity:0; }
}`;
document.head.appendChild(style);

/* ---- Anniversary Confetti ---- */
const anniversaryBtn = document.getElementById('anniversaryBtn');
if (anniversaryBtn) {
  anniversaryBtn.addEventListener('click', () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Fire from left
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#e8506a', '#ff9a9e', '#d4a64a', '#ffffff']
      }));
      
      // Fire from right
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#e8506a', '#ff9a9e', '#d4a64a', '#ffffff']
      }));
    }, 250);
  });
}
