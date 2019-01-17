var envelopeContainer = $('.envelopeContainer');
var evelopeFlap = $('.evelopeFlap');
var evelopeFlapShadow = $('.evelopeFlapShadow');
var paper = $('.paper')

envelopeContainer.on('mouseup', function(e) {
      envelopeContainer.removeClass("containerBeforeClick");

      evelopeFlap.on('mouseup', function(e) {
          evelopeFlap.addClass('evelopeFlapClick');
          evelopeFlapShadow.css("visibility", "hidden");
          paper.addClass('paperClick');
          evelopeFlap.css("z-index", "1");

     })
})
