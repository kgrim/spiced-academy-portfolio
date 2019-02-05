const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
c.strokeStyle = "slategray";
var x;
var y;
var move;
var hidden = document.getElementById("sig");

canvas.addEventListener("mousedown", function(e) {
    e.stopPropagation();
    x = e.offsetX;
    y = e.offsetY;
    canvas.addEventListener(
        "mousemove",
        (move = function(e) {
            c.moveTo(x, y);
            x = e.offsetX;
            y = e.offsetY;
            c.lineTo(x, y);
            c.stroke();
        })
    );
});

document.addEventListener("mouseup", function() {
    canvas.removeEventListener("mousemove", move);
    sig.value = canvas.toDataURL();
    console.log("sig.val: ", hidden.value);
});
