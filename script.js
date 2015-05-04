


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
    radius: 160,
    divisionSep: 3
  };
  for (a in params) {values[a] = params[a];}

  var divisionPoints = values.tags.length,
      division = document.getElementById('division'),
      divisionSpecial = document.getElementById('division-special'),
      label = document.getElementsByClassName('dot')[0],

      radius = values.radius,

      labelsCounter = (divisionPoints-1)*values.divisionSep + divisionPoints;

      height = division.clientHeight,
      width = division.clientWidth,
      angle = 210,
      step = (4*Math.PI/3) / labelsCounter, // 4/3 - for 240 gauge
      k = 0;


  for (var i=0; i<labelsCounter; i++) {
    var clone = label.cloneNode(true);
    var special = false;

    if (i % (values.divisionSep+1) === 0) {
      clone.className += ' special-dot'
      var tag = document.createElement('span');
      tag.className = 'value';
      var tagText = document.createTextNode(values.tags[k])
      tag.appendChild(tagText);

      k = k+1;
      clone.appendChild(tag);

      special = true;
    }

    division.appendChild(clone);


    var cloneX = width/2 + radius * Math.cos(angle);
        cloneY = height/2 + radius * Math.sin(angle);

    var pad = 20;

    if (special == true) {
      rotateAngle = Math.atan( Math.abs(radius + 20 - cloneY)/Math.abs(radius + 20 - cloneX)) *57.3
      console.log(k)
      console.log(rotateAngle);
      console.log('=======')

      if (cloneX < radius+20) {
        if (cloneY < radius +20 ) {
          rotateAngle = 180+rotateAngle
        } else {
          rotateAngle = 180-rotateAngle
        }
      }
      else {
        if (cloneY < radius +20 ) {
          rotateAngle = -rotateAngle
        }
      }
      clone.style.transform = "rotate("+rotateAngle+"deg)";
      tag.style.transform = "rotate("+ -rotateAngle +"deg)";
      tag.style.top = -tag.offsetHeight/2+'px';
    }


    clone.style.left = cloneX+'px';
    clone.style.top = (cloneY - clone.offsetHeight/2 )+'px';
    angle += step;

  }

  specialLabels = document.getElementsByClassName('special-dot');


}

division({
  tags: ['0', '1', '2', '3', '4', '5', '6','7','8','9'],
  divisionSep: 9
})

