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

    // Animação das barras de habilidades
    const skillBars = document.querySelectorAll('.skills-progress-fill');
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.width = `${progress}%`;
    });
});

//Opening or closing side bar
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
sidebarBtn.addEventListener("click", function() {elementToggleFunc(sidebar); })

// Get modal elements
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const closeBtn = document.querySelector(".modal-close");

// Get all project images
const projectImages = document.querySelectorAll(".project-img img");

// Add click event to each image
projectImages.forEach(img => {
    img.addEventListener("click", function (e) {
        modal.style.display = "block";
    });
});

// skill animation on scroll
document.addEventListener('DOMContentLoaded', () => {
    const skillsSection = document.querySelector('.skill');
    if (!skillsSection) return;

    const skillsFills = document.querySelectorAll('.skills-progress-fill');

    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.5 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Para cada barra de progresso, acione a animação
                skillsFills.forEach(fill => {
                    const progress = fill.getAttribute('data-progress');
                    
                    // Defina a variável CSS para a largura de destino
                    fill.style.setProperty('--progress', `${progress}%`);

                    // Use requestAnimationFrame para garantir que a transição seja acionada
                    // após o navegador ter renderizado a largura inicial (width: 0)
                    requestAnimationFrame(() => {
                        fill.classList.add('active');
                    });
                });
                
                // Pare de observar a seção para não repetir a animação
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    observer.observe(skillsSection);
});