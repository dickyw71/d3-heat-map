//  setup SVG with width and height based on viewport 
let margin = 20,
    width = parseInt(d3.select(".svg-container").style("width")) - margin*4,
    height = parseInt(d3.select(".svg-container").style("height")) - margin*2;

let parseYear = d3.timeParse("%Y");
let parseMonth = d3.timeParse("%B"); 

let stripeTip = d3.tip()
    .attr("class", "d3-tip")
    .html(function(d) { return "<span>" + parseMonth(d.month) + " </span>" + "<span>" + parseYear(d.year) + "</span>"
                            + "<br/><span>" + 10 + d.variance + "</span>"
                            + "<br/><span>" + d.variance + "</span>"; })

// x scale - years 
let x = d3.scaleTime()
  .range([0, width]);

// y scale - months Jan-Dec
var y = d3.scaleTime()
  .range([height, 0]);

var color = d3.scaleSequential(d3.interpolateRainbow);

// Axis
var xAxis = d3.axisBottom(x)
.tickArguments([d3.timeYear.every(10)])
// .tickFormat(d3.timeFormat("%Y"))
//   .ticks(50);

var yAxis = d3.axisLeft(y)
  .tickSize([0])
  .tickFormat(d3.timeFormat("%B"));
  // .ticks(12);

var svg = d3.select(".heat-map")
    .attr("width", width + margin*2 )
    .attr("height", height + margin*2 )
    .attr("class", "heat-map")
  .append("g") 
    .attr("transform", "translate(" + margin*3 + "," + margin + ")")
  .call(stripeTip);

svg.append("g")
   .attr("class", "x axis")
   .attr("transform", "translate(0," + height + ")")
   .call(xAxis)
   .append("text")
    .attr("class", "x label")
    .attr("x", width/2)
    .attr("y", 36)
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .text("Year");

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
    .attr("class", "y label")
    .attr("transform", "translate(0, " + height/2 + ") rotate(-90)")
    .attr("y", 6)
    .attr("dy", "-2.8em")
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .text("Month")

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json", function(error, data) {
  if (error) throw error;

  let myData = data.monthlyVariance;
  console.log(data);
  
  let first = data.monthlyVariance[0];
  let last = data.monthlyVariance[data.monthlyVariance.length-1];
  let minTemp = d3.min(myData, (d) => data.baseTemperature + d.variance );
  let maxTemp = d3.max(myData, (d) => data.baseTemperature + d.variance );

  console.log(minTemp, maxTemp);

  x.domain([parseYear(first.year), parseYear(last.year)])
  y.domain([12, 1]);
  color.domain([maxTemp, minTemp]);

  d3.select("body").transition()
    .duration(1000)
    .style("background-color", "cyan");

  let stripeWidth = x.range()[1] / data.monthlyVariance.length;
  let stripeHeight = y.range()[0] / 12;

  svg.selectAll(".stripe")
    .data(myData)
  .enter().append("rect")
        .attr("class", "stripe")
        .attr("width", stripeWidth*12)
        .attr("height", stripeHeight+2)
        .attr("x", (d, i) => x(parseYear(d.year)))
        .attr("y", (d, i) => y(d.month))
        .attr("id", (d) => d.month + "_" + d.year)
        .style("fill", (d) =>  color(data.baseTemperature + d.variance))
    .on("mouseover", function(d, i) {
          stripeTip.show(d, svg)
       })
    .on("mouseout", stripeTip.hide);
});
 