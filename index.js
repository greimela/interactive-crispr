var values = [
  { value: 0, type: 'insert', onCircle: true, length: 10, x: 0, y: 0 },
  { value: 300, type: 'insert', onCircle: true, length: 10, x: 0, y: 0 },
  { value: 50, type: 'right-border', onCircle: true, length: 5, x: 0, y: 0 },
  { value: 180, type: 'virulenzgen', onCircle: true, length: 10, x: 0, y: 0 },
  { value: 250, type: 'left-border', onCircle: true, length: 5, x: 0, y: 0 },
];

var height = 500,
  width = 960,
  margin = { top: 20, left: 20, bottom: 20, right: 20 },
  radius = 200;

var parent = d3
  .select('.parent')
  .append('svg')
  .attr({
    height: height,
    width: width,
  })
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var ring = parent
  .append('g')
  .attr('id', 'rim')
  .attr('transform', 'translate(' + radius + ',' + radius + ')');
ring.append('circle').attr({
  r: radius,
  class: 'ring',
});

var handles = parent
  .append('g')
  .attr('id', 'handles')
  .attr('transform', 'translate(' + radius + ',' + radius + ')');

var drag = d3.behavior
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
      degrees = (rightBorder.value - (leftBorder.value - 360));
    } else {
      degrees = rightBorder.value - leftBorder.value;
    }
    const angle = degrees * Math.PI / 180;
    const arc = d3.svg
      .arc()
      .innerRadius(radius - 20)
      .outerRadius(radius - 15)
      .startAngle(0)
      .endAngle(angle);
    ring.append('path').attr({ d: arc, transform: `rotate(${leftBorder.value + 90})` });
  }
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
        const length = (d.length * Math.PI) / 180;
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
        return `rotate(${d.value + 90})`;
      } else {
        return 'translate(' + [d.x, d.y] + ')';
      }
    },
  });
}

drawTDnaRange();
drawHandles();

function dragmove(d) {
  d3.select(this).classed('active', true);
  console.log(d);
  var coordinates = d3.mouse(parent.node());
  d.x = coordinates[0] - radius;
  d.y = coordinates[1] - radius;
  console.log(coordinates);
  if (d.x > radius + 10 || d.y > radius + 10) {
    // outside of circle
    d.onCircle = false;
    d.y = d.y + radius;
  } else {
    // inside of circle
    d.onCircle = true;
    var newAngle = Math.atan2(d.y, d.x) * 57.2957795;
    if (newAngle < 0) {
      newAngle = 360 + newAngle;
    }
    d.value = newAngle;
  }
  drawHandles();
  drawTDnaRange();
}
