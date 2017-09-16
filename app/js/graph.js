'use strict'

/*
data = [
	["date1", value1],
	["date2", value2],
	["date3", value3]
]
xElements = ["date1", "date2", "date3"]
yElements = [value1, value2, value3]
*/

const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
$.getJSON(url, (json, textStatus) => {
	const data = json.data
	// create an array of objects date => gross:
	const dataObject = data.map((elem) => {
		return {
			"date": elem[0],
			"gross": elem[1]
		}
	})
	const numberOfElements = data.length
	const firstDate = new Date(data[0][0]),
	 			lastDate  = new Date(data[numberOfElements-1][0])
	const firstYear = firstDate.getFullYear()
	const lastYear = new Date(data[numberOfElements-1][0]).getFullYear()
	let minGross = data[0][1],
		  maxGross = data[0][1]
	let xElements = [] // all elements on the x axis
	let yElements = [] // all elements on the y axis
	data.forEach((element) => {
		let xDate = element[0]
		let yGross = element[1]
		xElements.push(xDate)
		yElements.push(yGross)
		let xYear = new Date(xDate).getFullYear()
		if (yGross > maxGross) {
			maxGross = yGross
		}
		if (yGross < minGross) {
			minGross = yGross
		}
	})

	const margins = {top: 20, right: 20, bottom: 30, left: 40}
	const chartHeight = 600 - margins.top - margins.bottom
	const chartWidth = 1000 - margins.left - margins.right
	const barWidth = chartWidth / numberOfElements

	// x scale (years):
	const x = d3.scaleTime().domain([firstDate, lastDate]).range([0, chartWidth])

	// y scale (gross values):
	const y = d3.scaleLinear().range([chartHeight, 0]) // because the origin is top-left, top will be chartHeight and bottom will be 0
	y.domain([0, d3.max(dataObject, (d) => d.gross )]) // set the scale to the specified array of numbers [0, maxGross]

	// svg chart:
	const svgchart = d3.select('#svgchart') // select the svg element
										.attr("width", chartWidth + margins.left + margins.right) // set the width of the chart
										.attr("height", chartHeight + margins.top + margins.bottom) // set the height of the chart
										.append("g") // add this g to set left and top margins
    									.attr("transform", "translate(" + margins.left + "," + margins.top + ")")

	// bars:
	const bar = svgchart.selectAll("g") // each bar is a g element
						    .data(dataObject)
						  .enter().append("g")
						    .attr("transform", (d, i) => "translate(" + i * barWidth + ", 0)" ) // translate the g element horizontally
						    // .text().attr("dx", "1em")

  bar.append("rect") // insert a rect in the g element
  		.attr("class", "bar")
  		// .attr("x", 1)
  		// .attr("x", (d) => x(d.date))
  		// .attr("x", (d) => x(new Date(d.date)))
  		.attr("y", (d) => y(d.gross)) // y coordinate of the rect (ex: if y height is 10px, y must be set to chartHeight-10)
	    .attr("width", barWidth - 1) // width of the rect, leave 1px for bars' spacing
	    .attr("height", (d) => chartHeight - y(d.gross)) // height of the rect

	// svg.append("g")
 //    .attr("class", "y axis")
 //    .call(yAxis)
 //  .append("text")
 //    .attr("transform", "rotate(-90)")
 //    .attr("y", 6)
 //    .attr("dy", ".71em")
 //    .style("text-anchor", "end")
 //    .text("Frequency");
	//x axis line:
	const xAxis = svgchart.append('g')
									.attr("class", "x-axis")
							    .attr("transform", "translate(0," + chartHeight + ")") // put the g on the bottom
							    .call(d3.axisBottom(x)) // call d3.axisBottom(x) on the g, to generate the axis within the g
  // x axis label:							    
	xAxis.append("text")
		.attr("class", "axisLabel")
		.text("Date")
		.attr("dy", "1em") // y offset
  xAxis.selectAll("text").style("text-anchor", "middle") // center x axis ticks' text
	
	//y axis line:
	svgchart.append('g')
		.attr("class", "y-axis")
	 	.call(d3.axisLeft(y))
	 	.append("text")
	 		.attr("class", "axisLabel")
	 		.text("Gross")
	 		.attr("dx", ".8em") // x offset
	 		.attr("dy", "-0.25em")
})

