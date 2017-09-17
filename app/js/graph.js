'use strict'

const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
$.getJSON(url, (json, textStatus) => {
	const data = json.data
	// create an array of objects {date => gross}:
	const dataObject = data.map((elem) => {
		return {
			"date": elem[0],
			"gross": elem[1]
		}
	})
	const numberOfElements = data.length
	const firstDate = new Date(data[0][0]),
	 			lastDate  = new Date(data[numberOfElements-1][0])

	const margins = {top: 20, right: 20, bottom: 30, left: 120}
	const chartHeight = 600 - margins.top - margins.bottom
	const chartWidth = 1000 - margins.left - margins.right
	const barWidth = chartWidth / numberOfElements
	const formatTime = d3.timeFormat('%Y %B') // show only the year and the month of a date
	const formatCurrency = d3.format("$,.2f") // show local currency and round to 2 decimals

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

  // tooltip div:
  const tooltip = d3.select('#mainContainer').append("div")
  									.classed("tooltip", true)
  									.style("opacity", 0) // start invisible

	// bars:
	const bar = svgchart.selectAll("g") // each bar is a g element
						    .data(dataObject)
						  .enter().append("g")
						    .attr("transform", (d, i) => "translate(" + i * barWidth + ", 0)" ) // translate the g element horizontally
						    // .text().attr("dx", "1em")

  bar.append("rect") // insert a rect in the g element
  		.attr("class", "bar")
  		// .attr("x", (d) => x(new Date(d.date)))
  		.attr("y", (d) => y(d.gross)) // y coordinate of the rect (ex: if y height is 10px, y must be set to chartHeight-10)
	    .attr("width", barWidth - 1) // width of the rect, leave 1px for bars' spacing
	    .attr("height", (d) => chartHeight - y(d.gross)) // height of the rect
	    .on("mouseover", function(d) { // DO NOT use arrow function in this case
	    	d3.select(this).classed("overed", true) // add "overed" class to the rect
	    	tooltip.transition()
	    		.duration(300)
	    		.style("opacity", 1) // show the tooltip
	    		console.log(d3.select('.tooltip').node().height)
	    	tooltip.html(formatTime(new Date(d.date)) + "<hr><span class='gross'>" + formatCurrency(d.gross) + " Billions</span>")
         .style("left", (d3.event.pageX - d3.select('.tooltip').node().offsetWidth - 5) + "px")
         .style("top", (d3.event.pageY - d3.select('.tooltip').node().offsetHeight) + "px");
	    })
	    .on("mouseout", function(d) {
	    	d3.select(this).classed("overed", false)
	    	tooltip.transition()
	    		.duration(300)
	    		.style("opacity", 0)
	    	tooltip.html("")
	    })

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
