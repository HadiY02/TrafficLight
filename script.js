const redLight = document.getElementById('redlight');
const yellowLight = document.getElementById('yellowlight');
const greenLight = document.getElementById('greenlight');
const car = document.querySelector('.car'); 
const trafficLight = document.querySelector('.traffic-light');
const pedestrianIcon = document.getElementById('pedestrian-icon');
const walkIcon = document.getElementById('walk-icon');
const dontWalkIcon = document.getElementById('dont-walk-icon');

function updatePedestrianLight() {
    if (greenLight.classList.contains('active')) {
        walkIcon.style.display = 'none';
        dontWalkIcon.style.display = 'block';
    } else if (redLight.classList.contains('active')) {
        walkIcon.style.display = 'block';
        dontWalkIcon.style.display = 'none';
    } else {
        walkIcon.style.display = 'none';
        dontWalkIcon.style.display = 'none';
    }
}
let position = 0;
let yellowPauseDone = false;
let yellowPauseStartTime = 0;
let resetStartTime = 0;
let isResetting = false;
window.onload = ()  => {
    const containerRect = trafficLight.parentElement.getBoundingClientRect();
    redLight.style.opacity = 1;
    yellowLight.style.opacity = 0.3;
    greenLight.style.opacity = 0.3;
    redLight.classList.add('active');
    yellowLight.classList.remove('active');
    greenLight.classList.remove('active');
    fetch('http://172.20.10.3/redon');
    fetch('http://172.20.10.3/yellowoff');
    fetch('http://172.20.10.3/greenoff');
};
function animate() {
    const isgreen = greenLight.classList.contains('active');
    const carrect = car.getBoundingClientRect();
    const lightrect = trafficLight.getBoundingClientRect();
    const carbeforelight = carrect.right < lightrect.left;
    const screenwidth = window.innerWidth;

    let isyellowblinking = yellowBlinkInterval !== null;
    if (isyellowblinking && !yellowPauseDone && !carbeforelight) {
        if (yellowPauseStartTime === 0) {
            yellowPauseStartTime = Date.now();
        }
        if (Date.now() - yellowPauseStartTime >= 1000) {
            yellowPauseDone = true;
        } else {
            requestAnimationFrame(animate);
            return;
        }
    }

    if (carbeforelight) {
        position += 5;
        car.style.left = position + 'px';
    } else if (isgreen) {
        position += 5;
        car.style.left = position + 'px';
    } else if (isyellowblinking && yellowPauseDone) {
        position += 5;
        car.style.left = position + 'px';
    }

    if (carrect.left > screenwidth && !isResetting) {
        isResetting = true;
        resetStartTime = Date.now();
    }

    if (isResetting) {
        if (Date.now() - resetStartTime >= 2000) {
            position = -car.offsetWidth;
            car.style.left = position + 'px';
            yellowPauseDone = false;
            yellowPauseStartTime = 0;
            isResetting = false;
            requestAnimationFrame(animate);
            return;
        } else {
            requestAnimationFrame(animate);
            return;
        }
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
    yellowPauseDone = false;
    yellowPauseStartTime = 0;
    redLight.style.opacity = 1;
    yellowLight.style.opacity = 0.3;
    greenLight.style.opacity = 0.3;
    redLight.classList.add('active');
    yellowLight.classList.remove('active');
    greenLight.classList.remove('active');
    fetch('http://172.20.10.3/greenoff');
    fetch('http://172.20.10.3/yellowoff');
    fetch('http://172.20.10.3/redon');
    updatePedestrianLight();
};

yellowLight.onclick = function() {
    if (yellowBlinkInterval) return;
    walkIcon.style.display = 'none';
    dontWalkIcon.style.display = 'none';
    redLight.style.opacity = 0.3;
    greenLight.style.opacity = 0.3;
    redLight.classList.remove('active');
    greenLight.classList.remove('active');
    yellowLight.style.setProperty('opacity', '1', 'important');
    yellowLight.classList.add('active');
    fetch('http://172.20.10.3/yellowon');
    let isOn = false;
    yellowBlinkInterval = setInterval(() => {
        walkIcon.style.display = 'none';
        dontWalkIcon.style.display = 'none';
        isOn = !isOn;
        yellowLight.style.setProperty('opacity', isOn ? '1' : '0.3', 'important');
        if (isOn) {
            yellowLight.classList.add('active');
        } else {
            yellowLight.classList.remove('active');
        }
        fetch(`http://172.20.10.3/yellow${isOn ? 'on' : 'off'}`);
    }, 300);
    fetch('http://172.20.10.3/redoff');
    fetch('http://172.20.10.3/greenoff');
};

greenLight.onclick = function() {
    if (yellowBlinkInterval) {
        clearInterval(yellowBlinkInterval); yellowBlinkInterval = null;
    }
    updatePedestrianLight();
    
    if (redLight.style.opacity == "1" && yellowLight.style.opacity != "1") {
        yellowLight.style.opacity = 1;
        fetch('http://172.20.10.3/redon');
        fetch('http://172.20.10.3/yellowon');

        walkIcon.style.display = 'none';
        dontWalkIcon.style.display = 'block';

        setTimeout(() => {
            redLight.style.opacity = 0.3;
            yellowLight.style.opacity = 0.3;
            greenLight.style.opacity = 1;
            greenLight.classList.add('active');
            redLight.classList.remove('active');
            yellowLight.classList.remove('active');
            fetch('http://172.20.10.3/redoff');
            fetch('http://172.20.10.3/yellowoff');
            fetch('http://172.20.10.3/greenon');
            updatePedestrianLight();
        }, 1000);
    } else {
        redLight.style.opacity = 0.3;
        yellowLight.style.opacity = 0.3;
        greenLight.style.opacity = 1;
        greenLight.classList.add('active');
        redLight.classList.remove('active');
        yellowLight.classList.remove('active');
        fetch('http://172.20.10.3/redoff');
        fetch('http://172.20.10.3/yellowoff');
        fetch('http://172.20.10.3/greenon');
        updatePedestrianLight();
    }
};