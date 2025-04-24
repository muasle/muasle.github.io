// script.js

// Select DOM elements
const navbar = document.getElementById('navbar');
const toggleBtn = document.getElementById('toggle-btn');

// Toggle mobile navigation
toggleBtn.addEventListener('click', () => {
  navbar.classList.toggle('open');
});

// Smooth scroll to sections
const scrollBtns = document.querySelectorAll('.scroll-btn');

scrollBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    
    const el = e.target.getAttribute('href');
    document.querySelector(el).scrollIntoView({
      behavior: 'smooth' 
    });
  });
});

// Scroll reveal animations
const scrollReveal = ScrollReveal({
  origin: 'top',
  distance: '50px',
  duration: 1000
});

scrollReveal.reveal('.feature', { interval: 200 });

// Data from API
async function getData() {
  const response = await fetch('/Users/evandoster/Documents/NRI_Table_Counties2');
  const data = await response.json();

  // display data
}

getData();