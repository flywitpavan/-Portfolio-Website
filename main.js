/* Main JS: nav toggle, smooth scroll, section reveal, skill animation, contact validation */

// Simple helper
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* NAV TOGGLE for mobile */
const navToggle = $('#nav-toggle');
const navMenu = $('#nav-menu');
navToggle && navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('show');
  navToggle.setAttribute('aria-expanded', isOpen);
});

/* Close mobile menu when clicking link */
$$('.nav__link').forEach(link => link.addEventListener('click', () => {
  if (navMenu.classList.contains('show')) {
    navMenu.classList.remove('show');
    navToggle.setAttribute('aria-expanded', 'false');
  }
}));

/* Smooth scroll for all anchor links */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.startsWith('#') && id.length > 1) {
      e.preventDefault();
      const target = document.querySelector(id);
      if (target) {
        const offset = 70; // header height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});

/* IntersectionObserver: section reveal and active nav link */
const sections = $$('main section[id]');
const navLinks = $$('.nav__menu a');

const ioOptions = { root: null, rootMargin: '-20% 0px -40% 0px', threshold: 0 };
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.id;
    // reveal
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      // set active nav link
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    }
  });
}, ioOptions);

sections.forEach(s => io.observe(s));

/* Animate skill bars when skills section in view */
const skills = $$('.skill');
const skillsObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      skills.forEach(skill => {
        const pct = Math.min(100, Number(skill.dataset.percent) || 0);
        const fill = skill.querySelector('.skill__fill');
        if (fill) {
          // small timeout to stagger
          setTimeout(() => fill.style.width = pct + '%', 120);
        }
      });
      obs.disconnect();
    }
  });
}, { threshold: 0.25 });

const skillsSection = $('#skills');
skillsSection && skillsObserver.observe(skillsSection);

/* Basic contact form validation + fake submit */
const form = $('#contact-form');
const formMsg = $('#form-msg');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    // simple validation
    if (!name || !email || !message) {
      formMsg.textContent = 'Please fill all the fields.';
      formMsg.style.color = '#d9534f';
      return;
    }
    // email quick test
    const emailOK = /^\S+@\S+\.\S+$/.test(email);
    if (!emailOK) {
      formMsg.textContent = 'Please enter a valid email.';
      formMsg.style.color = '#d9534f';
      return;
    }

    // Simulate submit (replace with real API later)
    formMsg.textContent = 'Sending…';
    formMsg.style.color = 'var(--muted)';

    setTimeout(() => {
      formMsg.textContent = 'Message sent — Thank you! I will reply soon.';
      formMsg.style.color = 'var(--first-color)';
      form.reset();
    }, 900);
  });
}

/* Accessibility: allow Esc to close mobile menu */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('show')) {
    navMenu.classList.remove('show');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

/* Lightweight polyfill: ensure images with SVG mask degrade gracefully */
/* Additional interactive features can be added here (modals, project filters, theme toggle) */
