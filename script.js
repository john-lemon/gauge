


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
    radius: 180,
    divisionPoints: 5,
    divisionSep: 3
  };

  for (a in params) {values[a] = params[a];}
  console.log(values);


  var division = document.getElementById('division'),
      label = document.getElementsByClassName('dot')[0],
      radius = 180,
      labels = (values.divisionPoints-1)*values.divisionSep + values.divisionPoints;

  for (var i=0; i<labels; i++) {
    var clone = label.cloneNode(true),
        alpha = 240/labels,
        rad = alpha*i*Math.PI/180,
        cloneX = radius * ( 1 - Math.cos(rad) ),
        cloneY = radius * (1 - Math.sin(rad) );
    clone.style.left = cloneX+'px';
    clone.style.top = cloneY+'px';

    if (i % (values.divisionSep+1) === 0) {
      clone.className += ' special'
      var num = document.createTextNode(i/(values.divisionSep+1));
      clone.appendChild(num);
    }

    division.appendChild(clone);
  }
}

division({
  divisionPoints: 4,
  divisionSep: 2
})