/*
// example:
const data = [
	{ letter: "A", frequency: 0.08167 },
	{ letter: "B", frequency: 0.01492 },
	{ letter: "C", frequency: 0.02780 },
	{ letter: "D", frequency: 0.04253 },
	{ letter: "E", frequency: 0.12702 },
	{ letter: "F", frequency: 0.02288 },
	{ letter: "G", frequency: 0.02022 },
	{ letter: "H", frequency: 0.06094 },
	{ letter: "I", frequency: 0.06973 },
	{ letter: "J", frequency: 0.00153 },
	{ letter: "K", frequency: 0.00747 },
	{ letter: "L", frequency: 0.04025 },
	{ letter: "M", frequency: 0.02517 },
	{ letter: "N", frequency: 0.06749 },
	{ letter: "O", frequency: 0.07507 },
	{ letter: "P", frequency: 0.01929 },
	{ letter: "Q", frequency: 0.00098 },
	{ letter: "R", frequency: 0.05987 },
	{ letter: "S", frequency: 0.06333 },
	{ letter: "T", frequency: 0.09056 },
	{ letter: "U", frequency: 0.02758 },
	{ letter: "V", frequency: 0.01037 },
	{ letter: "W", frequency: 0.02465 },
	{ letter: "X", frequency: 0.00150 },
	{ letter: "Y", frequency: 0.01971 },
	{ letter: "Z", frequency: 0.00074 },
	{ letter: "Aa", frequency: 0.08167 },
	{ letter: "Ba", frequency: 0.01492 },
	{ letter: "Ca", frequency: 0.02780 },
	{ letter: "Da", frequency: 0.04253 },
	{ letter: "Ea", frequency: 0.12702 },
	{ letter: "Fa", frequency: 0.02288 },
	{ letter: "Ga", frequency: 0.02022 },
	{ letter: "Ha", frequency: 0.06094 },
	{ letter: "Ia", frequency: 0.06973 },
	{ letter: "Ja", frequency: 0.00153 },
	{ letter: "Ka", frequency: 0.00747 },
	{ letter: "La", frequency: 0.04025 },
	{ letter: "Ma", frequency: 0.02517 },
	{ letter: "Na", frequency: 0.06749 },
	{ letter: "Oa", frequency: 0.07507 },
	{ letter: "Pa", frequency: 0.01929 },
	{ letter: "Qa", frequency: 0.00098 },
	{ letter: "Ra", frequency: 0.05987 },
	{ letter: "Sa", frequency: 0.06333 },
	{ letter: "Ta", frequency: 0.09056 },
	{ letter: "Ua", frequency: 0.02758 },
	{ letter: "Va", frequency: 0.01037 },
	{ letter: "Wa", frequency: 0.02465 },
	{ letter: "Xa", frequency: 0.00150 },
	{ letter: "Ya", frequency: 0.01971 },
	{ letter: "Za", frequency: 0.00074 }
]

var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scaleBand()
    .rangeRound([0, width], .1);

var y = d3.scaleLinear()
    .range([height, 0]);

var xAxis = d3.axisBottom(x)
var yAxis = d3.axisLeft(y).tickFormat(formatPercent)

var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(data.map((d) => d.letter))
y.domain([0, d3.max(data, (d) => d.frequency)])

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Frequency");

svg.selectAll(".bar")
    .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.letter); })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d.frequency); })
    .attr("height", function(d) { return height - y(d.frequency); })

function type(d) {
  d.frequency = +d.frequency;
  return d;
}
*/
