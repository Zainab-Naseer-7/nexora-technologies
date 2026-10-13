/**
 * NEXORA TECHNOLOGIES - Interactive Application Logic
 * Premium, Production-Ready Corporate Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation & Header Scroll State
  const navbar = document.querySelector('.navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  // Sticky Navbar shadow on scroll
  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll to Top Button Visibility
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }

    // Active Navigation Highlight
    updateActiveNavLink();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile Menu Toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      const isExpanded = navToggle.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu if clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Scroll to Top Click
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Active Link on Scroll
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Smooth scroll for all hash links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 2. Animated Counter for Statistics Section
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      const duration = 1600; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing out curve
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        const currentVal = Math.floor(easeOutQuad * target);
        
        stat.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent = target;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const statsSection = document.querySelector('.statistics');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateCounters();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    observer.observe(statsSection);
  } else if (statNumbers.length > 0) {
    animateCounters();
  }

  // --------------------------------------------------------------------------
  // 3. Portfolio / Projects Filter System
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 4. Modal System (Universal Dialog Handler)
  // --------------------------------------------------------------------------
  const modalBackdrop = document.getElementById('globalModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalActionBtn = document.getElementById('modalActionBtn');

  const openModal = ({ title, content, actionText, onAction }) => {
    if (!modalBackdrop) return;
    modalTitle.textContent = title;
    modalBody.innerHTML = content;

    if (actionText && onAction) {
      modalActionBtn.textContent = actionText;
      modalActionBtn.style.display = 'inline-flex';
      modalActionBtn.onclick = () => {
        onAction();
        closeModal();
      };
    } else {
      modalActionBtn.style.display = 'none';
    }

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  // --------------------------------------------------------------------------
  // 5. Toast Feedback System
  // --------------------------------------------------------------------------
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  const showToast = (message, duration = 4000) => {
    if (!toastNotification) return;
    toastMessage.textContent = message;
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, duration);
  };

  // --------------------------------------------------------------------------
  // 6. Project Details Interactive Modals
  // --------------------------------------------------------------------------
  const projectData = {
    'corporate-website': {
      title: 'Corporate Business Website',
      category: 'Websites & Enterprise Portals',
      description: 'A cutting-edge corporate website developed for an international consulting group with multi-language capabilities, sub-second load times, and custom CMS architecture.',
      techStack: ['HTML5', 'CSS3', 'Modern JavaScript', 'PHP', 'MySQL', 'SEO Optimization'],
      features: [
        'Responsive layout optimized for enterprise clients',
        'Sub-second page load times with 99.8% Google PageSpeed score',
        'Integrated dynamic consultation scheduler',
        'Bank-grade SSL security architecture'
      ],
      impact: 'Generated a 145% increase in online lead generation within the first 60 days.'
    },
    'pharmacy-management': {
      title: 'Pharmacy Management System',
      category: 'Management Systems & ERP',
      description: 'A comprehensive pharmacy automation suite engineered to coordinate prescription orders, batch expiry tracking, barcode inventory, and ledger accounting.',
      techStack: ['Python', 'MySQL', 'JavaScript', 'C++', 'Git'],
      features: [
        'Real-time medicine stock tracking with automatic expiry alerts',
        'Instant barcode POS checkout and billing',
        'Secure patient medication prescription history',
        'Daily, weekly, and monthly audit reports'
      ],
      impact: 'Decreased manual record errors by 98% and reduced checkout wait times by 65%.'
    },
    'rabta-platform': {
      title: 'Rabta Communication Platform',
      category: 'Software & Cloud Collaboration',
      description: 'A unified enterprise communication application providing secure end-to-end encrypted messaging, departmental channels, document sharing, and audio conferencing.',
      techStack: ['JavaScript', 'WebSockets', 'Python', 'MySQL', 'GitHub'],
      features: [
        'Real-time messaging with instant read receipts',
        'End-to-end encrypted departmental rooms',
        'Integrated enterprise document storage and search',
        'Role-based granular access control'
      ],
      impact: 'Connected 12,000+ internal corporate employees with 99.99% uptime.'
    },
    'calculator-pro': {
      title: 'Calculator Pro Productivity Suite',
      category: 'UI/UX & Interactive Utilities',
      description: 'A sleek, lightweight financial and scientific computing tool built with clean architectural precision, keyboard hotkey bindings, history tracking, and unit converters.',
      techStack: ['HTML5', 'CSS3 (Variables & Grid)', 'JavaScript (ES6+)', 'Git'],
      features: [
        'Scientific calculations, financial amortization, and tax projections',
        'Full session calculation history with one-click export',
        'Ultra-fast instant keyboard shortcuts',
        'Zero external runtime dependencies'
      ],
      impact: 'Over 85,000 active daily calculations performed with flawless reliability.'
    },
    'enterprise-erp': {
      title: 'Enterprise Resource Planning (ERP)',
      category: 'Management Systems',
      description: 'A centralized multi-tenant resource planner facilitating automated supply-chain dispatch, automated invoicing, payroll records, and cross-departmental analytics.',
      techStack: ['PHP', 'MySQL', 'Python', 'JavaScript', 'Git'],
      features: [
        'Automated billing and accounts receivable reconciliation',
        'Warehouse stock level forecasting using predictive models',
        'HR and attendance timesheet sync',
        'Comprehensive executive reporting dashboard'
      ],
      impact: 'Saved client teams over 20 hours of administrative labor weekly.'
    },
    'apex-fintech': {
      title: 'Apex Financial Analytics Portal',
      category: 'Websites & UI/UX',
      description: 'An institutional-grade portfolio dashboard with real-time currency conversion rates, risk assessment graphs, and audit-ready compliance tracking.',
      techStack: ['JavaScript', 'HTML5', 'CSS3', 'Python API', 'MySQL'],
      features: [
        'Interactive financial metrics and visualization graphs',
        'Multi-currency automated settlement conversions',
        'SOC2 compliant permission layers',
        'Dark/Light corporate high-contrast layout'
      ],
      impact: 'Monitors over $45M in simulated transactions with zero downtime.'
    }
  };

  document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      const data = projectData[projectId];
      if (!data) return;

      const techBadges = data.techStack.map(t => `<span class="tech-pill">${t}</span>`).join(' ');
      const featureList = data.features.map(f => `
        <li style="margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;">
          <svg style="width: 16px; height: 16px; color: #2563eb; flex-shrink: 0; margin-top: 3px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span style="font-size: 0.9rem; color: #334155;">${f}</span>
        </li>
      `).join('');

      const content = `
        <div style="margin-bottom: 20px;">
          <span class="project-category" style="margin-bottom: 12px; display: inline-block;">${data.category}</span>
          <p style="font-size: 0.95rem; color: #475569; line-height: 1.65; margin-bottom: 20px;">${data.description}</p>
          
          <h4 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 10px;">Key Engineering Features</h4>
          <ul style="margin-bottom: 22px;">${featureList}</ul>

          <h4 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 10px;">Technology Architecture</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 22px;">${techBadges}</div>

          <div style="background-color: #eff6ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 14px 18px;">
            <strong style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; color: #1e40af; display: block; margin-bottom: 4px;">Verified Impact</strong>
            <p style="font-size: 0.9rem; color: #1e3a8a; margin: 0;">${data.impact}</p>
          </div>
        </div>
      `;

      openModal({
        title: data.title,
        content: content,
        actionText: 'Request Similar Solution',
        onAction: () => {
          const contactSection = document.getElementById('contact');
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            const serviceSelect = document.getElementById('serviceSelect');
            if (serviceSelect) {
              serviceSelect.value = data.category.includes('Software') ? 'software' : 'web';
            }
            const detailsField = document.getElementById('projectDetails');
            if (detailsField) {
              detailsField.value = `I am interested in a solution similar to ${data.title}. Please provide an architecture overview and quote.`;
            }
          }
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 7. Service Learn More Details
  // --------------------------------------------------------------------------
  const serviceDetails = {
    'web': {
      title: 'Web Development Services',
      desc: 'We engineer bespoke, lightning-fast, and responsive web platforms designed to scale seamlessly with your organizational growth.',
      deliverables: [
        'Single Page Applications (SPAs) & Corporate Web Portals',
        'Full responsive design across Desktop, Mobile, and Tablets',
        'Search Engine Optimization (SEO) & Web Performance Tuning',
        'Secure API Integrations and Content Management Systems'
      ]
    },
    'software': {
      title: 'Custom Software Development',
      desc: 'Transforming complex business logic into dependable, automated software solutions built on modern architectural principles.',
      deliverables: [
        'Enterprise Business Management Software',
        'Cross-platform Desktop and Systems Utilities',
        'API & Microservices Architecture',
        'Database Modeling, Optimization & Data Migration'
      ]
    },
    'uiux': {
      title: 'UI/UX Experience Design',
      desc: 'User-centric interfaces that blend intuitive aesthetics with frictionless user journeys, wireframing, and interactive design tokens.',
      deliverables: [
        'Complete Design Systems & Component Libraries',
        'High-Fidelity Wireframing and Clickable Prototypes',
        'Usability Testing, Heuristic Evaluations & Audits',
        'Responsive Mobile-First Information Architecture'
      ]
    },
    'mobile': {
      title: 'Mobile Solutions',
      desc: 'Crafting responsive, native-like mobile web applications and connected digital tools built for speed and effortless navigation.',
      deliverables: [
        'Progressive Web Apps (PWA) with Offline Capabilities',
        'Mobile-Optimized Enterprise Client Dashboards',
        'Cross-Device Synchronization & Push Notification Integration',
        'App Store and Web Compliance Assurance'
      ]
    },
    'ecommerce': {
      title: 'E-Commerce Solutions',
      desc: 'Robust digital commerce storefronts equipped with secure checkout flows, product inventory management, and automated payment gateways.',
      deliverables: [
        'Custom Online Storefronts & Catalog Filtering',
        'Payment Gateway Integration (Stripe, PayPal, Local Gateways)',
        'Inventory Sync & Warehouse Dispatch Management',
        'Order Tracking & Customer Notification Pipeline'
      ]
    },
    'consulting': {
      title: 'Strategic IT Consulting',
      desc: 'Expert technical advisory helping founders and corporate leaders choose the right tech stack, optimize infrastructure, and reduce tech debt.',
      deliverables: [
        'Technology Stack Audit & Architecture Recommendations',
        'Cloud Infrastructure & Scalability Strategy',
        'Security Compliance, Code Quality & Dev Process Reviews',
        'Digital Transformation Roadmaps for Enterprises'
      ]
    }
  };

  document.querySelectorAll('.learn-service-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = btn.getAttribute('data-service');
      const item = serviceDetails[serviceKey];
      if (!item) return;

      const delList = item.deliverables.map(d => `
        <li style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
          <svg style="width: 16px; height: 16px; color: #2563eb; flex-shrink: 0;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span style="font-size: 0.9rem; color: #334155;">${d}</span>
        </li>
      `).join('');

      const content = `
        <div style="margin-bottom: 20px;">
          <p style="font-size: 0.975rem; color: #475569; line-height: 1.65; margin-bottom: 20px;">${item.desc}</p>
          <h4 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 12px;">What We Deliver</h4>
          <ul style="margin-bottom: 24px;">${delList}</ul>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px;">
            <span style="font-size: 0.85rem; color: #64748b;">Ready to discuss your project scope? Our engineering leads are available for an exploratory consultation.</span>
          </div>
        </div>
      `;

      openModal({
        title: item.title,
        content: content,
        actionText: 'Book Service Consultation',
        onAction: () => {
          const contact = document.getElementById('contact');
          if (contact) {
            contact.scrollIntoView({ behavior: 'smooth' });
            const select = document.getElementById('serviceSelect');
            if (select) select.value = serviceKey;
          }
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 8. About Section "Learn More" Modal
  // --------------------------------------------------------------------------
  const aboutLearnMoreBtn = document.getElementById('aboutLearnMoreBtn');
  if (aboutLearnMoreBtn) {
    aboutLearnMoreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const content = `
        <div>
          <p style="font-size: 0.95rem; color: #334155; line-height: 1.65; margin-bottom: 16px;">
            <strong>Nexora Technologies</strong> was founded with a singular conviction: technology is most powerful when it is pragmatic, maintainable, and directly aligned with measurable business outcomes.
          </p>
          <p style="font-size: 0.95rem; color: #475569; line-height: 1.65; margin-bottom: 18px;">
            From agile startups to established enterprise institutions, we bridge the gap between complex engineering challenges and seamless digital experiences. Our team operates on the principles of disciplined code quality, uncompromising data integrity, and strict adherence to project deadlines.
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px;">
            <div style="background: #f8fafc; padding: 14px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <strong style="color: #0f172a; font-size: 0.9rem; display: block; margin-bottom: 4px;">Zero Overhead Architecture</strong>
              <span style="font-size: 0.825rem; color: #64748b;">Clean, fast codebases built without bloated dependencies.</span>
            </div>
            <div style="background: #f8fafc; padding: 14px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <strong style="color: #0f172a; font-size: 0.9rem; display: block; margin-bottom: 4px;">Long-Term Partnership</strong>
              <span style="font-size: 0.825rem; color: #64748b;">Post-launch optimization, telemetry monitoring, and SLAs.</span>
            </div>
          </div>
        </div>
      `;

      openModal({
        title: 'About Nexora Technologies',
        content: content,
        actionText: 'Contact Our Leadership',
        onAction: () => {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. Careers "View Open Positions" & "Apply Now" Modals
  // --------------------------------------------------------------------------
  const viewPositionsBtn = document.getElementById('viewPositionsBtn');
  if (viewPositionsBtn) {
    viewPositionsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const posContainer = document.querySelector('.positions-list');
      if (posContainer) {
        posContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        posContainer.style.transition = 'outline 0.3s';
        posContainer.style.outline = '2px solid #2563eb';
        setTimeout(() => { posContainer.style.outline = 'none'; }, 1500);
      }
    });
  }

  document.querySelectorAll('.apply-job-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const jobRole = btn.getAttribute('data-role') || 'Software Engineer';
      
      const content = `
        <form id="quickJobForm" style="display: flex; flex-direction: column; gap: 14px;">
          <div>
            <label style="font-size: 0.85rem; font-weight: 600; color: #0f172a; display: block; margin-bottom: 6px;">Applying For Position</label>
            <input type="text" value="${jobRole}" readonly style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; background-color: #f1f5f9; border-radius: 6px; font-weight: 600; color: #1e293b;">
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600; color: #0f172a; display: block; margin-bottom: 6px;">Full Name *</label>
            <input type="text" id="jobApplicantName" required placeholder="e.g. Asad Khan" style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 6px;">
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600; color: #0f172a; display: block; margin-bottom: 6px;">Email Address *</label>
            <input type="email" id="jobApplicantEmail" required placeholder="name@example.com" style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 6px;">
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600; color: #0f172a; display: block; margin-bottom: 6px;">Portfolio / GitHub / LinkedIn URL *</label>
            <input type="url" id="jobApplicantUrl" required placeholder="https://github.com/username" style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 6px;">
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600; color: #0f172a; display: block; margin-bottom: 6px;">Brief Introduction</label>
            <textarea id="jobApplicantNote" rows="3" placeholder="Tell us why you would be a great fit for Nexora..." style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 6px; resize: vertical;"></textarea>
          </div>
        </form>
      `;

      openModal({
        title: `Apply: ${jobRole}`,
        content: content,
        actionText: 'Submit Application',
        onAction: () => {
          const name = document.getElementById('jobApplicantName')?.value.trim();
          const email = document.getElementById('jobApplicantEmail')?.value.trim();
          const url = document.getElementById('jobApplicantUrl')?.value.trim();

          if (!name || !email || !url) {
            alert('Please fill in your name, email, and portfolio/LinkedIn link.');
            return false;
          }

          showToast(`Application received! Thank you, ${name}. Our talent team will review your profile.`);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 10. Legal Modals (Privacy Policy & Terms)
  // --------------------------------------------------------------------------
  const privacyLink = document.getElementById('privacyPolicyLink');
  const termsLink = document.getElementById('termsLink');

  if (privacyLink) {
    privacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal({
        title: 'Privacy Policy - Nexora Technologies',
        content: `
          <p style="font-size: 0.925rem; color: #475569; line-height: 1.6; margin-bottom: 14px;">
            Nexora Technologies is committed to safeguarding client and visitor privacy. All data submitted via our digital channels is treated with strict confidentiality.
          </p>
          <p style="font-size: 0.925rem; color: #475569; line-height: 1.6; margin-bottom: 14px;">
            We do not sell or monetize personal information. Information gathered through inquiries is utilized solely for technical communication, project scoping, and enterprise service delivery.
          </p>
          <span style="font-size: 0.8rem; color: #94a3b8;">Effective Date: January 1, 2026.</span>
        `
      });
    });
  }

  if (termsLink) {
    termsLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal({
        title: 'Terms of Service - Nexora Technologies',
        content: `
          <p style="font-size: 0.925rem; color: #475569; line-height: 1.6; margin-bottom: 14px;">
            By utilizing the digital services of Nexora Technologies, clients agree to adhere to agreed Master Service Agreements (MSAs), Statement of Work (SOW) guidelines, and standard intellectual property protections.
          </p>
          <p style="font-size: 0.925rem; color: #475569; line-height: 1.6; margin-bottom: 14px;">
            All custom source code developed for paid client contracts is assigned to the client upon milestone settlement in accordance with contractual agreements.
          </p>
          <span style="font-size: 0.8rem; color: #94a3b8;">Last Revised: 2026.</span>
        `
      });
    });
  }

  // --------------------------------------------------------------------------
  // 11. Contact Form Client-Side Validation & Submission
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const fullName = document.getElementById('fullName');
      const email = document.getElementById('emailAddress');
      const phone = document.getElementById('phoneNumber');
      const company = document.getElementById('companyName');
      const service = document.getElementById('serviceSelect');
      const details = document.getElementById('projectDetails');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      // Helper to set error
      const setError = (input, hasError) => {
        const parent = input.closest('.form-group');
        if (hasError) {
          parent.classList.add('has-error');
          input.classList.add('invalid');
          isValid = false;
        } else {
          parent.classList.remove('has-error');
          input.classList.remove('invalid');
        }
      };

      // Validate Full Name
      if (!fullName.value.trim() || fullName.value.trim().length < 2) {
        setError(fullName, true);
      } else {
        setError(fullName, false);
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
        setError(email, true);
      } else {
        setError(email, false);
      }

      // Validate Phone (optional length check if provided, or min 6 chars)
      if (phone.value.trim() && phone.value.trim().length < 7) {
        setError(phone, true);
      } else {
        setError(phone, false);
      }

      // Validate Service Select
      if (!service.value) {
        setError(service, true);
      } else {
        setError(service, false);
      }

      // Validate Project Details (at least 10 characters)
      if (!details.value.trim() || details.value.trim().length < 10) {
        setError(details, true);
      } else {
        setError(details, false);
      }

      if (!isValid) {
        showToast('Please correct the highlighted fields before submitting.');
        return;
      }

      // Simulated Submission State
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg style="width: 18px; height: 18px; animation: spin 1s linear infinite;" fill="none" viewBox="0 0 24 24">
          <circle style="opacity: 0.25;" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path style="opacity: 0.75;" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Sending Message...</span>
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        contactForm.reset();

        showToast('Thank you! Your inquiry has been dispatched to the Nexora engineering team.');
      }, 1200);
    });

    // Real-time input error clearing on user typing
    contactForm.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        const parent = input.closest('.form-group');
        if (parent.classList.contains('has-error')) {
          parent.classList.remove('has-error');
          input.classList.remove('invalid');
        }
      });
    });
  }

  // Add Keyframe animation for spinner in head dynamically
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
});
