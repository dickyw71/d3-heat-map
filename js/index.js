//  setup SVG with width and height based on viewport 
let margin = 20,
    width = parseInt(d3.select(".svg-container").style("width")),
    height = parseInt(d3.select(".svg-container").style("height"));

let months = ["January", "February", "March", "April", "May", "June", 
              "July", "August", "September", "October", "November", "December" ];

// x scale - time , years 
let x = d3.scaleTime()
  .range([0, width]);

// y scale - time, months Jan-Dec
var y = d3.scaleOrdinal(months)
  .range([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

// Axis
var xAxis = d3.axisBottom(x)

var yAxis = d3.axisLeft(y);

var svg = d3.select(".heat-map")
    .attr("width", width + margin*2 )
    .attr("height", height + margin*2 )
    .attr("class", "heat-map")
  .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")");
  // .call(tip);

svg.append("g")
   .attr("class", "x axis")
   .attr("transform", "translate(0," + height + ")")
   .call(xAxis);

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis);

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json", function(error, data) {
  if (error) throw error;

  console.log(data);

  y.domain([d3.map(data.monthlyVariance, function(d) { return d.month; }), 1]);

});
 