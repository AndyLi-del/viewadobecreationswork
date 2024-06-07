const spotlightEl = document.querySelector("#spotlight");
let spotlightOn = true;


function turnSpotlight() {
	if (spotlightOn == false) {
		spotlightOn = true;
		
		
	}
	if (spotlightOn == true) {
		spotlightOn = false;
		document.getElementById("switch").src = "images/light-bulb.jpg"
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

var canvas1 = document.getElementById("canvas-left")
canvas1.height = document.getElementById("canvas-left").height
canvas1.width = document.getElementById("canvas-left").width
var c1 = canvas1.getContext("2d")



function Ball(x, y, dx, dy) {
	this.x = x
	this.y = y
	this.dx = dx
	this.dy = dy
	
	this.draw = function() {
		c1.arc(this.x, this.y, 20, 0, 2 * Math.PI)
		c1.stroke()
		console.log('draw')
	}
	this.update = function() {
		this.x += this.dx
		this.y += this.dy
		this.draw()
	}
}

var ballArray = [];
var ball = new Ball(1, 1, 0, 0)

function animate() {
	requestAnimationFrame(animate)
	c1.clearRect(0, 0, innerWidth, innerHeight);
	ball.update()
	

}
animate()




