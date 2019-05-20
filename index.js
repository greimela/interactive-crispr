var values = [
  { value: 0, label: 'A', onCircle: true, x: 0, y: 0 },
  { value: 50, label: 'B', onCircle: true, x: 0, y: 0 },
  { value: 250, label: 'C', onCircle: true, x: 0, y: 0 },
];
var dragging = null;

console.log(values);
var height = 800,
  width = 600,
  margin = { top: 20, left: 20, bottom: 20, right: 20 };
var radius = 100;

var parent = d3
  .select('.parent')
  .append('svg')
  .attr({
    height: height,
    width: width,
  })
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// var angularScale = d3.scale.linear().range([0, 360]).domain([0, total]);

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

//position the handles based on the input values
function drawHandles() {
  var arc = d3.svg
    .arc()
    .innerRadius(radius - 5)
    .outerRadius(radius + 5)
    .startAngle(-0.1 * Math.PI)
    .endAngle(0.1 * Math.PI);
  var join = handles.selectAll('path').data(values);
  join
    .enter()
    .append('path')
    .attr({
      d: arc,
      class: 'handle',
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

drawHandles();

function dragmove(d, i) {
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
  //REDRAW HANDLES
  drawHandles();
}
