const close = $(".close");

close.on("click", function(e) {
    e.stopPropagation();
    $(".error").css({
        display: "none",
        visibility: "hidden"
    });
});
