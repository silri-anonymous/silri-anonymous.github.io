(function () {
  function initHangCarousel() {
    var viewport = document.getElementById('hang-carousel-viewport');
    var track = document.getElementById('hang-carousel-track');
    var dots = document.getElementById('hang-carousel-dots');
    if (!viewport || !track) return;

    var slides = Array.prototype.slice.call(track.children);
    var pageCount = slides.length;
    var currentIndex = 0;
    var isAnimating = false;

    function updateSlideStates() {
      slides.forEach(function (slide, idx) {
        slide.classList.remove('is-center', 'is-side');
        if (idx === currentIndex) {
          slide.classList.add('is-center');
        } else {
          slide.classList.add('is-side');
        }
      });
      if (dots) {
        Array.prototype.forEach.call(dots.children, function (dot, idx) {
          dot.classList.toggle('is-active', idx === currentIndex);
        });
      }
    }

    function updateCarousel(animate) {
      var activeSlide = slides[currentIndex];
      var viewportWidth = viewport.offsetWidth;
      var slideWidth = activeSlide.offsetWidth;
      var gap = parseFloat(getComputedStyle(track).gap) || 0;
      var offset = (viewportWidth - slideWidth) / 2 - currentIndex * (slideWidth + gap);

      track.style.transition = animate ? 'transform 0.45s ease' : 'none';
      track.style.transform = 'translateX(' + offset + 'px)';
      updateSlideStates();
    }

    function goTo(index, animate) {
      currentIndex = (index + pageCount) % pageCount;
      updateCarousel(animate);
    }

    function goNext() {
      if (isAnimating) return;
      isAnimating = true;
      goTo(currentIndex + 1, true);
    }

    function goPrev() {
      if (isAnimating) return;
      isAnimating = true;
      goTo(currentIndex - 1, true);
    }

    track.addEventListener('transitionend', function () {
      isAnimating = false;
    });

    document.getElementById('hang-carousel-next').addEventListener('click', goNext);
    document.getElementById('hang-carousel-prev').addEventListener('click', goPrev);

    if (dots) {
      Array.prototype.forEach.call(dots.children, function (dot) {
        dot.addEventListener('click', function () {
          if (isAnimating) return;
          var target = parseInt(dot.getAttribute('data-index'), 10);
          if (target === currentIndex) return;
          isAnimating = true;
          goTo(target, true);
        });
      });
    }

    window.addEventListener('resize', function () {
      updateCarousel(false);
    });

    slides.forEach(function (slide) {
      var video = slide.querySelector('video');
      if (!video) return;
      video.addEventListener('loadedmetadata', function () {
        updateCarousel(false);
      });
    });

    updateCarousel(false);
    window.addEventListener('load', function () {
      updateCarousel(false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHangCarousel);
  } else {
    initHangCarousel();
  }
})();
