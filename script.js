function locoAnim() {
  if (window.innerWidth > 768) {
    gsap.registerPlugin(ScrollTrigger);

    // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

    const locoScroll = new LocomotiveScroll({
      el: document.querySelector("#main"),
      smooth: true,
    });
    // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
    locoScroll.on("scroll", ScrollTrigger.update);

    // tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
    ScrollTrigger.scrollerProxy("#main", {
      scrollTop(value) {
        return arguments.length
          ? locoScroll.scrollTo(value, 0, 0)
          : locoScroll.scroll.instance.scroll.y;
      }, // we don't have to define a scrollLeft because we're only scrolling vertically.
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
      pinType: document.querySelector("#main").style.transform
        ? "transform"
        : "fixed",
    });

    // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

    // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
    ScrollTrigger.refresh();
  }
}

function loading() {
  var tl = gsap.timeline();
  tl.from(".line h1", {
    y: 150,
    stagger: 0.25,
    delay: 0.5,
    duration: 0.6,
  });
  tl.from("#l1-part1, .line2", {
    opacity: 0,
    onStart: function () {
      var h5timer = document.querySelector("#l1-part1 h5");
      var grow = 0;

      setInterval(function () {
        if (grow < 100) {
          h5timer.innerHTML = grow++;
        } else {
          h5timer.innerHTML = grow;
        }
      }, 33);
    },
  });
  tl.to(".line h2", {
    opacity: 1,
    animationName: "anim",
  });
  tl.to("#loader", {
    opacity: 0,
    delay: 3.7,
    // delay: 0,
    duration: 0.2,
  });
  tl.from("#page1", {
    y: 1200,
    delay: 0.2,
    opacity: 0,
    duration: 0.5,
  });
  tl.to("#loader", {
    display: "none",
  });
  tl.from("#nav", {
    opacity: 0,
    duration: 0.5,
    y: -100,
  });
  tl.from(".hero1", {
    opacity: 0,
  });
  tl.from("#hero1 h1,#hero3 h2,#hero3 h3", {
    y: 150,
    // delay:1,
    stagger: 0.25,
    duration: 0.6,
  });
}

function cursrAnimation() {
  document.addEventListener("mousemove", function (dets) {
    gsap.to("#crsr", {
      left: dets.x,
      top: dets.y,
    });
  });

  var h4s = document.querySelectorAll("#part22 h4");

  h4s.forEach(function (h4) {
    h4.addEventListener("mousemove", function () {
      gsap.to("#crsr", {
        scale: 2,
      });
    });
    h4.addEventListener("mouseleave", function () {
      gsap.to("#crsr", {
        scale: 1,
      });
    });
  });

  var hoverMouse = function (el) {
    el.forEach(function (self) {
      var hover = false;
      var offsetHoverMax = self.getAttribute("offset-hover-max") || 0.7;
      var offsetHoverMin = self.getAttribute("offset-hover-min") || 0.5;

      var attachEventsListener = function () {
        window.addEventListener("mousemove", function (e) {
          var hoverArea = hover ? offsetHoverMax : offsetHoverMin;

          // cursor
          var cursor = {
            x: e.clientX,
            y: e.clientY + window.scrollY,
          };

          // size
          var width = self.offsetWidth;
          var height = self.offsetHeight;

          // position
          var offset = self.getBoundingClientRect();
          var elPos = {
            x: offset.left + width / 2,
            y: offset.top + height / 2 + window.scrollY,
          };

          // distance calculation
          var x = cursor.x - elPos.x;
          var y = cursor.y - elPos.y;

          var dist = Math.sqrt(x * x + y * y);

          // hover mutex
          var mutHover = false;

          // animation trigger
          if (dist < width * hoverArea) {
            mutHover = true;
            if (!hover) {
              hover = true;
            }
            onHover(x, y);
          }

          // reset
          if (!mutHover && hover) {
            onLeave();
            hover = false;
          }
        });
      };

      var onHover = function (x, y) {
        gsap.to(self, {
          x: x * 0.8,
          y: y * 0.8,
          rotation: x * 0.05,
          duration: 0.4,
          ease: "power2.out",
        });
      };

      var onLeave = function () {
        gsap.to(self, {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.7,
          ease: "elastic.out(1.2, 0.4)",
        });
      };

      attachEventsListener();
    });
  };

  // Select elements and apply hover effect
  hoverMouse(document.querySelectorAll("#part22 h4"));

  var videoCon = document.querySelector("#video-con");
  videoCon.addEventListener("mouseenter", function () {
    videoCon.addEventListener("mousemove", function (dets) {
      gsap.to("#crsr", {
        opacity: 0,
      });
      gsap.to("#vc", {
        left: dets.x - 500,
        top: dets.y - 250,
      });
    });
  });

  videoCon.addEventListener("mouseleave", function () {
    gsap.to("#crsr", {
      opacity: 1,
    });
    gsap.to("#vc", {
      top: "-10%",
      left: "80%",
    });
  });

  var flag = 0;
  var video = document.querySelector("#video-con video");
  videoCon.addEventListener("click", function () {
    if (flag === 0) {
      video.play();
      video.style.opacity = 1;
      document.querySelector("#vc").innerHTML = '<i class="ri-pause-fill"></i>';
      gsap.to("#vc", {
        scale: 0.5,
      });
      flag = 1;
    } else {
      video.pause();
      video.style.opacity = 0;
      document.querySelector("#vc").innerHTML =
        '<i class="ri-play-large-fill"></i>';
      gsap.to("#vc", {
        scale: 1,
      });
      flag = 0;
    }
  });
}

