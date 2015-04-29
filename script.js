


function polarToDecart(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function drawArc(x, y, radius, startAngle, endAngle){

    var start = polarToDecart(x, y, radius, endAngle),
        end = polarToDecart(x, y, radius, startAngle),
        arcSweep = endAngle - startAngle <= 180 ? "0" : "1",
        d = [
          "M", start.x, start.y,
          "A", radius, radius, 0, arcSweep, 0, end.x, end.y
        ].join(" ");

    return d;
}

document.getElementById("gauge_grey").setAttribute("d", drawArc(160, 160, 150, -120, 120));
document.getElementById("gauge_yellow").setAttribute("d", drawArc(160, 160, 150, 60, 90));
document.getElementById("gauge_red").setAttribute("d", drawArc(160, 160, 150, 90, 120));


function division(params) {

  var values = {
    tags: [0,1,2,3,4,5,6],
    radius: 180,
    divisionSep: 3
  };
  for (a in params) {values[a] = params[a];}


  var divisionPoints = values.tags.length,
      division = document.getElementById('division'),
      divisionSpecial = document.getElementById('division-special'),
      label = document.getElementsByClassName('dot')[0],

      radius = 160,

      labelsCounter = (divisionPoints-1)*values.divisionSep + divisionPoints;
      height = division.clientHeight,
      width = division.clientWidth,
      step = (4*Math.PI/3) / labelsCounter,
      angle = 210,
      k = 0,

      console.log(step);

  for (var i=0; i<labelsCounter; i++) {
    var clone = label.cloneNode(true);

    if (i % (values.divisionSep+1) === 0) {
      clone.className += ' special'
      var tag = document.createTextNode(values.tags[k]);
      k = k+1;
      // clone.style.transform = "rotate("+(angle*i)+"deg)";
      clone.appendChild(tag);
    }

    var cloneX = Math.round(width/2 + radius * Math.cos(angle) - clone.clientWidth/2);
        cloneY = Math.round(height/2 + radius * Math.sin(angle) - clone.clientHeight/2);
    clone.style.left = cloneX+'px';
    clone.style.top = cloneY+'px';

    division.appendChild(clone);
    angle += step;
  }
}

division({
  tags: [0,1,2,3, 4, 5, 6],
  divisionSep: 9
})

