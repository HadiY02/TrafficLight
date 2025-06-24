const redLight = document.getElementById('redlight');
const yellowLight = document.getElementById('yellowlight');
const greenLight = document.getElementById('greenlight');
const car = document.querySelector('.car'); 
const trafficLight = document.querySelector('.traffic-light');

let position = 0;


let stopline = 0;
window.onload = ()  => {
    const lightRect = trafficLight.getBoundingClientRect();
    const containerRect = trafficLight.parentElement.getBoundingClientRect();
    stopline = trafficLight.offsetLeft;
    redLight.style.opacity = 1;
    yellowLight.style.opacity = 0.3;
    greenLight.style.opacity = 0.3;
    redLight.classList.add('active');
    yellowLight.classList.remove('active');
    greenLight.classList.remove('active');
};

function animate() {
    const isgreen = greenLight.classList.contains('active');
    const carrect = car.getBoundingClientRect();
    const lightrect = trafficLight.getBoundingClientRect();
    const carbeforelight = carrect.right < lightrect.left;
    const screenwidth = window.innerWidth;

    if ((carbeforelight) || (isgreen)) {
        position += 5;
        car.style.left = position + 'px';

    }
    if (carrect.left > screenwidth) {
        setTimeout(() => {
            position = -car.offsetWidth;
            car.style.left = position + 'px';
        }, 2000);
    }
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
let yellowBlinkInterval = null;

redLight.onclick = function() {
    if (yellowBlinkInterval) {
        clearInterval(yellowBlinkInterval);
        yellowBlinkInterval = null;
    }
    redLight.style.opacity = 1;
    yellowLight.style.opacity = 0.3;
    greenLight.style.opacity = 0.3;
    redLight.classList.add('active');
    yellowLight.classList.remove('active');
    greenLight.classList.remove('active');
};

yellowLight.onclick = function() {
    if (yellowBlinkInterval) return; // Prevent multiple intervals
    redLight.style.opacity = 0.3;
    greenLight.style.opacity = 0.3;
    yellowLight.classList.add('active');
    redLight.classList.remove('active');
    greenLight.classList.remove('active');
    let isOn = false;
    yellowBlinkInterval = setInterval(() => {
        isOn = !isOn;
        yellowLight.style.opacity = isOn ? 1 : 0.3;
    }, 300);
};

greenLight.onclick = function() {
    if (yellowBlinkInterval) {
        clearInterval(yellowBlinkInterval);
        yellowBlinkInterval = null;
    }
    // If currently red, show red+yellow for 1s before green
    if (redLight.style.opacity == "1" && yellowLight.style.opacity != "1") {
        yellowLight.style.opacity = 1;
        setTimeout(() => {
            redLight.style.opacity = 0.3;
            yellowLight.style.opacity = 0.3;
            greenLight.style.opacity = 1;
            greenLight.classList.add('active');
            redLight.classList.remove('active');
            yellowLight.classList.remove('active');
        }, 1000);
    } else {
        redLight.style.opacity = 0.3;
        yellowLight.style.opacity = 0.3;
        greenLight.style.opacity = 1;
        greenLight.classList.add('active');
        redLight.classList.remove('active');
        yellowLight.classList.remove('active');
    }
};