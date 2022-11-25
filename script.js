const canvas = document.querySelector("canvas");
let toolBtns = document.querySelectorAll(".tool");
let fillColor = document.querySelector("#fill-color");
let sizeSlider = document.querySelector("#size-slider");
let colorBtns = document.querySelectorAll(".colors .option");
let colorPicker = document.querySelector("#color-picker")
let clearCanvas = document.querySelector(".clear-canvas");
let saveImg = document.querySelector(".save-image");
ctx = canvas.getContext("2d");

let isDrawing  = false;
let brushWidth = 5;
let selectedTool = "brush";
let selectedColor = "#000";
let prevMouseX , prevMouseY , snapShot;
const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0 , 0 , canvas.width , canvas.height);
    ctx.fillStyle = selectedColor;
}
window.addEventListener("load" , () => {
    // offsetwidth returns viewable width of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
})
const drawReactangle = (e) => {
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX , e.offsetY , prevMouseX - e.offsetX , prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX , e.offsetY , prevMouseX - e.offsetX , prevMouseY - e.offsetY);
};
const drawCircle = (e) => {
    ctx.beginPath(); // creating new Path to draw circle
    let radius = Math.sqrt(Math.pow(prevMouseX - e.offsetX , 2) + Math.pow(prevMouseY - e.offsetY , 2));
    ctx.arc(prevMouseX , prevMouseY , radius, 0 , 2*Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}
const drawTriangle = (e) => {
    ctx.beginPath(); // creating new Path to draw circle
    ctx.moveTo(prevMouseX , prevMouseY); // move triangle to the mouse pointer
    ctx.lineTo(e.offsetX , e.offsetY);
    ctx.lineTo(prevMouseX*2 - e.offsetX , e.offsetY); // creating bottom line
    ctx.closePath(); // closing triangle
    (fillColor.checked) ? ctx.fill() : ctx.stroke();
}
const drawing = (e) => {
    if(!isDrawing)
        return;
    ctx.putImageData(snapShot , 0 , 0);// Adding copied canvas data in this canvas
    if(selectedTool === "brush" || selectedTool === "eraser"){
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX , e.offsetY); // Creating line according to mouse pointer
    ctx.stroke(); // Filling 
    }
    else if(selectedTool == "rectangle"){
        drawReactangle(e);
    }
    else if(selectedTool == "circle"){
        drawCircle(e);
    }
    else if(selectedTool == "triangle")
    {
        drawTriangle(e);
    }
}
toolBtns.forEach((btn) => {
    btn.addEventListener("click" , () => {
        // Removing active class from previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        // console.log(selectedTool);
    });
});
canvas.addEventListener("mousedown" , (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // Storing current mouse position
    prevMouseY = e.offsetY;
    ctx.beginPath(); // Creating new Path to Draw
    ctx.lineWidth = brushWidth // Passing brushsize as linewidth
    // copying canvas data and passing as snapshot value
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapShot = ctx.getImageData(0 , 0 ,canvas.width , canvas.height);
});
canvas.addEventListener("mousemove" , drawing);
canvas.addEventListener("mouseup" , () => isDrawing = false);
sizeSlider.addEventListener("change" , () => brushWidth = sizeSlider.value);
colorBtns.forEach(btn => {
    btn.addEventListener("click" , () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});
colorPicker.addEventListener("change" , () => {
    // Passing the picked value to last btn
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});
clearCanvas.addEventListener("click" , () => {
    ctx.clearRect(0 , 0 , canvas.width , canvas.height); // clearing whole canvas
    setCanvasBackground();
});
saveImg.addEventListener("click" , () => {
    const link = document.createElement("a"); // creating <a> element
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to download image

});