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
