// this is the size of the svg container
			var fullwidth = 800,
				fullheight = 700;

			// these are the margins around the graph. Axes labels go in margins.
			var margin = {top: 20, right: 25, bottom: 20, left: 200};

			var width = 800 - margin.left - margin.right,
    		height = 700 - margin.top - margin.bottom;

			var widthScale = d3.scale.linear()
								.range([ 0, width]);

			var heightScale = d3.scale.ordinal()
								.rangeRoundBands([ margin.top, height], 0.2);

			var xAxis = d3.svg.axis()
							.scale(widthScale)
							.orient("bottom");

			var yAxis = d3.svg.axis()
							.scale(heightScale)
							.orient("left")
							.innerTickSize([0]);


			var svg = d3.select("body")
						.append("svg")
						.attr("width", fullwidth)
						.attr("height", fullheight);


			d3.csv("nnmr.csv", function(error, data) {

				if (error) {
					console.log("error reading file");
				}

				data.sort(function(a, b) {
					return d3.descending(+a.y2016, +b.y2016);
				});


				widthScale.domain([0, 35]);


				heightScale.domain(data.map(function(d) { return d.item; } ));


				// Make the faint lines from y labels to highest dot

				var linesGrid = svg.selectAll("lines.grid")
					.data(data)
					.enter()
					.append("line");

				linesGrid.attr("class", "grid")
					.attr("x1", margin.left)
					.attr("y1", function(d) {
						return heightScale(d.item) + heightScale.rangeBand()/2;
					})
					.attr("x2", function(d) {
						return margin.left + widthScale(+d.y2016);

					})
					.attr("y2", function(d) {
						return heightScale(d.item) + heightScale.rangeBand()/2;
					});

		// Make the faint lines from y labels to highest dot

					var linesGrid2 = svg.selectAll("lines.grid2")
						.data(data)
						.enter()
						.append("line");

					linesGrid2.attr("class", "grid")
						.attr("x1", 775)
						.attr("y1", function(d) {
							return heightScale(d.item) + heightScale.rangeBand()/2;
						})
						.attr("x2", function(d) {
							return margin.left + widthScale(+d.y2016);

						})
						.attr("y2", function(d) {
							return heightScale(d.item) + heightScale.rangeBand()/2;
						});


				// Make the dotted lines between the dots

				var linesBetween = svg.selectAll("lines.between")
					.data(data)
					.enter()
					.append("line");

				linesBetween.attr("class", "between")
					.attr("x1", function(d) {
						return margin.left + widthScale(+d.y2015);
					})
					.attr("y1", function(d) {
						return heightScale(d.item) + heightScale.rangeBand()/2;
					})
					.attr("x2", function(d) {
						return margin.left + widthScale(d.y2016);
					})
					.attr("y2", function(d) {
						return heightScale(d.item) + heightScale.rangeBand()/2;
					})
					.attr("stroke-dasharray", "5,5")
					.attr("stroke-width", function(d, i) {
						if (d.item === "World") {
							return "1";
						} else {
							return "0.5";
						}
					});


				// Make the dots for 2015

				var dots2015 = svg.selectAll("circle.y2015")
						.data(data)
						.enter()
						.append("circle");

				dots2015
					.attr("class", "y2015")
					.attr("cx", function(d) {
						return margin.left + widthScale(+d.y2015);
					})
					.attr("r", heightScale.rangeBand()/2)
					.attr("cy", function(d) {
						return heightScale(d.item) + heightScale.rangeBand()/2;
					})
					.style("fill", function(d){
						if (d.item === "World") {
							return "#333399";
						}
					})
					.append("title")
					.text(function(d) {
						return d.item + " in 2015: " + "$"+d.y2015;
					});

				// Make the dots for 2016

				var dots2016 = svg.selectAll("circle.y2016")
						.data(data)
						.enter()
						.append("circle");

				dots2016
					.attr("class", "y2016")
					.attr("cx", function(d) {
						return margin.left + widthScale(+d.y2016);
					})
					.attr("r", heightScale.rangeBand()/2)
					.attr("cy", function(d) {
						return heightScale(d.item) + heightScale.rangeBand()/2;
					})
					.style("fill", function(d){
						if (d.item === "World") {
							return "#CC0000";
						}
					})
					.append("title")
					.text(function(d) {
						return d.item + " in 2016: " + "$"+ d.y2016;
					});

					// add the axes

				svg.append("g")
					.attr("class", "xaxis")
					.attr("transform", "translate(" + margin.left + "," + height + ")")
					.call(xAxis);

				svg.append("g")
					.attr("class", "y axis")
					.attr("transform", "translate(" + margin.left + ",0)")
					.call(yAxis);


				//xaxis text
				svg.append("text")
					.attr("class", "xlabel")
        	.attr("transform", "translate(" + (margin.left + width / 2) + " ," +
        				(height + margin.bottom) + ")")
        	.style("text-anchor", "middle")
        	.attr("dy", "12")
        	.text("Price (USD)");

       	// Style one of the Y labels bold:

        // this makes one heading bold by filling in which number is ordered:
        var allYAxisLabels = d3.selectAll("g.y.axis g.tick text")[2];
        d3.select(allYAxisLabels[5]).style("font-weight", "bold");

				var allXAxisLabels = d3.selectAll("$" + widthScale.domain);
        	// You could also use tick formatting to get a $ sign on each axis tick

			});
