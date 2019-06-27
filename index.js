const firstBlock = 10;
const firstBlockHeight = 220;
const secondBlock = firstBlock + firstBlockHeight + 10;
const secondBlockHeight = 100;
const thirdBlock = secondBlock + secondBlockHeight + 10;

const componentTop = 200;
var values = [
  { value: 0, type: 'spacer1', onCircle: false, length: 15, x: 50, y: componentTop + firstBlock + 50 },
  { value: 0, type: 'spacer2', onCircle: false, length: 15, x: 150, y: componentTop + firstBlock + 50 },
  { value: 0, type: 'repeat', onCircle: false, length: 10, x: 50, y: componentTop + firstBlock + 50 + 70 },
  { value: 0, type: 'repeat', onCircle: false, length: 10, x: 100, y: componentTop + firstBlock + 50 + 70 },
  { value: 0, type: 'repeat', onCircle: false, length: 10, x: 150, y: componentTop + firstBlock + 50 + 70 },
  { value: 0, type: 'cas-gen', onCircle: false, length: 15, x: 100, y: componentTop + firstBlock + 50 + 70 + 70 },
  { value: 0, type: 'left-border', onCircle: false, length: 10, x: 50, y: componentTop + secondBlock + 70 },
  { value: 0, type: 'right-border', onCircle: false, length: 10, x: 150, y: componentTop + secondBlock + 70 },
  { value: 0, type: 'virulenzgen', onCircle: false, length: 20, x: 100, y: componentTop + thirdBlock + 70 },
];

var height = 500,
  width = 960,
  margin = { top: 20, left: 20, bottom: 20, right: 20 },
  radius = 200,
  componentBoxWidth = 200;

var error;

var ringLeft = width - 2 * radius - componentBoxWidth;
var ringRight = ringLeft + 2 * radius;

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
  ring.select('text').remove();

  const leftBorder = values.find(value => value.type === 'left-border');
  const rightBorder = values.find(value => value.type === 'right-border');

  if (leftBorder && rightBorder && leftBorder.onCircle && rightBorder.onCircle) {
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

    ring
      .append('text')
      .text('t-DNA-Bereich')
      .attr({ y: -150, fill: 'black', class: 'noselect' })
      .style('text-anchor', 'middle')
      .attr({ transform: `rotate(${leftBorder.value + degrees / 2 + 90})` });
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
    y: firstBlock,
    width: componentBoxWidth - 20,
    height: firstBlockHeight,
    fill: 'white',
    stroke: 'black',
  });
  components
    .append('text')
    .text('Spacer')
    .attr({ x: 100, y: firstBlock + 20, fill: 'black', class: 'noselect' })
    .style('text-anchor', 'middle');

  components
    .append('text')
    .text('Repeat')
    .attr({ x: 100, y: firstBlock + 90, fill: 'black', class: 'noselect' })
    .style('text-anchor', 'middle');

  components
    .append('text')
    .text('Cas-Gen')
    .attr({ x: 100, y: firstBlock + 160, fill: 'black', class: 'noselect' })
    .style('text-anchor', 'middle');

  components.append('rect').attr({
    x: 10,
    y: secondBlock,
    width: componentBoxWidth - 20,
    height: secondBlockHeight,
    fill: 'white',
    stroke: 'black',
  });
  components
    .append('text')
    .text('Grenzen')
    .attr({ x: 100, y: secondBlock + 20, fill: 'black', class: 'noselect' })
    .style('text-anchor', 'middle');
  components
    .append('text')
    .text('Links')
    .attr({ x: 50, y: secondBlock + 50, fill: 'black', class: 'noselect' })
    .style('text-anchor', 'middle');
  components
    .append('text')
    .text('Rechts')
    .attr({ x: 150, y: secondBlock + 50, fill: 'black', class: 'noselect' })
    .style('text-anchor', 'middle');

  components.append('rect').attr({
    x: 10,
    y: thirdBlock,
    width: componentBoxWidth - 20,
    height: 100,
    fill: 'white',
    stroke: 'black',
  });
  components
    .append('text')
    .text('Virulenzgene')
    .attr({ x: 100, y: thirdBlock + 20, fill: 'black', class: 'noselect' })
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
    })
    .on('mouseover', function() {
      d3.select(this).classed('active', true);
    })
    .on('mouseout', function() {
      d3.select(this).classed('active', false);
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
}

drawComponents();
drawTDnaRange();
drawHandles();

function dragmove(d) {
  d3.select(this).classed('active', true);
  var coordinates = d3.mouse(parent.node());
  d.x = coordinates[0];
  d.y = coordinates[1];
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
    showMessage('error', 'Das Plasmid ist nicht vollständig!');
    return;
  }
  // Abschnitte überlappen
  for (const first of values) {
    for (const second of values) {
      if (first === second) {
        continue;
      }
      const firstAngle = 0;
      const secondAngle = (second.value - first.value + 360) % 360;
      if (
        firstAngle + first.length / 2 > secondAngle - second.length / 2 &&
        firstAngle + first.length / 2 < secondAngle + second.length / 2
      ) {
        showMessage('error', 'Abschnitte überlappen sich!');
        return;
      }
    }
  }

  // Insert nicht im t-DNA-Bereich
  const leftBorder = values.find(value => value.type === 'left-border');
  const insert = values.find(value => value.type === 'insert');
  const virulenzgen = values.find(value => value.type === 'virulenzgen');
  const rightBorder = values.find(value => value.type === 'right-border');

  const leftBorderAngle = 0;
  const insertAngle = (insert.value - leftBorder.value + 360) % 360;
  const virulenzgenAngle = (virulenzgen.value - leftBorder.value + 360) % 360;
  const rightBorderAngle = (rightBorder.value - leftBorder.value + 360) % 360;

  if (insertAngle - insert.length / 2 > rightBorderAngle + rightBorder.length / 2) {
    showMessage('error', 'Insert befindet sich nicht im t-DNA-Bereich!');
    return;
  }

  // Virulenzgen im t-DNA-Bereich
  if (virulenzgenAngle - virulenzgen.length / 2 < rightBorderAngle + rightBorder.length / 2) {
    showMessage('error', 'Virulenzgen befindet sich im t-DNA-Bereich!');
    return;
  }

  // Eingegebene Sequenz sind leer
  if (!insert.spacer1 || !insert.spacer2) {
    showMessage('error', 'Im Insert wurden keine zwei Spacer eingetragen!');
    return;
  }

  // Eingegebene Sequenz enthält nicht nur ATCG
  if (!insert.spacer1.match(/^[atcgATCG-]*$/) && !insert.spacer2.match(/^[atcgATCG-]*$/)) {
    showMessage('error', 'Spacer enthalten andere Buchstaben als ATCG!');
    return;
  }

  // t-DNA-Bereich ist größer als 90 Grad
  if (rightBorderAngle > 90) {
    showMessage('error', 't-DNA-Bereich ist größer als 90 Grad!');
    return;
  }

  showMessage('success', 'Alles korrekt!');
}
