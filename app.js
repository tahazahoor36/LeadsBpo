/**
 * app.js — Leads BPO Website — All Interactive Functionality
 * ===========================================================
 * Covers:
 *  1. Company configuration (contact info, social links)
 *  2. Mobile menu
 *  3. Smooth scroll + active nav highlighting
 *  4. Service details modal
 *  5. FAQ accordion
 *  6. Consultation (contact) form → Supabase insert
 *  7. Career application modal + form → Supabase insert
 *  8. Counter animations (IntersectionObserver + GSAP)
 *  9. AOS + GSAP timeline initialisation (preserved from original)
 * 10. Contact info clickable links
 * 11. Footer policy / social icon config
 *
 * DESIGN RULE: This file adds behaviour only.
 * It does NOT change any CSS, layout, colors, or animations.
 */

'use strict';

// ─────────────────────────────────────────────────────────────
// 0. COMPANY CONFIGURATION
// ─────────────────────────────────────────────────────────────
const COMPANY = {
  email:   'leadsbpo65@gmail.com',
  phone:   '+923108069046',          // international format for tel: link
  phoneDisplay: '03108069046',       // display format shown on site
  address: '58/62, Baig Plaza, Canning Road, Saddar, Rawalpindi, 46000',
  mapUrl:  'https://www.google.com/maps/search/58+Baig+Plaza+Canning+Road+Saddar+Rawalpindi+Pakistan',

  // Social media URLs — add real URLs when available.
  // Leave as empty string ('') if no real URL exists yet.
  // Icons with empty URLs will be non-navigating (no # jump, no page reload).
  social: {
    // share icon (general social / LinkedIn)
    share: '',   // e.g. 'https://www.linkedin.com/company/leadsbpo'
    // public / globe icon
    web:   '',   // e.g. website URL or Twitter
    // campaign / megaphone icon
    campaign: '', // e.g. Facebook page
  },
};

// ─────────────────────────────────────────────────────────────
// 1. UTILITY HELPERS
// ─────────────────────────────────────────────────────────────

/** Scroll to an element by ID, accounting for sticky navbar height */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const navbarHeight = 80; // approximate sticky nav height in px
  const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

/** Lock / unlock body scroll (for open modals and menus) */
function lockScroll()   { document.body.style.overflow = 'hidden'; }
function unlockScroll() { document.body.style.overflow = '';        }

/** Show a toast-style notification that matches the site design */
function showToast(message, type = 'success') {
  const existing = document.getElementById('lbpo-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'lbpo-toast';
  const bgColor = type === 'success' ? '#22c55e' : '#ef4444';
  toast.style.cssText = `
    position: fixed; bottom: 2rem; right: 2rem; z-index: 9999;
    background: ${bgColor}; color: #fff;
    padding: 1rem 1.5rem; border-radius: 0.75rem;
    font-family: Inter, sans-serif; font-size: 0.9rem;
    max-width: 20rem; box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    transform: translateY(20px); opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
  `;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity   = '1';
  });

  setTimeout(() => {
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity   = '0';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

/** Validate a URL is http or https only */
function isValidHttpUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch { return false; }
}

/** Validate email format */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Validate phone — allows common international formats */
function isValidPhone(phone) {
  return /^[\+]?[\d\s\-\(\)]{7,20}$/.test(phone.trim());
}

/** Focus trap inside a modal element */
function createFocusTrap(modalEl) {
  const focusable = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
  const elements  = Array.from(modalEl.querySelectorAll(focusable));
  if (!elements.length) return;

  function handleKeydown(e) {
    if (e.key !== 'Tab') return;
    const first = elements[0];
    const last  = elements[elements.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  }

  modalEl.addEventListener('keydown', handleKeydown);
  // Focus the first focusable element
  elements[0].focus();

  return () => modalEl.removeEventListener('keydown', handleKeydown);
}

// ─────────────────────────────────────────────────────────────
// 2. MOBILE MENU
// ─────────────────────────────────────────────────────────────
function initMobileMenu() {
  const menuBtn     = document.getElementById('mobileMenuBtn');
  const menuOverlay = document.getElementById('mobileMenuOverlay');
  if (!menuBtn || !menuOverlay) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    menuOverlay.classList.remove('hidden');
    menuOverlay.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    lockScroll();
    // Animate in
    requestAnimationFrame(() => {
      menuOverlay.style.opacity  = '1';
      menuOverlay.style.transform = 'translateX(0)';
    });
    // Change icon to close
    const icon = menuBtn.querySelector('.material-symbols-outlined');
    if (icon) icon.textContent = 'close';
  }

  function closeMenu() {
    isOpen = false;
    menuOverlay.style.opacity   = '0';
    menuOverlay.style.transform = 'translateX(100%)';
    menuBtn.setAttribute('aria-expanded', 'false');
    setTimeout(() => {
      menuOverlay.classList.add('hidden');
      menuOverlay.setAttribute('aria-hidden', 'true');
    }, 300);
    unlockScroll();
    // Restore menu icon
    const icon = menuBtn.querySelector('.material-symbols-outlined');
    if (icon) icon.textContent = 'menu';
  }

  menuBtn.addEventListener('click', () => isOpen ? closeMenu() : openMenu());

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  // Close on backdrop click (outside the menu panel)
  menuOverlay.addEventListener('click', (e) => {
    if (e.target === menuOverlay) closeMenu();
  });

  // Close when a mobile nav link is clicked
  menuOverlay.querySelectorAll('a[href^="#"], button[data-scroll]').forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });
}

