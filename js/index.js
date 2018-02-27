//  setup SVG with width and height based on viewport 
let margin = 20,
    width = parseInt(d3.select(".svg-container").style("width")) - margin*4,
    height = parseInt(d3.select(".svg-container").style("height")) - margin*2;

let parseYear = d3.timeParse("%Y");
let parseMonth = d3.timeParse("%m"); 

let months = ["January", "February", "March", 
              "April", "May", "June", 
              "July", "August", "September", 
              "October", "November", "December"];

// x scale - years 
let x = d3.scaleTime()
  .range([0, width]);

// y scale - months Jan-Dec
var y = d3.scaleTime(months)
  .range([height, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory20);

// Axis
var xAxis = d3.axisBottom(x)
  .tickFormat(d3.timeFormat("%Y"))
  .ticks(50);

var yAxis = d3.axisLeft(y)
  .tickFormat(d3.timeFormat("%B"))
  .ticks(12);

var svg = d3.select(".heat-map")
    .attr("width", width + margin*2 )
    .attr("height", height + margin*2 )
    .attr("class", "heat-map")
  .append("g")
    .attr("transform", "translate(" + margin*3 + "," + margin + ")");
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
  
  first = data.monthlyVariance[0];
  last = data.monthlyVariance[data.monthlyVariance.length-1];
 
  x.domain([parseYear(first.year), parseYear(last.year)])
  y.domain([12, 1]);

  d3.select("body").transition()
    .duration(1000)
    .style("background-color", "cyan");

  let stripeWidth = x.range()[1] / data.monthlyVariance.length;
  let stripeHeight = y.range()[0] / 12;

  let myData = data.monthlyVariance;

  console.log(months);

  svg.selectAll(".stripe")
    .data(myData)
  .enter().append("rect")
        .attr("class", "stripe")
        .attr("width", stripeWidth*20)
        .attr("height", stripeHeight)
        .attr("x", (d, i) => x(parseYear(d.year)))
        .attr("y", (d, i) => y(d.month))
        .style("fill", (d) =>  color(data.baseTemperature + d.variance));
});
 