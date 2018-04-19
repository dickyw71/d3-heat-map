let margin = { top: 20, left: 90, bottom: 70, right: 20 }
    width = 1100 - (margin.left + margin.right),
    height = 600 - (margin.top + margin.bottom);

let parseYear = d3.timeParse("%Y");
let parseMonth = d3.timeParse("%B"); 

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let baselineTemp = 15;
let myData = [];


let stripeTip = d3.tip()
    .attr("class", "d3-tip")
    .html(function(d) { return "<span>" + months[d.month-1] + " </span>" + "<span> - " + d.year + "</span>"
                            + "<br/><span>Temp: " + (baselineTemp + d.variance).toPrecision(2) + "℃</span>"
                            + "<br/><span>Delta: " + d.variance.toPrecision(2) + "℃</span>"; })

// x scale - years 
let x = d3.scaleTime()
  .range([0, width]);

// y scale - months Jan-Dec
let y = d3.scaleTime()
  .range([height, 0]);

// colour scale 
let colour = d3.scaleSequential(d3.interpolateInferno);

// Axis
let xAxis = d3.axisBottom(x)

let svg = d3.select(".heat-map")
    .attr("width", width + (margin.left + margin.right) )
    .attr("height", height + (margin.top + margin.bottom) )
    .attr("class", "heat-map")
  .append("g") 
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .call(stripeTip);

svg.append("text")
  .attr("fill", "#000")
  .attr("x", width/2)
  .attr("text-anchor", "middle")
  .attr("y", -6)
  .text("Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average.\nEstimated Jan 1951-Dec 1980 absolute temperature ℃: 8.66 +/- 0.07")

svg.append("g")
  .attr("class", "y axis")
  .append("text")
    .attr("class", "y label")
    .attr("transform", "translate(0, " + height/2 + ") rotate(-90)")
    .attr("y", 6)
    .attr("dy", "-3.8em")
    .attr("fill", "black")
    .attr("font-weight", "bold")
    .style("text-anchor", "middle")
    .text("Month")

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


svg.append("g")
  .attr("class", "legendSequential")
  .attr("transform", "translate(" + (width-360) + "," + (height+(margin.bottom/2)) + ")")
  .append("text")
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("y", 30)
    .text("Temperature ℃")

let legendSequential = d3.legendColor()
    .shapeWidth(25)
    .cells([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
    .labelFormat(d3.format(".2"))
    .orient("horizontal")
    .labelOffset(-9)
    .scale(colour) 
    .on("cellover", function(d) { 
      console.log(d)
      displayOnly(d)
    })
              

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json", function(error, data) {
  if (error) throw error;

  baselineTemp = data.baseTemperature;

  myData = data.monthlyVariance;
  
  let first = data.monthlyVariance[0];
  let last = data.monthlyVariance[data.monthlyVariance.length-1];
  let minTemp = d3.min(myData, (d) => data.baseTemperature + d.variance );
  let maxTemp = d3.max(myData, (d) => data.baseTemperature + d.variance );
  let years = last.year - first.year;

  x.domain([new Date(first.year, first.month, 1), new Date(last.year, last.month, 1)])
  y.domain([12, 1]);
  colour.domain([minTemp.toPrecision(2), maxTemp.toPrecision(2)])
  
  let stripeWidth = x.range()[1] / years;
  let stripeHeight = y.range()[0] / 12;
  
  console.log(stripeWidth, stripeHeight)

  svg.select(".legendSequential")
   .call(legendSequential)

  svg.append("g")
   .attr("class", "x axis")
   .attr("transform", "translate(0," + height + ")")
   .call(xAxis)
   .append("text")
    .attr("class", "x label")
    .attr("x", width/2)
    .attr("y", 40)
    .attr("fill", "black")
    .attr("font-weight", "bold")
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
        .style("fill", (d) =>  colour(data.baseTemperature + d.variance))
    .on("mouseover", function(d, i) {
          stripeTip.show(d, svg)
       })
    .on("mouseout", stripeTip.hide);
    
});
 
function displayOnly(temperature) {
  // do stuff
  let filteredData = d3.map(myData, (d) => ((baselineTemp + d.variance).toPrecision(1) <= temperature))
  console.log(filteredData)

  svg.selectAll(".stripe")
    .exit().remove()

  svg.selectAll(".stripe")  
    .data(filteredData)
  
  svg.selectAll(".stripe")
    .style("fill", (d) =>  colour(baselineTemp + d.variance))
}