// ─────────────────────────────────────────────────────────────
// 3. SMOOTH SCROLL + ACTIVE NAV HIGHLIGHTING
// ─────────────────────────────────────────────────────────────
function initNavigation() {
  // Handle all links with href="#sectionId"
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') { e.preventDefault(); return; }
      const targetId = hash.substring(1);
      const target   = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        scrollToSection(targetId);
        // Update browser hash without jump
        history.replaceState(null, '', hash);
      }
    });
  });

  // "Book Now" button → scroll to contact
  document.querySelectorAll('[data-scroll="contact"]').forEach(btn => {
    btn.addEventListener('click', () => scrollToSection('contact'));
  });

  // "Explore Our Services" → scroll to services
  document.querySelectorAll('[data-scroll="services"]').forEach(btn => {
    btn.addEventListener('click', () => scrollToSection('services'));
  });

  // "Our Methodology" → scroll to the "How We Work" process section
  document.querySelectorAll('[data-scroll="methodology"]').forEach(btn => {
    btn.addEventListener('click', () => scrollToSection('process'));
  });

  // "View Open Positions" → open careers modal
  document.querySelectorAll('[data-action="open-careers"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCareersModal();
    });
  });

  // Scroll spy — update active nav state
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('nav a[href^="#"]');
  const OFFSET    = 120;

  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - OFFSET) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').substring(1);
      if (href === current) {
        link.classList.add('text-[#915EFF]');
        link.classList.remove('text-white/80');
      } else {
        link.classList.remove('text-[#915EFF]');
        link.classList.add('text-white/80');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

// ─────────────────────────────────────────────────────────────
// 4. CONTACT INFO CLICKABLE LINKS
// ─────────────────────────────────────────────────────────────
function initContactLinks() {
  // Make email spans/paragraphs containing the email address into clickable links
  document.querySelectorAll('[data-contact="email"]').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      window.location.href = `mailto:${COMPANY.email}`;
    });
    el.setAttribute('title', `Email: ${COMPANY.email}`);
  });

  document.querySelectorAll('[data-contact="phone"]').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      window.location.href = `tel:${COMPANY.phone}`;
    });
    el.setAttribute('title', `Call: ${COMPANY.phone}`);
  });

  document.querySelectorAll('[data-contact="address"]').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      window.open(COMPANY.mapUrl, '_blank', 'noopener,noreferrer');
    });
    el.setAttribute('title', 'Open in Google Maps');
  });
}

// ─────────────────────────────────────────────────────────────
// 5. SOCIAL MEDIA ICONS — safe no-navigate for empty URLs
// ─────────────────────────────────────────────────────────────
function initSocialLinks() {
  document.querySelectorAll('[data-social]').forEach(link => {
    const key = link.getAttribute('data-social');
    const url = COMPANY.social[key] || '';

    if (url) {
      link.href                  = url;
      link.target                = '_blank';
      link.rel                   = 'noopener noreferrer';
      link.removeAttribute('aria-disabled');
    } else {
      // No real URL yet — prevent navigation without changing layout
      link.removeAttribute('href');
      link.setAttribute('role',          'button');
      link.setAttribute('aria-disabled', 'true');
      link.setAttribute('tabindex',      '0');
      link.style.cursor = 'not-allowed';
      link.style.opacity = '0.5';
      link.addEventListener('click', (e) => e.preventDefault());
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
      });
    }
  });
}

