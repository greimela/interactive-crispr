var values = [
  { value: 0, type: 'insert', onCircle: false, length: 20, x: 100, y: 260, isEditable: true, content: '' },
  { value: 0, type: 'left-border', onCircle: false, length: 10, x: 50, y: 390, isEditable: false },
  { value: 0, type: 'right-border', onCircle: false, length: 10, x: 150, y: 390, isEditable: false },
  { value: 0, type: 'virulenzgen', onCircle: false, length: 20, x: 100, y: 480, isEditable: true, content: '' },
];

var height = 500,
  width = 960,
  margin = { top: 20, left: 20, bottom: 20, right: 20 },
  radius = 200,
  componentBoxWidth = 200;

var error;

var ringLeft = width - 2 * radius - componentBoxWidth;
var ringRight = ringLeft + 2 * radius;

let currentlyEditedHandle;

const parent = d3
  .select('.svg-container')
  .append('svg')
  .attr({
    height: height,
    width: width,
  })
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

const components = parent.append('g').attr('id', 'components');

const ring = parent
  .append('g')
  .attr('id', 'ring')
  .attr('transform', 'translate(' + (radius + ringLeft) + ',' + radius + ')');
ring.append('circle').attr({
  r: radius,
  class: 'ring',
});

const handles = parent.append('g').attr('id', 'handles');

const drag = d3.behavior
  .drag()
  .origin(function(d) {
    return d;
  })
  .on('drag', dragmove)
  .on('dragend', function() {
    d3.select(this).classed('active', false);
  });

function drawTDnaRange() {
  ring.select('path').remove();

  const leftBorder = values.find(value => value.type === 'left-border');
  const rightBorder = values.find(value => value.type === 'right-border');

  if (leftBorder && rightBorder && leftBorder.onCircle && rightBorder.onCircle) {
    console.log('leftBorder', leftBorder.value - 360);
    console.log('rightBorder', rightBorder.value);
    let degrees;
    if (leftBorder.value > rightBorder.value) {
      degrees = rightBorder.value - (leftBorder.value - 360);
    } else {
      degrees = rightBorder.value - leftBorder.value;
    }
    const angle = (degrees * Math.PI) / 180;
    const arc = d3.svg
      .arc()
      .innerRadius(radius - 20)
      .outerRadius(radius - 15)
      .startAngle(0)
      .endAngle(angle);
    ring.append('path').attr({ d: arc, transform: `rotate(${leftBorder.value + 90})` });
  }
}

function drawComponents() {
  components.append('rect').attr({
    x: 0,
    y: 0,
    width: componentBoxWidth,
    height: height - margin.top - margin.bottom,
    fill: 'white',
    stroke: 'black',
  });

  components.append('rect').attr({
    x: 10,
    y: 10,
    width: componentBoxWidth - 20,
    height: 100,
    fill: 'white',
    stroke: 'black',
  });
  components
    .append('text')
    .text('Insert')
    .attr({ x: 100, y: 30, fill: 'black' })
    .style('text-anchor', 'middle');

  components.append('rect').attr({
    x: 10,
    y: 120,
    width: componentBoxWidth - 20,
    height: 100,
    fill: 'white',
    stroke: 'black',
  });
  components
    .append('text')
    .text('Grenzen')
    .attr({ x: 100, y: 140, fill: 'black' })
    .style('text-anchor', 'middle');
  components
    .append('text')
    .text('Links')
    .attr({ x: 50, y: 170, fill: 'black' })
    .style('text-anchor', 'middle');
  components
    .append('text')
    .text('Rechts')
    .attr({ x: 150, y: 170, fill: 'black' })
    .style('text-anchor', 'middle');

  components.append('rect').attr({
    x: 10,
    y: 230,
    width: componentBoxWidth - 20,
    height: 100,
    fill: 'white',
    stroke: 'black',
  });
  components
    .append('text')
    .text('Virulenzgen')
    .attr({ x: 100, y: 250, fill: 'black' })
    .style('text-anchor', 'middle');
}

//position the handles based on the input values
function drawHandles() {
  const arc = d3.svg
    .arc()
    .innerRadius(radius - 7.5)
    .outerRadius(radius + 7.5);
  const join = handles.selectAll('path').data(values);
  join
    .enter()
    .append('path')
    .attr({
      d: function(d) {
        const length = ((d.length / 2) * Math.PI) / 180;
        return arc({ startAngle: -length, endAngle: length });
      },
      class: function(d) {
        return `handle ${d.type}`;
      },
      'data-toggle': 'tooltip',
      'data-placement': 'bottom',
      title: function(d) {
        return d.content;
      },
    })
    .on('mouseover', function() {
      d3.select(this).classed('active', true);
    })
    .on('mouseout', function() {
      d3.select(this).classed('active', false);
    })
    .on('dblclick', function(d) {
      if (d.isEditable) {
        $('#inputModal').modal();
        $('#sequenceInput').val(d.content);
        currentlyEditedHandle = d;
      }
    })
    .call(drag);

  join.attr({
    transform: function(d) {
      if (d.onCircle) {
        return `translate(${[ringLeft + radius, radius]}) rotate(${d.value + 90})`;
      } else {
        return 'translate(' + [d.x, d.y] + ')';
      }
    },
  });

  $(function() {
    $('[data-toggle="tooltip"]').tooltip();
  });
}

$('#inputForm').submit(function(event) {
  event.preventDefault();
  console.log(currentlyEditedHandle);
  currentlyEditedHandle.content = $('#sequenceInput')
    .val()
    .trim();
  $('#inputModal').modal('hide');
  handles.selectAll('path').remove();
  drawHandles();
});

drawComponents();
drawTDnaRange();
drawHandles();

function dragmove(d) {
  d3.select(this).classed('active', true);
  var coordinates = d3.mouse(parent.node());
  d.x = coordinates[0];
  d.y = coordinates[1];
  console.log(d);
  if (d.x > ringRight + 10 || d.y > 2 * radius + 10 || d.x < ringLeft - 10) {
    // outside of circle
    d.onCircle = false;
    d.y = d.y + radius; // Center of arc is center of circle, so move ring segment to cursor position
  } else {
    // inside of circle
    d.onCircle = true;
    var newAngle = Math.atan2(d.y - radius, d.x - ringLeft - radius) * 57.2957795;
    if (newAngle < 0) {
      newAngle = 360 + newAngle;
    }
    d.value = newAngle;
  }
  drawHandles();
  drawTDnaRange();
  clearMessage();
}

function clearMessage() {
  parent.select('#message').remove();
}

function showMessage(type, message) {
  clearMessage();
  parent
    .append('text')
    .attr('id', 'message')
    .text(message)
    .attr('fill', type === 'error' ? 'red' : 'green')
    .attr('transform', `translate(${ringLeft + radius}, ${radius})`)
    .style('text-anchor', 'middle');
}

function validate() {
  // Alle Elemente platziert?
  if (values.filter(value => !value.onCircle).length > 0) {
    showMessage('error', 'Es sind nicht alle Elemente platziert');
    return;
  }
  showMessage('success', 'Alles korrekt!');
}
