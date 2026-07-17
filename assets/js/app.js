document.addEventListener("DOMContentLoaded", () => {
  // 1. Elementos del DOM
  const mainHeader = document.querySelector(".main-header");
  const indicatorActive = document.getElementById("indicator-active");
  const feedSections = document.querySelectorAll(".feed-section");

  // 2. Comportamiento dinámico de la cabecera / logotipo y botón flotante al hacer scroll
  const instagramFloat = document.querySelector(".instagram-float");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
      mainHeader.classList.add("scrolled");
      if (instagramFloat) instagramFloat.classList.add("visible");
    } else {
      mainHeader.classList.remove("scrolled");
      if (instagramFloat) instagramFloat.classList.remove("visible");
    }
  });

  // 3. Intersection Observer para secciones del feed
  // Detecta qué playera/sección está centrada en pantalla
  const observerOptions = {
    root: null, // viewport
    rootMargin: "-25% 0px -25% 0px", // Evalúa cuando la sección cruza la mitad de la pantalla
    threshold: 0.2 // Se dispara al tener al menos el 20% visible en este margen
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remover clase activa de todas las secciones y agregarla a la actual
        feedSections.forEach(sec => sec.classList.remove("active-section"));
        entry.target.classList.add("active-section");

        // Obtener el label dinámico de la sección
        const sectionLabel = entry.target.getAttribute("data-label");
        
        // Actualizar el indicador lateral
        if (indicatorActive && sectionLabel) {
          indicatorActive.textContent = sectionLabel;
        }
      }
    });
  }, observerOptions);

  // Observar cada sección del feed
  feedSections.forEach(section => {
    observer.observe(section);
  });

  // 4. Lógica Interactiva para las variantes de cada Modelo (Opción B)
  const designSections = document.querySelectorAll(".design-section");
  
  designSections.forEach(section => {
    const img = section.querySelector(".feed-img");
    if (!img) return;

    const basePath = img.getAttribute("data-base-path");
    const colorBtns = section.querySelectorAll(".color-btn");
    const viewToggleBtn = section.querySelector(".view-toggle-btn");

    // Estado local para este diseño
    let activeColor = "blanco";
    let activeView = "frente";

    // Función para actualizar la imagen con transición suave (cross-fade)
    const updateProductImage = () => {
      img.style.opacity = "0";
      img.style.transform = "scale(0.98)";
      
      setTimeout(() => {
        img.src = `${basePath}_${activeColor}_${activeView}.jpg`;
        img.alt = `${section.getAttribute("data-label")} - ${activeColor} ${activeView}`;
        
        img.onload = () => {
          img.style.opacity = "1";
          img.style.transform = "scale(1)";
        };
      }, 180);
    };

    // Escuchar selección de color
    colorBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const color = btn.getAttribute("data-color");
        if (color === activeColor) return;

        // Cambiar botón activo
        colorBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        activeColor = color;
        updateProductImage();
      });
    });

    // Escuchar toggle de vista (frente/reverso)
    if (viewToggleBtn) {
      viewToggleBtn.addEventListener("click", () => {
        if (activeView === "frente") {
          activeView = "reverso";
          viewToggleBtn.textContent = "[ VISTA FRENTE ]";
        } else {
          activeView = "frente";
          viewToggleBtn.textContent = "[ VISTA POSTERIOR ]";
        }
        updateProductImage();
      });
    }
  });
});
