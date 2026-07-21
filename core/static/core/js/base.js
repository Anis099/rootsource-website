// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
    });
  });
}

// ===== Sticky header shadow on scroll =====
const siteHeader = document.getElementById('siteHeader');

if (siteHeader) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });
}

// ===== Scroll reveal animation =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach(el => revealObserver.observe(el));

// ===== Odometer roll animation for stats (whole numbers) =====
function buildOdometer(el) {
  const target = el.dataset.count;
  const digits = target.split('');

  digits.forEach((digitChar, index) => {
    const reel = document.createElement('span');
    reel.className = 'digit-reel';

    const strip = document.createElement('span');
    strip.className = 'digit-strip';

    for (let cycle = 0; cycle < 2; cycle++) {
      for (let n = 0; n <= 9; n++) {
        const digitSpan = document.createElement('span');
        digitSpan.textContent = n;
        strip.appendChild(digitSpan);
      }
    }

    reel.appendChild(strip);
    el.appendChild(reel);

    const targetDigit = parseInt(digitChar, 10);
    const finalIndex = 10 + targetDigit;
    strip.style.transitionDelay = `${index * 90}ms`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        strip.style.transform = `translateY(-${finalIndex}em)`;
      });
    });
  });
}

// ===== Odometer roll animation for decimal numbers (e.g. Ratings: 4.9) =====
function buildDecimalOdometer(el) {
  const target = el.dataset.count;
  const chars = target.split('');

  chars.forEach((char, index) => {
    if (char === '.') {
      const dot = document.createElement('span');
      dot.className = 'digit-dot';
      dot.textContent = '.';
      el.appendChild(dot);
      return;
    }

    const reel = document.createElement('span');
    reel.className = 'digit-reel';

    const strip = document.createElement('span');
    strip.className = 'digit-strip';

    for (let cycle = 0; cycle < 2; cycle++) {
      for (let n = 0; n <= 9; n++) {
        const digitSpan = document.createElement('span');
        digitSpan.textContent = n;
        strip.appendChild(digitSpan);
      }
    }

    reel.appendChild(strip);
    el.appendChild(reel);

    const targetDigit = parseInt(char, 10);
    const finalIndex = 10 + targetDigit;
    strip.style.transitionDelay = `${index * 90}ms`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        strip.style.transform = `translateY(-${finalIndex}em)`;
      });
    });
  });
}

// ===== Observe and trigger both odometer types =====
const odometerEls = document.querySelectorAll('.odometer');
const decimalOdometerEls = document.querySelectorAll('.odometer-decimal');

const odometerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('odometer-decimal')) {
          buildDecimalOdometer(entry.target);
        } else {
          buildOdometer(entry.target);
        }
        odometerObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

odometerEls.forEach(el => odometerObserver.observe(el));
decimalOdometerEls.forEach(el => odometerObserver.observe(el));

// ===== Course category tabs =====
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const tabIndicator = document.getElementById('tabIndicator');

function moveIndicator(btn) {
  if (!tabIndicator) return;
  tabIndicator.style.width = `${btn.offsetWidth}px`;
  tabIndicator.style.transform = `translateX(${btn.offsetLeft - 6}px)`;
}

if (tabButtons.length && tabIndicator) {
  // Position indicator on the initially active tab
  const initialActive = document.querySelector('.tab-btn.active');
  if (initialActive) {
    requestAnimationFrame(() => moveIndicator(initialActive));
  }
}

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    moveIndicator(btn);

    tabPanels.forEach(panel => {
      panel.classList.remove('active');
    });

    const activePanel = document.getElementById(`tab-${target}`);
    if (activePanel) {
      activePanel.classList.add('active');

      activePanel.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('is-visible');
      });
    }
  });
});

// ===== Apply/Enroll modal =====
const applyModalBackdrop = document.getElementById('applyModalBackdrop');
const applyModalClose = document.getElementById('applyModalClose');
const applyModalSubtitle = document.getElementById('applyModalSubtitle');
const applyCourseId = document.getElementById('applyCourseId');
const applyType = document.getElementById('applyType');

function openApplyModal(courseId, courseTitle) {
  applyType.value = 'COURSE';
  applyCourseId.value = courseId;
  applyModalSubtitle.textContent = courseTitle;
  applyModalBackdrop.classList.add('open');
}

function closeApplyModal() {
  applyModalBackdrop.classList.remove('open');
}

document.querySelectorAll('.enroll-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    openApplyModal(btn.dataset.courseId, btn.dataset.courseTitle);
  });
});

if (applyModalClose) {
  applyModalClose.addEventListener('click', closeApplyModal);
}

if (applyModalBackdrop) {
  applyModalBackdrop.addEventListener('click', (e) => {
    if (e.target === applyModalBackdrop) closeApplyModal();
  });
}

// ===== Scroll progress bar =====
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
});

// ===== Loading state on form submits =====
document.querySelectorAll('#applyForm, #contactForm').forEach(form => {
  form.addEventListener('submit', () => {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.classList.add('btn-loading');
      submitBtn.textContent = 'Sending';
    }
  });
});