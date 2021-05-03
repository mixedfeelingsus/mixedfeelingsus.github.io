/* Authors: Galen Panger, Bryan Rea, Allie Wang */

var curQuestion = 8;
var dotsExpanded = false;

var sumCircles = null;
var posNegCircles = null;
var arcs = null;


//for dot occlusion 
var sumDupes, posDupes, negDupes;

//for enter animation
var delayFactor = 20;

//to keep animations consistent throughout the visualization
var shortAnimation = 300;
var longAnimation = 1000;

//allows us to set the intial slide to whatever we feel like using the curQuestion variable.
$('#slider').children().eq(curQuestion).removeClass('unselected').addClass('selected');

$('#sliderContainer').serialScroll({
        items: 'figure',
        prev: '#left',
        next: '#right',
        offset:-50, //when scrolling to photo, stop 50 before reaching it (from the left)
        start:curQuestion,
        duration: shortAnimation,
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
        	update();
        }
        
    });
   
  	var w = 620;
  	var h = 500;
  	var padding = 40;
  	
  	var minX = 0 //d3.min(data, function(d){ return d. });
  	var maxX = 600 //d3.max(data, function(d){ return d[0] });
  	
  	var minY = 0 // d3.min(sumData, function(d){ return d[1] });
  	var maxY = 1 //d3.max(sumData, function(d){ return d[1] });
  	
  	//domain = input, range = output
  	var xScale = d3.scale.linear()
  				.domain([minX, maxX])
  				.rangeRound([padding, w - padding]);
  	
  	//flip the axis
  	var yScale = d3.scale.linear()
  				.domain([minY, maxY])
  				.rangeRound([h - padding, padding]);
  				
  				
  	var color = d3.scale.linear()
  				.domain([0, 150, 150, 300, 300, 450, 450, 600]) // creates 4 ranges (0-150), (150-300), (300-450), (450, 600)
  				.range(["#9E005D", "#810D6B", "#472686", "#2E3192", "#204F9F", "#1456AA", "#0B62B2", "#0071BC"]); //(4 ranges of colors)
  
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
     	
    
    //this function will handle logic going forward... try to keep drawing logic out of the actual functions
    function update()
    {
    	updateQuestion();
		drawCircles();
		dotsExpanded = !dotsExpanded;
    }
        
    //drawSumCircles
    function drawCircles() {
		
		var circles = svg.selectAll("circle");
		
    	//if we've already drawn something, clear the drawing before updating... could do a lot here with a transition to make it look cooler.
    	if(circles){

    		circles.remove();
    	}

		var value1 = getCookieValue();
		if (value1) alert(value1);
		//calcDupes();

    	//add the circles
	    var sumCircles = svg.selectAll("circle.sum")
	    	.data(sumData[curQuestion])
	    	.enter()
	    	.append("circle")
	    		.attr("class", "sum")
		    	.attr("cx", function(d) { return xScale(d[0]); } )
		    	.attr("cy", function(d) { return yScale(d[1]); } )
		    	.attr("r", function(d, i) { return 10 * radiusMult(d, i, true); })
			    .attr("fill", function(d) { return color(d[0]); } )
				.attr("opacity", 0.0001)
				.on("mouseover", mouseover)
	    		.on("mouseout", mouseout);
	    		
	    var negCircles = svg.selectAll("circle.neg")
	    	.data(negData[curQuestion])
	    	.enter()
	    	.append("circle")
	    		.attr("class", "neg")
		    	.attr("cx", function(d) { return xScale(d[0]); } )
		    	.attr("cy", function(d) { return yScale(d[1]); } )
		    	.attr("r", function(d, i) { return 10 * radiusMult(d, i, true); })
			    .attr("fill", function(d) { return color(d[0]); } )
				.attr("opacity", 0.0001)
				.on("mouseover", mouseover)
	    		.on("mouseout", mouseout);
	    		
	    var posCircles = svg.selectAll("circle.pos")
	    	.data(posData[curQuestion])
	    	.enter()
	    	.append("circle")
	    		.attr("class", "pos")
		    	.attr("cx", function(d) { return xScale(d[0]); } )
		    	.attr("cy", function(d) { return yScale(d[1]); } )
		    	.attr("r", function(d, i) { return 10 * radiusMult(d, i, true); })
			    .attr("fill", function(d) { return color(d[0]); } )
				.attr("opacity", 0.0001)
				.on("mouseover", mouseover)
	    		.on("mouseout", mouseout);
    		
    	
    	if(!dotsExpanded)
    		sumCircles.transition()
				.duration(longAnimation)
				.delay(function(d, i) { return i * delayFactor; })
				.attr("opacity", .8);
		else{
			
		}
	    	
	   
    }
    
   
     //drawPosNegCircles
    function drawPosNegCircles() {
		
		var oldCircles = svg.selectAll("circle");
		
    	//if we've already drawn something, clear the drawing before updating... could do a lot here with a transition to make it look cooler.
    	if(oldCircles){
    		oldCircles.remove();
    	}
    	
  


    	//add the circles
	    var circles = svg.selectAll("circle.expanded")
	    	.data(posNegData[curQuestion])
	    	.enter().append("circle")
	    	.on("mouseover", mouseover)
    		.on("mouseout", mouseout);	
	    	
	    //set start point at sumScore location	
	    circles
			.attr("cx", function(d, i) { return xScale(sumData[curQuestion][i%30][0])} )
			.attr("cy", function(d, i) { return yScale(sumData[curQuestion][i%30][1])} )
			.attr("opacity", 0.0001);
   
		//transition into final location
		circles.transition()
	   		.duration(longAnimation)
			.delay(function(d, i) { return i * delayFactor; } )	
	   		.attr("cx", function(d) { return xScale(d[0]);} )
	    	.attr("cy", function(d) { return yScale(d[1]);} )
	    	.attr("r", function(d, i) { return 10 * radiusMult(d, i, true); } )
		    .attr("fill", function(d) { return color(d[0]);} )
			.attr("opacity", .8);	
    }
    
    function drawArcs()
    {
    	//add arcs first so they are behind the cirlces, initally set opacity to 0
	    arcs = svg.selectAll("path.arcs")
			.data(posNegData[curQuestion])
	    	.enter().append("path")
	    	.attr("class", "arcs")
	    	.attr("stroke-width", "1")
	    	.attr("fill", "none")
	    	.attr("opacity", 0.0001)
	    	.attr("d", function(d, i) {
			    var dx = d[0] - sumData[curQuestion][i%30][0],
			        dy = 0,
			        dr = Math.sqrt(dx * dx) * .5
			        flip = 0;
			        if(dx>=0) {flip = 1;}
			    return "M" + xScale(sumData[curQuestion][i%30][0]) + "," + yScale(sumData[curQuestion][i%30][1]) + "A" + dr + "," + dr + " 0 0," + flip +" " + xScale(d[0]) + "," + yScale(d[1]);
			});	
    }
    
    //updates the question, description, and left and right naviation arrows
    function updateQuestion()
    {
    	d3.select("#question").text(questions[curQuestion]);
		d3.select("#description").text(description[curQuestion]);
		d3.select("#overall").text(overall[curQuestion]);
		d3.select("#left a").text("\u25C0 " + left[curQuestion]);
		d3.select("#right a").text(right[curQuestion] + " \u25B6");
    }
    
	//calculate the number of duplicates for each point
	function calcDupes() {
		var currSumRow = sumData[curQuestion];
		var currPosNegRow = posNegData[curQuestion];
		sumDupes = new Array();
		negDupes = new Array();
		posDupes = new Array();

		for (var z = currSumRow.length - 1; z >= 0; z--) {
			if (!sumDupes[currSumRow[z].toString()]) sumDupes[currSumRow[z].toString()] = new Array(1, 1);
			else sumDupes[currSumRow[z].toString()][0]++;
		}
		for (var z = currPosNegRow.length - 1; z >= 0; z--) {
			if (currPosNegRow[z][0] < 300) {
				if (!negDupes[currPosNegRow[z].toString()]) negDupes[currPosNegRow[z].toString()] = new Array(1, 1);
				else negDupes[currPosNegRow[z].toString()][0]++;				
			}
			else {
				if (!posDupes[currPosNegRow[z].toString()]) posDupes[currPosNegRow[z].toString()] = new Array(1, 1);
				else posDupes[currPosNegRow[z].toString()][0]++;				
			}
		}		
	}

	//returns multiple corresponding to the number of duplicates for the dot
	function radiusMult(d, i, dotBool) {
		if (!sumDupes) return 1;
		var currDupes;
		
		var reload = false;
		if (dotBool) {
			currDupes = sumDupes;
			if (i == sumData[curQuestion].length - 1) {
				for (var i in sumDupes) sumDupes[i][1] = 1;
			}
		}
		else {
			if (d[0] < 300) currDupes = negDupes;
			else currDupes = posDupes;
			if (i == posNegData[curQuestion].length - 1) {
				for (var i in negDupes) negDupes[i][1] = 1;
				for (var i in posDupes) posDupes[i][1] = 1;
			}
		}

		// var reload = true;
		// for (var i in currDupes) {
		// 	if (currDupes[i][1] == 1) reload = false;
		// 	break;
		// }
		
		if (reload) {
			for (var i in currDupes) currDupes[i][1] = 1;
		}
		
		if (currDupes[d.toString()][1] > 0) {
			currDupes[d.toString()][1] = 0;
			if (d[1] > .33 || dotBool || currDupes[d.toString()][0] == 1) return Math.sqrt(currDupes[d.toString()][0]);
			else return Math.sqrt(currDupes[d.toString()][0]/2);
		}
		else return 0;
	}
	
	//initial draw
  	update();
	
	//exploring animation between the two data sets
	svg.on("click", update);
	
	//on mouseover, get the current dot, check to see if it's visible, add text label and increase opacity to 1 to emphasize
	function mouseover(d, i){
		
		curDot = d3.select(this);
	
		curDot.attr("opacity", 1);
		
		var label = svg.append("text")
			.text(function() { return d.x + " , " + d[1]})
			.attr("x", function() {
		    	return xScale(d[0]) +  15;})
			.attr("y", function() {
	    		return yScale(d[1]);})
			.attr("class", "label")
			.attr("opacity", 0.0001);
				
		label.transition()
			.duration(shortAnimation)
			.attr("opacity", 1);	
	}
	
	//on mouseout, get the current dot, check to see if it's visible, remove the text label and sets opacity back to normal
	function mouseout(d, i)
	{
		curDot = d3.select(this);
		
		curDot.attr("opacity", 0.8);
				
		d3.selectAll("text.label")
			.transition()
			.delay(shortAnimation)
			.duration(shortAnimation)
			.attr("opacity", 0.0001)
			.remove()
	}
	
	function transitionCircles () {
		
		posNegCircles
			.attr("cx", function(d, i) {
				return xScale(sumData[curQuestion][i%30][0])})
			.attr("cy", function(d, i) {
				return yScale(sumData[curQuestion][i%30][1])})
			.attr("opacity", 0.0001);
		
		//need to add arc to transition, move on arc path as well as draw arc trailing dot		
		posNegCircles.transition()
    		.duration(longAnimation)
    		.delay(function(d, i) { return i * delayFactor; }) // playing with a delay
    		.attr("cx", function(d) {
    			return xScale(d[0]);})
    		.attr("cy", function(d) {
    			return yScale(d[1])})
    		.attr("fill", function(d) {
		    	return color(d[0]);})
		    .attr("opacity", .8);
		 
		 //transition sum circles to small dots
		sumCircles.transition()
			.duration(longAnimation)
			.delay(function(d, i) { return i * delayFactor * 2; }) // playing with a delay
			.attr("fill", "#ccc")
			.attr("opacity", 1)
			.attr("r", 3);
		    
		 arcs.transition()
		 	.duration(longAnimation)
		 	.delay(function(d, i) { return i * delayFactor; }) // playing with a delay
		 	.attr("opacity", 1);
	}
	
	function collapseCircles() {
		
		//transition small dots back to summary circles
		sumCircles.transition()
			.duration(longAnimation)
     		.attr("fill", function(d) {
		    	return color(d[0]);})
			.attr("r", function(d, i) { return 10 * radiusMult(d, i, true); })
			.attr("opacity", .8);
		
		posNegCircles.transition()
			.duration(longAnimation)
			.attr("cx", function(d, i) {
				return xScale(sumData[curQuestion][i%30][0])})
			.attr("cy", function(d, i) {
				return yScale(sumData[curQuestion][i%30][1])})
			.attr("opacity", 0.0001);	
			
		 arcs.transition()
		 	.duration(longAnimation)
		 	.attr("opacity", 0.0001);		
	}
	
	function getCookieValue() {
			var nameEQ = "question1=";
			var cookieBits = document.cookie.split(';');
			for(var i=0;i < cookieBits.length;i++) {
				var c = cookieBits[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
	}