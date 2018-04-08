//  setup SVG with width and height based on viewport 
let margin = 20,
    width = 1200 - margin*4,
    height = 600 - margin*2;

let parseYear = d3.timeParse("%Y");
let parseMonth = d3.timeParse("%B"); 

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let baselineTemp = 15;


let stripeTip = d3.tip()
    .attr("class", "d3-tip")
    .html(function(d) { return "<span>" + months[d.month-1] + " </span>" + "<span> - " + d.year + "</span>"
                            + "<br/><span>" + (baselineTemp + d.variance).toPrecision(2) + " ℃</span>"
                            + "<br/><span>" + d.variance.toPrecision(2) + " ℃</span>"; })

// x scale - years 
let x = d3.scaleTime()
  .range([0, width]);

// y scale - months Jan-Dec
var y = d3.scaleTime()
  .range([height, 0]);

var color = d3.scaleSequential(d3.interpolateRainbow);

// Axis
var xAxis = d3.axisBottom(x)
  .tickSizeOuter(10)
  .ticks(20)

var svg = d3.select(".heat-map")
    .attr("width", width + margin*2 )
    .attr("height", height + margin*8 )
    .attr("class", "heat-map")
  .append("g") 
    .attr("transform", "translate(" + margin*3 + "," + margin*2 + ")")
  .call(stripeTip);

svg.append("g")
  .attr("class", "y axis")
  // .call(yAxis)
  .append("text")
    .attr("class", "y label")
    .attr("transform", "translate(0, " + height/2 + ") rotate(-90)")
    .attr("y", 6)
    .attr("dy", "-2.8em")
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .text("Month")

    console.log("Height: ", height/12);

svg.selectAll(".y-label")
  .data(months)
.enter().append("text")
  .attr("class", "y-label")
  .attr("transform", (d, i) => "translate(0, " + ((height/12)*(i+1)) + ")")
  .attr("dx", "-0.5em")  
  .attr("dy", "-1.3em")
  .attr("fill", "black")
  .style("text-anchor", "end")
  .text(d => d)


d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json", function(error, data) {
  if (error) throw error;

  baselineTemp = data.baseTemperature;

  let myData = data.monthlyVariance;
  
  let first = data.monthlyVariance[0];
  let last = data.monthlyVariance[data.monthlyVariance.length-1];
  let minTemp = d3.min(myData, (d) => data.baseTemperature + d.variance );
  let maxTemp = d3.max(myData, (d) => data.baseTemperature + d.variance );

  x.domain([new Date(first.year, first.month, 1), new Date(last.year, last.month, 1)])
  y.domain([12, 1]);
  color.domain([maxTemp, minTemp]);

  console.log("X Domain:", x.domain());

  let stripeWidth = x.range()[1] / data.monthlyVariance.length;
  let stripeHeight = y.range()[0] / 12;

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

  svg.selectAll(".stripe")
    .data(myData)
  .enter().append("rect")
        .attr("class", "stripe")
        .attr("width", stripeWidth+2)
        .attr("height", stripeHeight+2)
        .attr("transform", (d) => "translate("+ x(parseYear(d.year)) + ", " + y(d.month) + ")")
        // .attr("x", (d, i) => x(parseYear(d.year)))
        // .attr("y", (d, i) => y(d.month))
        .attr("id", (d) => d.month + "_" + d.year)
        .style("fill", (d) =>  color(data.baseTemperature + d.variance))
    .on("mouseover", function(d, i) {
          stripeTip.show(d, svg)
       })
    .on("mouseout", stripeTip.hide);
});
 