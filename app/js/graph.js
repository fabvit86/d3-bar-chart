'use strict'

const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
$.getJSON(url, (json, textStatus) => {
	const data = json.data
	const numberOfElements = data.length
	const firstYear = new Date(data[0][0]).getFullYear()
	const lastYear = new Date(data[numberOfElements-1][0]).getFullYear()
	let minGross = data[0][1]
	let maxGross = data[0][1]
	const xz = d3.range(numberOfElements) // x axis range
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
	// console.log('minGross = '+minGross+'\n maxGross='+maxGross)

	const chartHeight = 600
	const chartWidth = 1000
	const barWidth = chartWidth / numberOfElements

	// y scale:
	const y = d3.scaleLinear().range([chartHeight, 0]) // because the origin is top-left, top will be chartHeight and bottom will be 0
	y.domain([0, maxGross]) // set the scale to the specified array of numbers
	// y.domain([0, d3.max(yElements, (d) => d )]) // same thing, using d3 to calculate the max y value

	// svg chart:
	const svgchart = d3.select('#svgchart') // select the svg element
										.attr("width", chartWidth) // set the width of the chart
										.attr("height", chartHeight) // set the height of the chart

	// bars:
	const bar = svgchart.selectAll("g") // each bar is a g element
						    .data(yElements)
						  .enter().append("g")
						    .attr("transform", (d, i) => "translate(" + i * barWidth + ", 0)" ) // translate the g element horizontally

  bar.append("rect") // insert a rect in the g element
  		.attr("y", (d) => y(d)) // y coordinate of the rect (ex: if y height is 10px, y must be set to chartHeight-10)
	    .attr("width", barWidth - 1) // width of the rect, leave 1px for bars' spacing
	    .attr("height", (d) => chartHeight - y(d)) // height of the rect

  // bar.append("text") // insert a text label in the g element
	 //    .attr("x", (d) => x(d) - 3 ) // offset x value by 3 pixel
	 //    .attr("y", barHeight / 2) // text height is half the bar height
	 //    .attr("dy", ".35em")
	 //    .text((d) => d )

	/*
	const x = d3.scaleLinear()
							.domain([0, d3.max(yElements)])
							.range([0, width]) // min-max pixel range of the bars' width

	const svgchart = d3.select('#svgchart') // select the svg element
										.attr("width", width) // set the width of the chart
										.attr("height", barHeight * yElements.length) // set the height of the chart based on the bar height

	// bars:
	const bar = svgchart.selectAll("g") // each bar is a g element
						    .data(yElements)
						  .enter().append("g")
						    .attr("transform", (d, i) => "translate(0," + i * barHeight + ")" ) // translate the g element vertically

  bar.append("rect") // insert a rect in the g element
	    .attr("width", x) // width of the rect
	    .attr("height", barHeight - 1) // height of the rect

  bar.append("text") // insert a text label in the g element
	    .attr("x", (d) => x(d) - 3 ) // offset x value by 3 pixel
	    .attr("y", barHeight / 2) // text height is half the bar height
	    .attr("dy", ".35em")
	    .text((d) => d )
	*/

	// html chart:
	// d3.select("#graph") // select the div container of the chart
	//   .selectAll("div") // initiate the data join by defining the div to which the data will be joined
	//     .data(yElements) // join the data (yElements) to the selection
	//   .enter().append("div") // the selection is empty: append a div for each data element
	//     .style("width", (d) => x(d) + "px" ) // give to each div element a width that depends on it's value
	//     .text((d) => d ) // write the element value
})
