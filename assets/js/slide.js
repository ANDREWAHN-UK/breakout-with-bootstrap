
let slidePosition = 0;  //sets the start position of the slides
const slides = document.getElementsByClassName('carousel-item');  //defines slides as containing the carousel-item class
const totalSlides = slides.length;  //defines total slides as being the length of const slides

//when the next button is clicked, calls the function moveToNextSlide
document.getElementById('carousel-btn-next').addEventListener('click', function(){
    moveToNextSlide();
});

//when the next button is clicked, calls the function moveToPrevSlide
document.getElementById('carousel-btn-prev').addEventListener('click', function(){
    moveToPrevSlide();
});

//increments the slide position
function moveToNextSlide() {
    if (slidePosition === totalSlides -1)        
     {slidePosition = 0;
    } else{
        slidePosition++; 
    }
    updateSlidePosition();
}

//decrements the slide position
function moveToPrevSlide() {
    if (slidePosition === 0) 
     {slidePosition = 0;
    } else{
        slidePosition--; 
    }
    updateSlidePosition();
}

function updateSlidePosition(){
    for(let slide of slides) {
        slide.classList.remove('carousel-item-visible');
        slide.classList.add('carousel-item-hidden');
    }

    slides[slidePosition].classList.add('carousel-item-visible');
}