// ─────────────────────────────────────────────────────────────
// 6. SERVICE DETAILS MODAL
// ─────────────────────────────────────────────────────────────
const SERVICE_DATA = {
  'Call Center': {
    icon: 'call',
    description: 'Our call center operations provide comprehensive inbound and outbound voice support. Dedicated agents handle customer queries, complaints, and escalations with professionalism and brand alignment.',
    benefits: [
      'Inbound customer support & helpdesk',
      'Outbound campaigns & follow-ups',
      'IVR scripting & queue management',
      'Call recording & quality auditing',
      'Real-time performance dashboards',
      'Multi-language capabilities',
    ],
  },
  'Lead Generation': {
    icon: 'person_add',
    description: 'We identify, qualify, and deliver high-intent prospects directly to your sales team. Our research-driven approach ensures your pipeline is filled with contacts who genuinely need your product or service.',
    benefits: [
      'Prospect research & list building',
      'Cold outreach & warm follow-up',
      'Lead qualification & scoring',
      'CRM data entry & management',
      'Appointment booking integration',
      'Campaign performance reporting',
    ],
  },
  'Customer Support': {
    icon: 'support_agent',
    description: 'Omnichannel customer support delivered across phone, email, live chat, and social media. Our agents become an extension of your brand, ensuring every customer interaction is consistent and resolution-focused.',
    benefits: [
      'Email, chat, and social support',
      'Ticket management & escalation',
      'First-call resolution focus',
      'Customer satisfaction tracking',
      'Shift coverage up to 24/7',
      'Onboarding & product guidance',
    ],
  },
  'Telesales': {
    icon: 'point_of_sale',
    description: 'Our trained telesales professionals convert interest into revenue. From cold pitches to warm follow-ups, we use proven conversation frameworks to close deals and expand your customer base.',
    benefits: [
      'Outbound sales calling',
      'Script development & refinement',
      'Objection handling techniques',
      'Pipeline progression tracking',
      'Upselling & cross-selling',
      'Conversion rate reporting',
    ],
  },
  'Appointment Setting': {
    icon: 'calendar_month',
    description: 'We fill your sales calendar with qualified decision-maker meetings so your closers can focus on what they do best. Every appointment is confirmed and reminder-followed for maximum show rates.',
    benefits: [
      'Targeted prospect outreach',
      'Calendar integration & scheduling',
      'Appointment confirmation calls',
      'No-show reduction follow-ups',
      'Daily & weekly schedule reports',
      'CRM updates after each booking',
    ],
  },
  'Back Office': {
    icon: 'inventory_2',
    description: 'We handle the administrative tasks that slow down your operations — from data entry and document processing to order management and compliance support — so your core team can focus on strategic work.',
    benefits: [
      'Data entry & database management',
      'Document processing & filing',
      'Order management & tracking',
      'Invoice & billing reconciliation',
      'Reporting & analytics support',
      'Process documentation',
    ],
  },
  'Business Development': {
    icon: 'rocket_launch',
    description: 'Our business development team assists with market analysis, outreach strategies, and partnership identification to help you expand into new verticals and territories effectively.',
    benefits: [
      'Market research & analysis',
      'Competitor benchmarking',
      'Partner & vendor outreach',
      'Sales territory planning',
      'Pipeline development strategy',
      'Growth opportunity reporting',
    ],
  },
  'Medical Billing': {
    icon: 'medical_services',
    description: 'End-to-end revenue cycle management for healthcare providers. Our medical billing team handles claim submission, follow-up, denial management, and patient statement processing with accuracy and compliance awareness.',
    benefits: [
      'Medical claim preparation & submission',
      'Insurance eligibility verification',
      'Denial management & appeals',
      'Payment posting & reconciliation',
      'Patient statement processing',
      'AR follow-up & reporting',
    ],
  },
};

let _serviceModalCleanup = null;
let _lastServiceTrigger  = null;

