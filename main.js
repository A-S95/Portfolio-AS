'use strict';

// Botao tema Escuro e branco
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('toggle-theme');

    // Aplica o tema salvo (se houver)
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
      toggle.checked = true;
    }

    // Troca o tema ao clicar
    toggle.addEventListener('change', function () {
      if (this.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll("[data-nav-link]");
    const pages = document.querySelectorAll("[data-page]");

    navLinks.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        // Remover classe .active de todos os botões e artigos
        navLinks.forEach(link => link.classList.remove("active"));
        pages.forEach(page => page.classList.remove("active"));

        // Adicionar classe .active no botão clicado e respetivo artigo
        btn.classList.add("active");
        pages[index].classList.add("active");
      });
    });

});

//Opening or closing side bar
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
if (sidebar && sidebarBtn) {
    sidebarBtn.addEventListener("click", function() {elementToggleFunc(sidebar); })
}

// Get modal elements
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const closeBtn = document.querySelector(".modal-close");

// Preview button (eye icon) on each project image opens a lightbox
if (modal && modalImg && closeBtn) {
    const openModal = (src, alt) => {
        modalImg.src = src;
        modalImg.alt = alt || "";
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        modal.classList.remove("open");
        document.body.style.overflow = "";
    };

    document.querySelectorAll(".project-item-icon-box").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            const img = btn.closest(".project-img")?.querySelector("img");
            if (img) openModal(img.src, img.alt);
        });
    });

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });
}

// Expand/collapse job cards (Experience, Education entries, Skills, Languages)
document.querySelectorAll('[data-job-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('[data-job]');
        const isOpen = item.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen);

        if (isOpen && item.hasAttribute('data-skills-card') && !item.dataset.animated) {
            item.dataset.animated = 'true';
            item.querySelectorAll('.skills-progress-fill').forEach(fill => {
                const progress = fill.getAttribute('data-progress');
                fill.style.setProperty('--progress', `${progress}%`);
                requestAnimationFrame(() => fill.classList.add('active'));
            });
        }
    });
});

// Scroll reveal for content sections
document.addEventListener('DOMContentLoaded', () => {
    const fadeUpEls = document.querySelectorAll('.service-item, .skills-item, .clients');
    const fadeOnlyEls = document.querySelectorAll('.job-card');

    fadeUpEls.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(i % 6) * 70}ms`;
    });

    fadeOnlyEls.forEach((el, i) => {
        el.classList.add('reveal', 'reveal-fade');
        el.style.transitionDelay = `${(i % 6) * 70}ms`;
    });

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    fadeUpEls.forEach(el => revealObserver.observe(el));
    fadeOnlyEls.forEach(el => revealObserver.observe(el));
});
