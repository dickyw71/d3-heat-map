//  setup SVG with width and height based on viewport 
let margin = 20,
    width = parseInt(d3.select(".svg-container").style("width")) - margin*4,
    height = parseInt(d3.select(".svg-container").style("height")) - margin*2;

let months = ["January", "February", "March", "April", "May", "June", 
              "July", "August", "September", "October", "November", "December" ];

let parseYear = d3.timeParse("%Y");
let parseMonth = d3.timeParse("%m");

// x scale - years 
let x = d3.scaleTime()
  .range([0, width]);

// y scale - months Jan-Dec
var y = d3.scaleTime([parseMonth("Jan"), parseMonth("Dec")])
  .range([height, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

// Axis
var xAxis = d3.axisBottom(x)
  .tickFormat(d3.timeFormat("%Y"))
  // .ticks(d3.timeYears(parseYear(1753), parseYear(2015)));

var yAxis = d3.axisLeft(y)
  .tickFormat(d3.timeFormat("%m"))
//  .ticks(d3.timeMonths(parseMonth(0), parseMonth(11)));

var svg = d3.select(".heat-map")
    .attr("width", width + margin*4 )
    .attr("height", height + margin*2 )
    .attr("class", "heat-map")
  .append("g")
    .attr("transform", "translate(" + margin*2 + "," + margin + ")");
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
  y.domain([1, 12]);

  d3.select("body")
    .style("background-color", "cyan");

  let stripeWidth = x.range()[1] / data.monthlyVariance.length;
  let stripeHeight = y.range()[0] / 12;

  let myData = data.monthlyVariance;

  svg.selectAll(".stripe")
    .data(myData)
  .enter().append("rect")
        .attr("class", "stripe")
        .attr("width", stripeWidth*10)
        .attr("height", stripeHeight )
        .attr("x", (d, i) => x(parseYear(d.year)))
        .attr("y", (d, i) => y(d.month-1))
        .style("fill", (d) =>  color(data.baseTemperature + d.variance));
});
 