function openServiceModal(serviceName) {
  const data   = SERVICE_DATA[serviceName];
  const modal  = document.getElementById('serviceModal');
  const title  = document.getElementById('serviceModalTitle');
  const desc   = document.getElementById('serviceModalDesc');
  const list   = document.getElementById('serviceModalBenefits');
  const reqBtn = document.getElementById('serviceModalRequestBtn');
  if (!modal || !data) return;

  title.textContent = serviceName;
  desc.textContent  = data.description;
  list.innerHTML    = data.benefits
    .map(b => `<li class="flex items-start gap-2 text-gray-400">
      <span class="material-symbols-outlined text-[#915EFF] text-[16px] mt-0.5" style="font-variation-settings:'FILL' 1;">check_circle</span>
      <span>${b}</span>
    </li>`)
    .join('');

  // "Request This Service" → close modal, scroll to form, select service
  const newReqBtn = reqBtn.cloneNode(true); // remove old listeners
  reqBtn.parentNode.replaceChild(newReqBtn, reqBtn);
  newReqBtn.addEventListener('click', () => {
    closeServiceModal();
    scrollToSection('contact');
    const select = document.getElementById('contactService');
    if (select) {
      // Map service modal name to select option value
      const optionMap = {
        'Lead Generation': 'Lead Generation',
        'Business Development': 'Business Development',
      };
      const selectValue = optionMap[serviceName] || serviceName;
      for (const opt of select.options) {
        if (opt.value === selectValue || opt.text === selectValue) {
          opt.selected = true;
          break;
        }
      }
      // Focus first form field
      const firstField = document.getElementById('contactFullName');
      if (firstField) setTimeout(() => firstField.focus(), 600);
    }
  });

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  lockScroll();

  // Focus trap
  _serviceModalCleanup = createFocusTrap(modal);
}

function closeServiceModal() {
  const modal = document.getElementById('serviceModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  unlockScroll();
  if (_serviceModalCleanup) { _serviceModalCleanup(); _serviceModalCleanup = null; }
  if (_lastServiceTrigger)  { _lastServiceTrigger.focus(); _lastServiceTrigger = null; }
}

function initServiceModal() {
  const modal   = document.getElementById('serviceModal');
  const closeBtn = document.getElementById('serviceModalClose');
  if (!modal) return;

  // Close button
  if (closeBtn) closeBtn.addEventListener('click', closeServiceModal);

  // Backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeServiceModal();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeServiceModal();
  });

  // Wire up all "View Details" buttons
  document.querySelectorAll('[data-service]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      _lastServiceTrigger = btn;
      openServiceModal(btn.getAttribute('data-service'));
    });
  });
}

// ─────────────────────────────────────────────────────────────
// 7. FAQ ACCORDION
// ─────────────────────────────────────────────────────────────
function initFAQ() {
  // The existing HTML uses <details>/<summary> which has native toggle behaviour.
  // We enhance it: close others when one opens, and add smooth animation.
  const allDetails = document.querySelectorAll('#faqs details');

  allDetails.forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (detail.open) {
        // Close all other open details
        allDetails.forEach(other => {
          if (other !== detail && other.open) other.open = false;
        });
      }
    });

    // Keyboard support for summary
    const summary = detail.querySelector('summary');
    if (summary) {
      summary.setAttribute('tabindex', '0');
      summary.setAttribute('role',     'button');
      const isOpen = () => detail.open;
      summary.setAttribute('aria-expanded', String(isOpen()));

      detail.addEventListener('toggle', () => {
        summary.setAttribute('aria-expanded', String(detail.open));
      });
    }
  });
}

// ─────────────────────────────────────────────────────────────
// 8. HONEYPOT + SPAM PROTECTION HELPERS
// ─────────────────────────────────────────────────────────────
const FORM_LOAD_TIMES = {};
const COOLDOWN_MS     = 10000; // 10 second cooldown between submissions
const MIN_FILL_MS     = 3000;  // must spend at least 3 seconds on form

function recordFormLoad(formId) {
  FORM_LOAD_TIMES[formId] = Date.now();
}

function checkHoneypot(form) {
  const hp = form.querySelector('[data-honeypot]');
  return hp && hp.value !== ''; // true = bot detected
}

function checkMinTime(formId) {
  const elapsed = Date.now() - (FORM_LOAD_TIMES[formId] || 0);
  return elapsed < MIN_FILL_MS; // true = too fast
}

// ─────────────────────────────────────────────────────────────
// 9. CONSULTATION / CONTACT FORM → SUPABASE
// ─────────────────────────────────────────────────────────────
let contactLastSubmit = 0;

