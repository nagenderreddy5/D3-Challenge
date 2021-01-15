
//  Set up our chart
var svgWidth = window.innerWidth - 250;
var svgHeight = window.innerHeight;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .classed("chart", true);
// append an SVG group 
var SVG_chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Import data .csv file
// =================================
d3.csv("../assets/data/data.csv").then(function(censusData) {
    
  
  

  // Formatting the data and converting the data type 
  censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // Create the scales for the chart
  
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.poverty) * 0.8,
    d3.max(censusData, d => d.poverty) * 1.2
    ])
    .range([0,width])

var yLinearScale = d3.scaleLinear()
    .domain([d3.max(censusData, d => d.healthcare),
    d3.min(censusData, d => d.healthcare)
    ])
    .range([0, height])

// Creating bottom and left axis to the SVG_chart group

var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);


 // Append Axes to the chart
    // ==============================
    SVG_chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

      SVG_chartGroup.append("g")
      .call(leftAxis);

    //  Create Circles for the chart
    // ==============================
    var circles_Group = SVG_chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("r", 15)
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))

    var circle_Text = SVG_chartGroup.selectAll(null).data(censusData).enter().append("text");

circle_Text
    .classed("stateText", true)
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("font-size", (10))
   ;

    // Initialize tool tip in SVG chart
   
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(d => (`${d.state}<br>Poverty: ${d.poverty} <br>Healthcare: ${d.healthcare}`));

    //  Create tooltip in the SVG chart
    
    SVG_chartGroup.call(toolTip);

    //  Create event listener for displaying the tooltip
    // ==============================
    circles_Group.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    SVG_chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 50)
      .attr("x", 0 - (height / 2)-50)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lack Healthcare (%)");

      SVG_chartGroup.append("text")
      .attr("transform", `translate(${width / 2 - 50}, ${height + margin.top + 10})`)
      .attr("class", "axisText")
      .text("Poverty (%)");

  }).catch(function(error) {
    console.log(error);
  });