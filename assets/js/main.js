// Lorsque l'utilisateur descend de 100px depuis le haut de la page, le bouton apparaît
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    scrollTopBtn.classList.remove("hidden");
  } else {
    scrollTopBtn.classList.add("hidden");
  }
}

// Lorsque l'utilisateur clique sur le bouton, il remonte en haut de la page
function topFunction() {
  window.scrollTo({top: 0, behavior: 'smooth'}); // Remonte avec un effet smooth
}





document.addEventListener("DOMContentLoaded", function () {
  const faders = document.querySelectorAll('.fade-in');

  const appearOptions = {
    threshold: 0.3, // L'élément apparaîtra quand 30% de sa hauteur est visible
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver(function (
    entries,
    appearOnScroll
  ) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return; // Sortir si l'élément n'est pas visible
      } else {
        entry.target.classList.add("show");
        appearOnScroll.unobserve(entry.target); // Désactiver l'observateur une fois l'animation terminée
      }
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });
});