function initContactForm() {
  const form      = document.getElementById('contactForm');
  const feedback  = document.getElementById('contactFeedback');
  const submitBtn = document.getElementById('contactSubmitBtn');
  if (!form) return;

  recordFormLoad('contact');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Double-submit guard
    if (submitBtn.disabled) return;

    // Honeypot check
    if (checkHoneypot(form)) return;

    // Minimum time check
    if (checkMinTime('contact')) {
      showFeedback(feedback, 'Please take a moment to fill out the form completely.', 'error');
      return;
    }

    // Cooldown check
    const now = Date.now();
    if (now - contactLastSubmit < COOLDOWN_MS) {
      showFeedback(feedback, 'Please wait a moment before submitting again.', 'error');
      return;
    }

    // Gather + trim values
    const fullName   = document.getElementById('contactFullName').value.trim();
    const email      = document.getElementById('contactEmail').value.trim();
    const phone      = document.getElementById('contactPhone').value.trim();
    const company    = document.getElementById('contactCompany').value.trim();
    const service    = document.getElementById('contactService').value.trim();
    const message    = document.getElementById('contactMessage').value.trim();

    // Client-side validation
    const errors = [];
    if (!fullName)                  errors.push('Full name is required.');
    else if (fullName.length > 100) errors.push('Name cannot exceed 100 characters.');
    if (!email)                     errors.push('Email address is required.');
    else if (!isValidEmail(email))  errors.push('Please provide a valid email address.');
    if (!phone)                     errors.push('Phone number is required.');
    else if (!isValidPhone(phone))  errors.push('Please provide a valid phone number.');
    if (phone.length > 20)          errors.push('Phone number cannot exceed 20 characters.');
    if (!service)                   errors.push('Please select a service.');
    if (!message)                   errors.push('Message is required.');
    else if (message.length > 2000) errors.push('Message cannot exceed 2000 characters.');
    if (company.length > 150)       errors.push('Company name cannot exceed 150 characters.');

    if (errors.length) {
      showFeedback(feedback, errors[0], 'error');
      return;
    }

    // Disable submit + show loading
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';
    hideFeedback(feedback);

    try {
      const { error } = await supabaseClient
        .from('leads')
        .insert({
          full_name:     fullName,
          email:         email.toLowerCase(),
          phone:         phone,
          company_name:  company,
          service_needed: service,
          message:       message,
          status:        'new',
          source:        'website',
        });

      if (error) throw error;

      contactLastSubmit = Date.now();
      form.reset();
      showFeedback(feedback,
        '✅ Thank you! Your request has been received. Our team will contact you within 24 hours.',
        'success'
      );
      showToast('Consultation request sent successfully!', 'success');

    } catch (err) {
      // Log technical detail only in dev, show safe message to user
      if (window.location.hostname === 'localhost') {
        console.error('[Contact Form] Supabase error:', err);
      }
      showFeedback(feedback,
        'Something went wrong. Please try again or email us directly at ' + COMPANY.email,
        'error'
      );
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Send Request';
    }
  });
}

// ─────────────────────────────────────────────────────────────
// 10. CAREERS MODAL + APPLICATION FORM → SUPABASE
// ─────────────────────────────────────────────────────────────
let _careerFocusTrapCleanup = null;
let _careerTriggerBtn       = null;
let careerLastSubmit        = 0;

