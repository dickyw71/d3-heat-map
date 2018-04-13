//  setup SVG with width and height based on viewport 
let margin = { top: 10, left: 90, bottom: 40, right: 20 }
    width = 1100 - (margin.left + margin.right),
    height = 600 - (margin.left + margin.right);

let parseYear = d3.timeParse("%Y");
let parseMonth = d3.timeParse("%B"); 

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let baselineTemp = 15;


let stripeTip = d3.tip()
    .attr("class", "d3-tip")
    .html(function(d) { return "<span>" + months[d.month-1] + " </span>" + "<span> - " + d.year + "</span>"
                            + "<br/><span>Baseline + variance: " + (baselineTemp + d.variance).toPrecision(2) + " ℃</span>"
                            + "<br/><span>Variance: " + d.variance.toPrecision(2) + " ℃</span>"; })

// x scale - years 
let x = d3.scaleTime()
  .range([0, width]);

// y scale - months Jan-Dec
let y = d3.scaleTime()
  .range([height, 0]);

let color = d3.scaleSequential(d3.interpolateRainbow);

// Axis
let xAxis = d3.axisBottom(x)

let svg = d3.select(".heat-map")
    .attr("width", width + (margin.left + margin.right) )
    .attr("height", height + (margin.top + margin.bottom) )
    .attr("class", "heat-map")
  .append("g") 
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .call(stripeTip);

svg.append("g")
  .attr("class", "y axis")
  .append("text")
    .attr("class", "y label")
    .attr("transform", "translate(0, " + height/2 + ") rotate(-90)")
    .attr("y", 6)
    .attr("dy", "-3.8em")
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .text("Month")

svg.selectAll(".y-label")
  .data(months)
.enter().append("text")
  .attr("class", "y-label label")
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
  let years = last.year - first.year;

  x.domain([new Date(first.year, first.month, 1), new Date(last.year, last.month, 1)])
  y.domain([12, 1]);
  color.domain([maxTemp, minTemp]);

  let stripeWidth = x.range()[1] / years;
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
        .attr("width", stripeWidth)
        .attr("height", stripeHeight)
        .attr("transform", (d) => "translate("+ x(parseYear(d.year)) + ", " + ((d.month-1)*stripeHeight) + ")")
        .attr("id", (d) => d.month + "_" + d.year)
        .style("fill", (d) =>  color(data.baseTemperature + d.variance))
    .on("mouseover", function(d, i) {
          stripeTip.show(d, svg)
       })
    .on("mouseout", stripeTip.hide);
});
 