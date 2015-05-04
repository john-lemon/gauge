

division = new division({
  tags: ['0', '1', '2', '3', '4', '5', '6','7','8','9'],
  divisionSep: 9
})

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
      arcSweep = endAngle - startAngle <= 180 ? '0' : '1',
      d = [
        'M', start.x, start.y,
        'A', radius, radius, 0, arcSweep, 0, end.x, end.y
      ].join(' ');
  return d;
}


function drawArrow(radius, arrowWidth) {
  var points = [
        -20,radius,radius,radius-arrowWidth/2,radius,radius+arrowWidth/2
      ].join(',');
  return points;
}

function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

function division(params) {

  var gaugeWrap = document.getElementById('gauge_wrap'),
      gaugeArrow = document.createElementNS("http://www.w3.org/2000/svg", 'svg'),
      gaugePolygon = document.createElementNS("http://www.w3.org/2000/svg", 'polygon'),
      division = document.createElement('div'),
      dot = document.createElement('span'),
      gauge = document.createElementNS("http://www.w3.org/2000/svg", 'svg'),
      gaugeCenter = document.createElementNS("http://www.w3.org/2000/svg", 'circle'),
      gaugeGrey = document.createElementNS("http://www.w3.org/2000/svg", 'path'),
      gaugeRed = document.createElementNS("http://www.w3.org/2000/svg", 'path'),
      gaugeYellow = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  setAttributes(gaugeArrow, {'x':'0', 'y':'0', 'id':'gauge__arrow'});
  gaugePolygon.setAttribute('id','gauge__polygon');
  division.setAttribute('id','division');
  dot.setAttribute('class','dot');
  setAttributes(gauge, {'id':'gauge', 'x':'0px','y':'0px'});
  setAttributes(gaugeCenter, {'id':'gauge__center', 'r':'7'});
  setAttributes(gaugeGrey, {'id':'gauge__grey', 'stroke-width':'3'})
  setAttributes(gaugeYellow, {'id':'gauge__yellow', 'stroke-width':'3'})
  setAttributes(gaugeRed, {'id':'gauge__red', 'stroke-width':'3'});
  gaugeWrap.appendChild(gaugeArrow);
  gaugeWrap.appendChild(division);
  gaugeWrap.appendChild(gauge);
  gaugeArrow.appendChild(gaugePolygon);
  division.appendChild(dot);
  gauge.appendChild(gaugeCenter);
  gauge.appendChild(gaugeGrey);
  gauge.appendChild(gaugeYellow);
  gauge.appendChild(gaugeRed);

  this.values = {
    tags: [0,1,2,3,4,5,6],
    radius: 160,
    divisionSep: 3,
    arrowWidth: 8,
  };
  for (a in params) {this.values[a] = params[a];}

      radius = this.values.radius,
      divisionPoints = this.values.tags.length,
      labelsCounter = (divisionPoints-1)*this.values.divisionSep + divisionPoints;
      angle = 210,
      step = (4*Math.PI/3) / labelsCounter, // 4/3 - for 240 gauge
      k = 0;

  division.style.width = radius*2 +40 + 'px';
  division.style.height = radius*2 +40 + 'px';
  gauge.style.width = radius*2 +40 + 'px';
  gauge.style.height = radius*2 +40 + 'px';
  gaugeArrow.style.width = radius*2  + 'px';
  gaugeArrow.style.height = radius*2  + 'px';

  gaugeCenter.setAttribute('cx',radius);
  gaugeCenter.setAttribute('cy',radius);

  document.getElementById('gauge__grey').setAttribute('d', drawArc(radius, radius, radius-10, -120, 120));
  document.getElementById('gauge__yellow').setAttribute('d', drawArc(radius, radius, radius-10, 60, 90));
  document.getElementById('gauge__red').setAttribute('d', drawArc(radius, radius, radius-10, 90, 120));
  document.getElementById('gauge__polygon').setAttribute('points', drawArrow(radius, this.values.arrowWidth));

  var height = division.clientHeight,
      width = division.clientWidth;

  var rotateAngles = [];

  for (var i=0; i<labelsCounter; i++) {
    var clone = dot.cloneNode(true);
    var special = false;

    if (i % (this.values.divisionSep+1) === 0) {
      clone.className += ' special-dot'
      var tag = document.createElement('span');
      tag.className = 'value';
      var tagText = document.createTextNode(this.values.tags[k])
      tag.appendChild(tagText);
      k = k+1;
      clone.appendChild(tag);
      special = true;
    }

    division.appendChild(clone);


    var cloneX = width/2 + radius * Math.cos(angle),
        cloneY = height/2 + radius * Math.sin(angle);
    var pad = 20;

    if (special == true) {
      rotateAngle = Math.atan( Math.abs(radius + 20 - cloneY)/Math.abs(radius + 20 - cloneX)) *57.3;
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

      rotateAngles.push(rotateAngle);
      clone.style.transform = 'rotate('+rotateAngle+'deg)';
      tag.style.transform = 'rotate('+ -rotateAngle +'deg)';
      tag.style.top = -tag.offsetHeight/2+'px';
    }
    clone.style.left = cloneX+'px';
    clone.style.top = (cloneY - clone.offsetHeight/2 )+'px';
    angle += step;
  }

  this.setValue = function(type, value) {
    var entry = (this.values.tags.indexOf(value) != -1)
    if (type == 'string') {
      if (entry == true) {
        var i = this.values.tags.indexOf(value),
        gaugeArrow.style.transform = 'rotate('+(180+rotateAngles[i])+'deg)';
      }
      else if (value >=0 && value <= 360) {
        value = Number(value);
        gaugeArrow.style.transform = 'rotate('+ value+'deg)';
      }
    }
    else if (type == 'deg') {
      gaugeArrow.style.transform = 'rotate('+ value+'deg)';
    }
    else {
      console.log('Value type error')
    }
  }

}

division.setValue('deg','0');