function openCareersModal() {
  const modal = document.getElementById('careersModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  lockScroll();
  _careerFocusTrapCleanup = createFocusTrap(modal);
  recordFormLoad('career');
}

function closeCareersModal() {
  const modal = document.getElementById('careersModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  unlockScroll();
  if (_careerFocusTrapCleanup) { _careerFocusTrapCleanup(); _careerFocusTrapCleanup = null; }
  if (_careerTriggerBtn)       { _careerTriggerBtn.focus(); _careerTriggerBtn = null; }
}

function initCareersModal() {
  const modal       = document.getElementById('careersModal');
  const openBtn     = document.getElementById('openCareersModalBtn');
  const closeBtn    = document.getElementById('closeCareersModalBtn');
  const bgOverlay   = document.getElementById('closeCareersModalBg');
  const form        = document.getElementById('careersForm');
  const feedback    = document.getElementById('careersFeedback');
  const submitBtn   = document.getElementById('careersSubmitBtn');
  if (!modal) return;

  if (openBtn) {
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      _careerTriggerBtn = openBtn;
      openCareersModal();
    });
  }

  if (closeBtn)  closeBtn.addEventListener('click',  closeCareersModal);
  if (bgOverlay) bgOverlay.addEventListener('click', closeCareersModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeCareersModal();
  });

  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitBtn.disabled) return;

    if (checkHoneypot(form)) return;
    if (checkMinTime('career')) {
      showFeedback(feedback, 'Please take a moment to fill in your details.', 'error');
      return;
    }

    const now = Date.now();
    if (now - careerLastSubmit < COOLDOWN_MS) {
      showFeedback(feedback, 'Please wait before submitting again.', 'error');
      return;
    }

    const fullName  = document.getElementById('careerFullName').value.trim();
    const email     = document.getElementById('careerEmail').value.trim();
    const phone     = document.getElementById('careerPhone').value.trim();
    const position  = document.getElementById('careerPosition').value.trim();
    const experience = document.getElementById('careerExperience').value.trim();
    const message   = document.getElementById('careerMessage').value.trim();
    const resumeUrl = document.getElementById('careerResume').value.trim();

    const errors = [];
    if (!fullName)                  errors.push('Full name is required.');
    else if (fullName.length > 100) errors.push('Name cannot exceed 100 characters.');
    if (!email)                     errors.push('Email address is required.');
    else if (!isValidEmail(email))  errors.push('Please provide a valid email address.');
    if (!phone)                     errors.push('Phone number is required.');
    else if (!isValidPhone(phone))  errors.push('Please provide a valid phone number.');
    if (!position)                  errors.push('Please select a position.');
    if (experience.length > 500)    errors.push('Experience field cannot exceed 500 characters.');
    if (message.length > 2000)      errors.push('Message cannot exceed 2000 characters.');
    if (resumeUrl && !isValidHttpUrl(resumeUrl)) {
      errors.push('Resume URL must be a valid http or https link.');
    }

    if (errors.length) {
      showFeedback(feedback, errors[0], 'error');
      return;
    }

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Submitting…';
    hideFeedback(feedback);

    try {
      const { error } = await supabaseClient
        .from('applications')
        .insert({
          full_name:        fullName,
          email:            email.toLowerCase(),
          phone:            phone,
          position_applied: position,
          experience:       experience,
          message:          message,
          resume_url:       resumeUrl,
          status:           'new',
          source:           'website',
        });

      if (error) throw error;

      careerLastSubmit = Date.now();
      form.reset();
      showFeedback(feedback,
        '✅ Application submitted! We will review it and contact you soon.',
        'success'
      );
      showToast('Application submitted successfully!', 'success');
      setTimeout(() => closeCareersModal(), 4000);

    } catch (err) {
      if (window.location.hostname === 'localhost') {
        console.error('[Career Form] Supabase error:', err);
      }
      showFeedback(feedback,
        'Something went wrong. Please try again or email us at ' + COMPANY.email,
        'error'
      );
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Submit Application';
    }
  });
}

// ─────────────────────────────────────────────────────────────
// 11. FEEDBACK DISPLAY HELPERS
// ─────────────────────────────────────────────────────────────
function showFeedback(el, msg, type) {
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden',
    'bg-green-500/20', 'text-green-400', 'border-green-500/30',
    'bg-red-500/20',   'text-red-400',   'border-red-500/30', 'border'
  );

  if (type === 'success') {
    el.classList.add('bg-green-500/20', 'text-green-400', 'border', 'border-green-500/30');
  } else {
    el.classList.add('bg-red-500/20', 'text-red-400', 'border', 'border-red-500/30');
  }
  el.classList.remove('hidden');
  el.setAttribute('role', 'alert');
}

function hideFeedback(el) {
  if (!el) return;
  el.classList.add('hidden');
  el.textContent = '';
}

// ─────────────────────────────────────────────────────────────
// 12. COUNTER ANIMATIONS
// ─────────────────────────────────────────────────────────────
function initCounters() {
  const statEls = document.querySelectorAll('.stat-num[data-target]');
  if (!statEls.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Use IntersectionObserver to trigger once when stats section is visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target); // run once

      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);

      if (prefersReduced || typeof gsap === 'undefined') {
        // No animation — just set final value instantly
        el.textContent = target;
        return;
      }

      gsap.to({ val: 0 }, {
        val:       target,
        duration:  2.5,
        ease:      'power3.out',
        onUpdate:  function () {
          el.textContent = Math.round(this.targets()[0].val);
        },
        onComplete: function () {
          el.textContent = target;
        },
      });
    });
  }, { threshold: 0.4 });

  statEls.forEach(el => observer.observe(el));
}

