// simple typewriter for hero title
const words = ['Web Developer', 'Full Stack Developer','AWS Cloud Engineer','DevOps Engineer'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const textElement = document.getElementById('text');

function typeEffect() {
  const current = words[wordIndex];
  if (isDeleting) {
    charIndex = Math.max(0, charIndex - 1);
  } else {
    charIndex = Math.min(current.length, charIndex + 1);
  }

  textElement.textContent = current.substring(0, charIndex);

  let speed = isDeleting ? 80 : 140;

  if (!isDeleting && charIndex === current.length) {
    speed = 1000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    speed = 800;
  }

  setTimeout(typeEffect, speed);
}

// start after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // ensure element exists before starting
  if (textElement) typeEffect();
});