function sheryAnimation() {
  Shery.imageEffect(".image-div", {
    style: 5,
    gooey: true,
    config: {
      a: { value: 1.83, range: [0, 30] },
      b: { value: 0.07, range: [-1, 1] },
      zindex: { value: -9996999, range: [-9999999, 9999999] },
      aspect: { value: 0.7241195864976497 },
      ignoreShapeAspect: { value: true },
      shapePosition: { value: { x: 0, y: 0 } },
      shapeScale: { value: { x: 0.5, y: 0.5 } },
      shapeEdgeSoftness: { value: 0, range: [0, 0.5] },
      shapeRadius: { value: 0, range: [0, 2] },
      currentScroll: { value: 0 },
      scrollLerp: { value: 0.07 },
      gooey: { value: true },
      infiniteGooey: { value: false },
      growSize: { value: 4, range: [1, 15] },
      durationOut: { value: 1, range: [0.1, 5] },
      durationIn: { value: 1.5, range: [0.1, 5] },
      displaceAmount: { value: 0.5 },
      masker: { value: true },
      maskVal: { value: 1.24, range: [1, 5] },
      scrollType: { value: 0 },
      geoVertex: { range: [1, 64], value: 1 },
      noEffectGooey: { value: true },
      onMouse: { value: 1 },
      noise_speed: { value: 0.2, range: [0, 10] },
      metaball: { value: 0.5, range: [0, 2] },
      discard_threshold: { value: 0.5, range: [0, 1] },
      antialias_threshold: { value: 0, range: [0, 0.1] },
      noise_height: { value: 0.49, range: [0, 2] },
      noise_scale: { value: 13.74, range: [0, 100] },
    },
  });
}

locoAnim();
loading();
cursrAnimation();
sheryAnimation();

document.addEventListener("mousemove", function (dets) {
  gsap.to("#flag", {
    left: dets.x,
    top: dets.y,
  });
});

document.querySelector("#hero3").addEventListener("mouseenter", function () {
  gsap.to("#flag", {
    opacity: 1,
  });
});
document.querySelector("#hero3").addEventListener("mouseleave", function () {
  gsap.to("#flag", {
    opacity: 0,
  });
});

// footer animation

var clutter = "";
var clutter2 = "";
document
  .querySelector("#footer h1")
  .textContent.split("")
  .forEach(function (elem) {
    clutter += `<span>${elem}</span>`;
  });
document.querySelector("#footer h1").innerHTML = clutter;
document
  .querySelector("#footer h2")
  .textContent.split("")
  .forEach(function (elem) {
    clutter2 += `<span>${elem}</span>`;
  });
document.querySelector("#footer h2").innerHTML = clutter2;

document
  .querySelector("#footer-text")
  .addEventListener("mouseenter", function () {
    gsap.to("#footer h1 span", {
      opacity: 0,
      stagger: 0.05,
    });
    gsap.to("#footer h2 span", {
      delay: 0.35,
      opacity: 1,
      stagger: 0.1,
    });
  });
document
  .querySelector("#footer-text")
  .addEventListener("mouseleave", function () {
    gsap.to("#footer h1 span", {
      opacity: 1,
      stagger: 0.1,
      delay: 0.35,
    });
    gsap.to("#footer h2 span", {
      opacity: 0,
      stagger: 0.05,
    });
  });
