let slideIndex = 1;
let slideTimer;

const container = document.getElementById('slideshow-container');

// Loop from 1 to 5
for (let i = 1; i <= 13; i++) {
    // Create the image element
    const img = document.createElement('img');
    
    // Set the attributes (this builds: ../images/photo1.jpg, photo2.jpg, etc.)
    img.src = `../images/slideshow/photo${i}.jpg`;
    img.className = "mySlides fade";
    
    // Hide all images except the first one
    if (i > 1) {
        img.style.display = "none";
    }
    
    // Add it to the container
    container.appendChild(img);
}

showSlides(slideIndex);
startTimer();

// Next/previous controls
function plusSlides(n) {
    clearInterval(slideTimer); // Stop the auto-slide when user clicks
    showSlides(slideIndex += n);
    startTimer(); // Restart the auto-slide timer
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slides[slideIndex-1].style.display = "block";  
}

function startTimer() {
    slideTimer = setInterval(() => {
        plusSlides(1);
    }, 10000); // Change image every 4 seconds
}