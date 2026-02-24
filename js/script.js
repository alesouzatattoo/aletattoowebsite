/* ============================================================
   TATTOO CARE SITE — JavaScript
   Funcionalidades: Partículas, Tabs, Cards, Scroll
   ============================================================ */
class MobileMenu {
  constructor() {
    this.menuToggle = document.querySelector(".menu-toggle");
    this.nav = document.querySelector(".nav");

    this.init();
  }

  init() {
    if (!this.menuToggle || !this.nav) return;

    this.menuToggle.addEventListener("click", () => {
      this.nav.classList.toggle("active");
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ParticleCanvas();
  new TabSwitcher();
  new MobileMenu(); // 👈 ADICIONE ISSO
});

// ── PARTICLE CANVAS ──
class ParticleCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animId = null;
    
    this.resize();
    this.init();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    const colors = [
      'rgba(0, 212, 232,',
      'rgba(0, 180, 200,',
      'rgba(100, 230, 245,',
      'rgba(255, 255, 255,'
    ];

    const count = Math.min(80, Math.floor(window.innerWidth / 15));
    
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.1,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        opacityDir: Math.random() > 0.5 ? 0.003 : -0.003,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.opacity += p.opacityDir;

      if (p.opacity <= 0.05 || p.opacity >= 0.7) {
        p.opacityDir *= -1;
      }

      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `${p.color}${p.opacity})`;
      this.ctx.fill();

      // Glow effect
      if (p.size > 1.5) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        this.ctx.fillStyle = `${p.color}${p.opacity * 0.15})`;
        this.ctx.fill();
      }
    });

    this.animId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
    }
  }
}

// ── TAB SWITCHING ──
class TabSwitcher {
  constructor() {
    this.tabBtns = document.querySelectorAll('.tab-btn');
    this.tabContents = document.querySelectorAll('.tab-content');
    this.currentTab = 'pre';
    
    this.init();
  }

  init() {
    this.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });
  }

  switchTab(tab) {
    this.currentTab = tab;

    // Update buttons
    this.tabBtns.forEach(btn => {
      if (btn.dataset.tab === tab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update content
    this.tabContents.forEach(content => {
      if (content.dataset.tab === tab) {
        content.classList.remove('hidden');
      } else {
        content.classList.add('hidden');
      }
    });
  }
}

// ── ACCORDION CARDS ──
class AccordionCards {
  constructor() {
    this.cards = document.querySelectorAll('.card');
    this.init();
  }

  init() {
    this.cards.forEach((card, index) => {
      const header = card.querySelector('.card-header');
      
      if (header) {
        header.addEventListener('click', () => {
          this.toggleCard(card);
        });
      }

      // Open first card by default
      if (index === 0) {
        card.classList.add('open');
      }
    });
  }

  toggleCard(card) {
    const isOpen = card.classList.contains('open');
    
    if (isOpen) {
      card.classList.remove('open');
    } else {
      // Close other cards in same section
      const section = card.parentElement;
      section.querySelectorAll('.card.open').forEach(openCard => {
        if (openCard !== card) {
          openCard.classList.remove('open');
        }
      });
      
      card.classList.add('open');
    }
  }
}

// ── SMOOTH SCROLL ──
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
}

// ── INITIALIZE ON DOM READY ──
document.addEventListener('DOMContentLoaded', () => {
  // Initialize particle canvas
  const particleCanvas = new ParticleCanvas('particles-canvas');

  // Initialize tabs
  const tabSwitcher = new TabSwitcher();

  // Initialize accordion cards
  const accordion = new AccordionCards();

  // Initialize smooth scroll
  const smoothScroll = new SmoothScroll();

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (particleCanvas) {
      particleCanvas.destroy();
    }
  });
});

// ── UTILITY: Format year in footer ──
function updateYear() {
  const yearElements = document.querySelectorAll('.year');
  const year = new Date().getFullYear();
  yearElements.forEach(el => {
    el.textContent = year;
  });
}

updateYear();
