/* Authors: Galen Panger, Bryan Rea, Allie Wang

*/

var curQuestion = 8;
var dotsExpanded = false;

var sumCircles = null;
var posNegCircles = null;

//for dot occlusion 
var sumDupes = new Array();
var posNegDupes = new Array();

//for enter animation
var delayFactor = 20;

//allows us to set the intial slide to whatever we feel like using the curQuestion variable.
$('#slider').children().eq(curQuestion).removeClass('unselected').addClass('selected');

$('#sliderContainer').serialScroll({
        items: 'figure',
        prev: '#left',
        next: '#right',
        offset:-50, //when scrolling to photo, stop 50 before reaching it (from the left)
        start:curQuestion,
        duration: 400,
        force: true,
        constant: false,
        stop: false,
        lock: false,
        cycle:true, //don't pull back once you reach the end
        jump:true, //click on the images to scroll to them
        onBefore:function(e, elem, $pane, $items, pos){
			$($items[curQuestion]).removeClass('selected').addClass('unselected');
        	$(elem).removeClass('unselected').addClass('selected');
        	curQuestion = pos;
        	drawCircles();
        }
        
    });
    

	

  	var w = 620;
  	var h = 500;
  	var padding = 40;
  	
  	
  	var minX = d3.min(sumData, function(d){ return d[0] });
  	var maxX = d3.max(sumData, function(d){ return d[0] });
  	
  	var minY = d3.min(sumData, function(d){ return d[1] });
  	var maxY = d3.max(sumData, function(d){ return d[1] });
  	
  	//domain = input, range = output
  	var xScale = d3.scale.linear()
  				.domain([0, 600])
  				.rangeRound([padding, w - padding]);
  	
  	//flip the axis
  	var yScale = d3.scale.linear()
  				.domain([0, 1])
  				.rangeRound([h - padding, padding]);
  				
  	var color = d3.scale.linear()
  				.domain([0, 600])
  				.range(["#9E005D", "#0071BC"]);
  	//old xaxis		
  	//var xAxis = d3.svg.axis().scale(xScale).ticks(6).tickSubdivide(false);
    //var yAxis = d3.svg.axis().scale(yScale).ticks(4).orient("left");
    //x axis 	
    /*svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);
    //y axis  
    svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + padding +", 0)")
        .call(yAxis);*/
  	
  	var svg = d3.select("#viz")
  		.append("svg")
  		.attr("width", w)
      	.attr("height", h);
    
    var axes = svg.append("g");
    
    //x-axis
    var xAxis = axes.append("g");
    xAxis.append("svg:line")
	    .attr("x1", xScale(0))
	    .attr("y1", yScale(0))
	    .attr("x2", xScale(w))
	    .attr("y2", yScale(0));
	    
	xAxis.append("text")
    	.text("Strongly Negative")
    	.attr("x", xScale(0))
    	.attr("y", yScale(0) + 25)
    	.attr("text-anchor", "start");
    	
    xAxis.append("text")
    	.text("Strongly Positive")
    	.attr("x", xScale(w))
    	.attr("y", yScale(0) + 25)
    	.attr("text-anchor", "end");
 
 	// xAxis.append("text")
 	//     	.text("Mixed Feelings")
 	//     	.attr("x", xScale(w/2))
 	//     	.attr("y", yScale(0) + padding / 2)
 	//     	.attr("text-anchor", "middle");
	    
 	//y-axis
 	var yAxis = axes.append("g");
	yAxis.append("svg:line")
	    .attr("x1", xScale(0))
	    .attr("y1", h - padding)
	    .attr("x2", xScale(0))
	    .attr("y2", 0);
    	
    //y-axis labels
    yAxis.append("text")
    	.text("Less Mixed")
    	.attr("x", xScale(0))
    	.attr("y", yScale(0) + 15)
    	.attr("text-anchor", "start")
    	//don't really understand this rotation code but got it to work...
    	.attr("transform", "rotate(-90, 25, 475	)");
    	
    yAxis.append("text")
    	.text("More Mixed")
    	.attr("x", xScale(w))
    	.attr("y", yScale(0) + 15)
    	.attr("text-anchor", "end")
    	//don't really understand this rotation code but got it to work...
    	.attr("transform", "rotate(-90,74, 524)");
    	
        
    //drawCircles
    function drawCircles() {
    	
    	//if we've already drawn something, clear the drawing before updating... could do a lot here with a transition to make it look cooler.
    	if(sumCircles)
    	{
    		sumCircles.remove();
    		posNegCircles.remove();
    	}

    	//add the circles
	    sumCircles = svg.selectAll("circle.sumData")
	    	.data(sumData[curQuestion])
	    	.enter().append("circle");
	    	
	    posNegCircles = svg.selectAll("circle.posNeg")	
			.data(posNegData[curQuestion])
	    	.enter().append("circle");
		
		//now put circles into place. setting opacity to 0.0001 fixes flickering problem. 0 opacity values in D3 have a bug.
		calcDupes(true); // must call this before radiusMult below    
		sumCircles.attr("class", "sumData")
	    	.attr("cx", function(d) {
	    		return xScale(d[0]);})
	    	.attr("cy", function(d) {
	    		return yScale(d[1]);})
	    	.attr("r", function(d) { return 10 * radiusMult(d, true); })
		    .attr("fill", function(d) {
		    	return color(d[0]);})
			.attr("opacity", 0.0001);
	
	    posNegCircles.attr("class", "posNeg")
	    	.attr("cx", function(d) {
	    		return xScale(d[0]);})
	    	.attr("cy", function(d) {
	    		return yScale(d[1]);})
	    	.attr("r", 10)
		    .attr("fill", function(d) {
		    	return color(d[0]);})
			.attr("opacity", 0.0001);
	
	    //determine which circles to make visible based on whether the dots are expanded or not
		if(dotsExpanded){
			posNegCircles.transition()
				.duration(1500)
				.delay(function(d, i) { return i * delayFactor; })
				.attr("opacity", .8);

			calcDupes(true);
			sumCircles.attr("fill", "#ccc")
					.attr("r", function(d) { return 3 * radiusMult(d, true); });

			sumCircles.transition()
					.duration(300)
					.attr("opacity", 1);
		}
		else{
			sumCircles.transition()
				.duration(1500)
				.delay(function(d, i) { return i * delayFactor; })
				.attr("opacity", .8);
		}				
    };
    
	//calculate the number of duplicates for each point; dupeBool is true when you are calculating dupes for summary dots
	function calcDupes(dupeBool) {
		var currRow = sumData[curQuestion];
		if (!dupeBool) currRow = posNegData[curQuestion];
		var currDupes = sumDupes;
		if (!dupeBool) currDupes = posNegDupes;
		
		for (var z = currRow.length - 1; z >= 0; z--) {
			if (!currDupes[currRow[z].toString()]) currDupes[currRow[z].toString()] = 1;
			else currDupes[currRow[z].toString()] += 1;
		}
	}

	//return the radius multiple based on the number of duplicates; before calling this you must call calcDupes
	function radiusMult(d, dupeBool) {
		var currDupes = sumDupes;
		if (!dupeBool) currDupes = posNegDupes;
		
		var rtn = Math.sqrt(currDupes[d.toString()]);
		currDupes[d.toString()]--;
		return rtn;
	}

  	drawCircles();
	
	//exploring animation between the two data sets
	svg.on("click", function () {
		if (!dotsExpanded) {
			expandCircles();
			dotsExpanded = true;
		}
		else {
			collapseCircles();
			dotsExpanded = false;
		}
	});
	
	function expandCircles () {
		
		//transition sum circles to small dots
		calcDupes(true);
		sumCircles.transition()
			.duration(1500)
			.attr("fill", "#ccc")
			.attr("opacity", 1)
			.attr("r", function(d) { return 3 * radiusMult(d, true); });
		

		posNegCircles
			.attr("cx", function(d, i) {
				return xScale(sumData[curQuestion][i%30][0])})
			.attr("cy", function(d, i) {
				return yScale(sumData[curQuestion][i%30][1])})
			.attr("opacity", 0.0001);
		
		//need to add arc to transition, move on arc path as well as draw arc trailing dot		
		posNegCircles.transition()
    		.duration(1500)
    		.attr("cx", function(d) {
    			return xScale(d[0]);})
    		.attr("cy", function(d) {
    			return yScale(d[1])})
    		.attr("fill", function(d) {
		    	return color(d[0]);})
		    .attr("opacity", .8);
	}
	
	function collapseCircles() {
		
		//transition small dots back to summary circles
		calcDupes(true);
		sumCircles.transition()
			.duration(1500)
     		.attr("fill", function(d) {
		    	return color(d[0]);})
			.attr("r", function(d) { return 10 * radiusMult(d, true); })
			.attr("opacity", .8);
		
		posNegCircles.transition()
			.duration(1500)
			.attr("cx", function(d, i) {
				return xScale(sumData[curQuestion][i%30][0])})
			.attr("cy", function(d, i) {
				return yScale(sumData[curQuestion][i%30][1])})
			.attr("opacity", 0.0001);			
	}
	
	/*circles.append("text")
		.text(function(d) { return d[0] + " , " + d[1]})
		.attr("x", 15)
		.attr("y", -10)
		.attr("class", "label")
		.attr("font-size", "11px")
		.attr("fill", "#FF5646");*/