const spotlightEl = document.querySelector("#spotlight");
let spotlightOn = true;


function turnSpotlight() {
	if (spotlightOn == false) {
		spotlightOn = true;
		document.getElementById("switch").src = "images/light-bulb-off.jpg"
		handleMouseMove
		
	}
	else if (spotlightOn == true) {
		spotlightOn = false;
		document.getElementById("switch").src = "images/light-bulb.jpg"
		spotlightEl.style.background = '';
		handleMouseMove
	}
}


function handleMouseMove(event) {
    const { clientX, clientY } = event;
    if (spotlightOn) {
		spotlightEl.style.background = `radial-gradient(circle at ${clientX}px ${clientY}px, #00000000 10px, #000000ee 350px)`;
	}
	if (spotlightOn == false) {
		spotlightEl.style.background = '';
	}
}

document.addEventListener("mousedown", handleMouseMove)
document.addEventListener("mousemove", handleMouseMove)// JavaScript Document



