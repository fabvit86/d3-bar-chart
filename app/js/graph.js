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

	const margins = {top: 20, right: 20, bottom: 60, left: 120}
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

  bar.append("rect") // insert a rect in the g element
  		.attr("class", "bar")
  		.attr("y", (d) => y(d.gross)) // y coordinate of the rect (ex: if y height is 10px, y must be set to chartHeight-10)
	    .attr("width", barWidth - 1) // width of the rect, leave 1px for bars' spacing
	    .attr("height", (d) => chartHeight - y(d.gross)) // height of the rect
	    .on("mouseover", function(d) { // DO NOT use arrow function in this case
	    	d3.select(this).classed("overed", true) // add "overed" class to the rect
	    	tooltip.transition()
	    		.duration(300)
	    		.style("opacity", 1) // show the tooltip
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

	//x axis line:
	const xAxis = svgchart.append('g')
									.classed("x-axis", true)
							    .attr("transform", "translate(0," + chartHeight + ")") // put the g on the bottom
							    .call(d3.axisBottom(x)) // call d3.axisBottom(x) on the g, to generate the axis within the g
  // x axis label:							    
	xAxis.append("text")
		.classed("axisLabel", true)
		.text("Date")
		.attr("dx", "20em") // x offset
		.attr("dy", "2.5em") // y offset
	xAxis.append("text")
		.classed("smallText", true)
		.text("[quarter's year and month]")
		.attr("dx", "44.5em")
		.attr("dy", "4.3em")
  xAxis.selectAll("text").style("text-anchor", "middle") // center x axis ticks' text
	
	//y axis line:
	const yAxis = svgchart.append('g')
									.classed("y-axis", true)
								 	.call(d3.axisLeft(y))
  // y axis label:
	yAxis.append("text")
 		.attr("id", "yAxisLabel")
 		.classed("axisLabel", true)
 		.text("Gross")
 		.attr("dx", "-15em") // x offset
 		.attr("dy", "-3.25em") // y offset
 		.attr("transform", "rotate(-90)") // rotate the label vertically
 	yAxis.append("text")
 		.classed("smallText", true)
		.text(" [billions of $]")
		.attr("dx", "-20.7em") // x offset
		.attr("dy", "-5.9em") // y offset
		.attr("transform", "rotate(-90)")
})
