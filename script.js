$(document).ready(function() {
  var width = d3.select('#map').node().getBoundingClientRect().width,
    height = d3.select('#map').node().getBoundingClientRect().height;

  var center = [width / 2, height / 2];

  var projection = d3.geo.mercator()
  .center([0, 10]);

  var svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var path = d3.geo.path()
    .projection(projection);
  var g = svg.append("g");
  d3.json("world-110m2.json", function (error, topology) {
    g.selectAll("path")
    .data(topojson.object(topology, topology.objects.countries).geometries)
    .enter()
    .append("path")
    .attr("d", path);
    //csv file to be imported
    d3.csv("map.csv", function (error, sample) {
      var locations = sample.reduce( (memo, item) => {
      /**console.log(item);*/
      const [ state, ailment, symptoms, treatments ] = item;

      let locations = memo[parseInt(state_id)];

      if (!locations) {
      locations = memo[parseInt(state_id)] = [];
      }

      locations.push(`Ailment: ${ailment}`)
      locations.push(`Symptoms: ${symptoms}`)
      locations.push(`Treatments: ${treatments}`)

      return memo;
      }, {});

      console.log(locations);
          var hue = 0; //create the circles
      // we will pass our data (the TopoJSON) as an argument, then create SVG elements using a classic D3 append. Selecting all paths, the TopoJSON is bound in the data method. From here, we can perform work on each element.
          locations.map(function(d) {  // Create an object for holding dataset
            hue += 0.36                // Create property for each circle, give it value from color
            d.color = 'hsl(' + hue + ', 100%, 50%)';
          });
      svg.selectAll("circle")
      .data(sample)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return projection([d.longitude, d.latitude])[0];
      })
      .attr("cy", function (d) {
        return projection([d.longitude, d.latitude])[1];
      })
      .attr("r", 5)
      .style('fill','red' )
      
      .on('mouseover', function(d) { 
        d3.select(this).style('fill', 'black'); 
        d3.select('#state_name').text(d.state_name);
        d3.select('#ailments').text(d.ailment);
        d3.select('#symptoms').text(d.symptoms);
        d3.select('#treatments').text(d.treatments);
        d3.select('#tooltip')
        .style('left', (d3.event.pageX + 20) + 'px')
        .style('top', (d3.event.pageY - 80) + 'px')
        .style('display', 'block')
        .style('opacity', 0.8)
      })
        //Add Event Listeners | mouseout
      .on('mouseout', function(d) { 
        d3.select(this).style('fill', "red");
        d3.select('#tip')
        .style('display', 'none');
      });
    });
  });
});