// ─────────────────────────────────────────────────────────────
// 13. AOS + GSAP INITIALISATION (preserved from original)
// ─────────────────────────────────────────────────────────────
function initAnimations() {
  // AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing:   'ease-in-out',
      once:     true,
      offset:   50,
    });
  }

  // GSAP Timeline Scroll for "Why Choose Us" section (preserved)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const scrollSection = document.getElementById('why-choose-us-scroll');
    if (scrollSection && window.innerWidth >= 768) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollSection,
          start:   'top top',
          end:     '+=300vh',
          scrub:   1,
          pin:     true,
        },
      });
      tl.to('#why-choose-title', { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
        .to('#why-choose-title', { opacity: 0, y: -20, duration: 1, delay: 0.5 });
      const cards = gsap.utils.toArray('.gsap-feature-card');
      cards.forEach(card => {
        tl.to(card, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.5');
      });
      tl.to({}, { duration: 2 });
    }
  }
}

// ─────────────────────────────────────────────────────────────
// 14. TIMELINE SCROLL ANIMATION (preserved from original)
// ─────────────────────────────────────────────────────────────
function initTimeline() {
  const container = document.getElementById('timeline-container');
  const progress  = document.getElementById('timeline-progress');
  const icons     = document.querySelectorAll('.timeline-icon');
  if (!container || !progress) return;

  window.addEventListener('scroll', () => {
    const rect          = container.getBoundingClientRect();
    const containerTop  = rect.top + window.scrollY;
    const windowHalf    = window.innerHeight / 2;
    let scrollPos       = window.scrollY + windowHalf - containerTop;
    scrollPos = Math.max(0, Math.min(scrollPos, container.offsetHeight));
    progress.style.height = `${scrollPos}px`;

    icons.forEach(icon => {
      const iconTop = icon.getBoundingClientRect().top + window.scrollY;
      if (window.scrollY + windowHalf > iconTop + 20) {
        icon.classList.add('bg-[#915EFF]', 'border-[#915EFF]', 'shadow-[0_0_20px_rgba(27,77,255,0.5)]');
        icon.classList.remove('bg-[#0b080c]', 'border-[#151030]');
      } else {
        icon.classList.remove('bg-[#915EFF]', 'border-[#915EFF]', 'shadow-[0_0_20px_rgba(27,77,255,0.5)]');
        icon.classList.add('bg-[#0b080c]', 'border-[#151030]');
      }
    });
  }, { passive: true });
}

// ─────────────────────────────────────────────────────────────
// 15. TYPEWRITER EFFECT (preserved from original)
// ─────────────────────────────────────────────────────────────
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const phrases    = [
    'Premium Call Center Solutions',
    'High-Intent Lead Generation',
    'Enterprise Back-Office Support',
    '24/7 Global Customer Care',
  ];
  let phraseIndex  = 0;
  let letterIndex  = 0;
  let isDeleting   = false;
  let typeSpeed    = 100;

  function type() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      el.textContent = current.substring(0, letterIndex - 1);
      letterIndex--;
      typeSpeed = 50;
    } else {
      el.textContent = current.substring(0, letterIndex + 1);
      letterIndex++;
      typeSpeed = 100;
    }
    if (!isDeleting && letterIndex === current.length) {
      isDeleting = true; typeSpeed = 2000;
    } else if (isDeleting && letterIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500;
    }
    setTimeout(type, typeSpeed);
  }
  setTimeout(type, 1000);
}

// ─────────────────────────────────────────────────────────────
// 16. POLICY PAGE LINKS — footer links
// ─────────────────────────────────────────────────────────────
function initFooterLinks() {
  // Footer service links → scroll to services section
  document.querySelectorAll('[data-scroll="services"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToSection('services');
    });
  });
}

// ─────────────────────────────────────────────────────────────
// BOOT — run everything on DOMContentLoaded
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initAnimations();    // AOS + GSAP (must be first)
  initMobileMenu();
  initNavigation();
  initContactLinks();
  initSocialLinks();
  initServiceModal();
  initFAQ();
  initContactForm();
  initCareersModal();
  initCounters();
  initTimeline();
  initTypewriter();
  initFooterLinks();
});
