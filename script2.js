// JavaScript Document
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]")

window.addEventListener("mousemove", function (e){
	const posX = e.clientX;
	const posY = e.clientY;
	cursorDot.style.left = parseInt(posX) + "px";
	cursorDot.style.top = parseInt(posY) + "px";
	cursorOutline.animate({
		left: parseInt(posX) + "px",
		top: parseInt(posY) + "px"
	}, {duration:500, fill:"forwards"});
})

window.addEventListener("mousedown", function (){
	cursorOutline.animate({
		width: "50px" ,
		height: "50px"
	}, {duration:150, fill:"forwards"})
})
window.addEventListener("mouseup", function (){
	cursorOutline.animate({
		width: "22px" ,
		height: "22px"
	}, {duration:150, fill:"forwards"})
})

const track = document.getElementById("image-track");

window.onmousedown = e => {
	track.dataset.mouseDownAt = e.clientX;
	
}
window.onmouseup = e => {
	track.dataset.mouseDownAt = "0";
	track.dataset.prevPercentage = track.dataset.percentage;
}
window.onmousemove = e => {
	if (track.dataset.mouseDownAt === "0") return;
	
	const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
		  maxDelta = window.innerWidth / 2;
	
	const percentage = (mouseDelta / maxDelta) * -100,
		  nextPercentage = parseFloat(track.dataset.prevPercentage) + percentage;
			

	track.dataset.percentage = nextPercentage;
	
	for (const video of track.getElementsByClassName("image")) {
		
		video.animate({
			objectPosition: `${nextPercentage + 100}% center`
		}, {duration: 1200, fill: "forwards"});
	}
	
	track.animate({
		transform: `translate(${nextPercentage}%, -50%)`
	}, { duration:1200, fill:"forwards"});
}
