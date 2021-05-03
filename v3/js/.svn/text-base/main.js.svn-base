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
var longAnimation = 800;

//for keeping cookie values
var cookieArray = null;

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
  				
  	/*var color = d3.scale.quantize()
  				.domain([0,600])
  				.range(["#9E005D", "#661978", "#2E3192", "#1554A9", "#0071BC"]);*/
  				
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
    	.text("Very Negative")
    	.attr("x", xScale(0))
    	.attr("y", yScale(0) + 25)
    	.attr("text-anchor", "start");
    	
    xAxis.append("text")
    	.text("Very Positive")
    	.attr("x", xScale(w))
    	.attr("y", yScale(0) + 25)
    	.attr("text-anchor", "end");
 
 	xAxis.append("text")
 	    	.text("Neutral")
 	    	.attr("x", xScale(w/2))
 	    	.attr("y", yScale(0) + 25)
 	    	.attr("text-anchor", "middle");
	    
 	//y-axis
 	var yAxis = axes.append("g");
	yAxis.append("svg:line")
	    .attr("x1", xScale(0))
	    .attr("y1", h - padding)
	    .attr("x2", xScale(0))
	    .attr("y2", 0);
    	
    //y-axis labels
    yAxis.append("text")
    	.text("Not Mixed")
    	.attr("x", xScale(0))
    	.attr("y", yScale(0) + 15)
    	.attr("text-anchor", "start")
    	//don't really understand this rotation code but got it to work...
    	.attr("transform", "rotate(-90, 25, 475	)");
    	
    yAxis.append("text")
    	.text("Very Mixed")
    	.attr("x", xScale(w))
    	.attr("y", yScale(0) + 15)
    	.attr("text-anchor", "end")
    	//don't really understand this rotation code but got it to work...
    	.attr("transform", "rotate(-90,74, 524)");
    
    //setup for each question
    function update() {
   
        updateQuestion();
    	
    	//if we've already drawn something, clear the drawing before updating
    	if(sumCircles)
    	{
    		if(dotsExpanded)
    		{
    			sumCircles.attr("class", "fade");
    		}
    		else
    		{
    			sumCircles.attr("class", "remove");
    		}
    			
    		posNegCircles.attr("class", "remove");
    		arcs.attr("class", "remove");
    		
    		d3.selectAll("circle.fade")
    			.transition()
    			.duration(shortAnimation)
    			.attr("opacity", 0.0001)
    			.remove();
    				
    		d3.selectAll("path.remove")
    			.transition()
    			.duration(shortAnimation)
    			.attr("opacity", 0.0001)
    			.remove();
    		
    		d3.selectAll("circle.remove")
    			.transition()
    			.duration(shortAnimation)
    			.delay(function(d, i) { return i * delayFactor; })
    			.attr("cy", yScale(0))
    			.attr("opacity", 0.0001)
    			.remove();
    	}
    	
    	//add arcs first so they are behind the cirlces, initally set opacity to 0
    	 arcs = svg.selectAll("path.arcs")
			.data(posNegData[curQuestion])
	    	.enter().append("path")
	    	.attr("class", "arcs")
	    	.attr("opacity", 0.0001)
	    	.attr("d", function(d, i) {
			    var dx = d[0] - sumData[curQuestion][i%30][0],
			        dy = 0,
			        dr = Math.sqrt(dx * dx) * .5
			        flip = 0;
			        if(dx>=0) {flip = 1;}
			    return "M" + xScale(sumData[curQuestion][i%30][0]) + "," + yScale(sumData[curQuestion][i%30][1]) + "A" + dr + "," + dr + " 0 0," + flip +" " + xScale(d[0]) + "," + yScale(d[1]);
			});
	
    	//update circles to the new question
	    sumCircles = svg.selectAll("circle.sum")
	    	.data(sumData[curQuestion])
	    	.enter().append("circle")
			.attr("class", "sum")
			.attr("opacity", 0.0001)
			.attr("cx", function(d) { return xScale(d[0]); })
	    	.attr("cy", function(d) { return yScale(d[1]); })
	    	.attr("fill", function(d) { return color(d[0]); })
			.on("mouseover", mouseover)
    		.on("mouseout", mouseout);

	    posNegCircles = svg.selectAll("circle.pn")	
			.data(posNegData[curQuestion])
			.enter().append("circle")
			.attr("class", "pn")
			.attr("opacity", 0.0001)
			.on("mouseover", mouseover)
    		.on("mouseout", mouseout);
    		
		calcDupes();  	
		draw();
    }
  
        
    //assumes that update has been called to update the data
    function draw() {	    	
	    						
		if(dotsExpanded){		
		    posNegCircles
		    	.attr("cx", function(d) { return xScale(d[0]); })
		    	.attr("cy", function(d) { return yScale(d[1]); })
			    .attr("fill", function(d) { return color(d[0]); })
				.attr("opacity", 0.0001);
	    		
	    	posNegCircles.transition()
				.duration(longAnimation * 2)
				.ease("bounce")
				.delay(function(d, i) { return i * delayFactor; })
				.attr("r", function(d, i) { return 10 * radiusMult(d, i, false); })
				.attr("opacity", .8);
				
			arcs.transition()
				.duration(longAnimation)
				.delay(function(d, i) { return i * delayFactor; })
				.attr("opacity", 1);
				
			sumCircles.transition()
				.duration(longAnimation)
				.attr("fill", "#ccc")
				.attr("r", 3)
				.attr("opacity", 1);
	    }
	    else{
	    	sumCircles.transition()
				.duration(longAnimation)
				.ease("bounce")
				.delay(function(d, i) { return i * delayFactor + shortAnimation; })
				.attr("r", function(d, i) { return 10 * radiusMult(d, i, true); })
				.attr("opacity", .8);
			
			posNegCircles
				.attr("cx", function(d, i) { return xScale(sumData[curQuestion][i%30][0]) })
				.attr("cy", function(d, i) { return yScale(sumData[curQuestion][i%30][1]) })
				.attr("r", 0)
	    }

		//draw quiz circle
		var userValue = getUserValue();
		if (userValue) {
			alert(userValue);
			// quizCircle = d3.selectAll("circle")
			// 	.data(userValue)
			// 	.enter("circle")
			// 	.attr("cx", function (d) { return d[0]; })
			// 	.attr("cy", function (d) { return d[3]; })
			// 	.attr("r", 10)
			// 	.attr("fill", "black");
		}
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
	
	//initial add
  	update();
	
	//exploring animation between the two data sets
	svg.on("click", function () {
		if (!dotsExpanded) {
			expand();
		}
		else {
			collapse();
		}
		dotsExpanded = !dotsExpanded;
		
	});
	
	//on mouseover, get the current dot, check to see if it's visible, add text label and increase opacity to 1 to emphasize
	function mouseover(d, i){
		curDot = d3.select(this)
		
		//explode dot
		if(!dotsExpanded)
		{
	    
	    	posArc = svg.append("path")
			    	.attr("class", "expanded")
			    	.attr("opacity", 0.0001)
			    	.attr("d", function(){
					    var dx = posNegData[curQuestion][i][0] - sumData[curQuestion][i%30][0],
					        dy = 0,
					        dr = Math.sqrt(dx * dx) * .5
					        flip = 0;
					        if(dx>=0) {flip = 1;}
					    return "M" + xScale(sumData[curQuestion][i%30][0]) + "," + yScale(sumData[curQuestion][i%30][1]) + "A" + dr + "," + dr + " 0 0," + flip +" " + xScale(posNegData[curQuestion][i][0]) + "," + yScale(posNegData[curQuestion][i][1]);
					});
			
			negArc = svg.append("path")
			    	.attr("class", "expanded")
			    	.attr("opacity", 0.0001)
			    	.attr("d", function(){
					    var dx = posNegData[curQuestion][i + 30][0] - sumData[curQuestion][i%30][0],
					        dy = 0,
					        dr = Math.sqrt(dx * dx) * .5
					        flip = 0;
					        if(dx>=0) {flip = 1;}
					    return "M" + xScale(sumData[curQuestion][i%30][0]) + "," + yScale(sumData[curQuestion][i%30][1]) + "A" + dr + "," + dr + " 0 0," + flip +" " + xScale(posNegData[curQuestion][i + 30][0]) + "," + yScale(posNegData[curQuestion][i + 30][1]);
					});
			
			posDot = svg.append("circle")
				.attr("class", "expanded")
				.attr("cx", xScale(d[0]))
	    		.attr("cy", yScale(d[1]));
	    	
	    	negDot = svg.append("circle")
				.attr("class", "expanded")
				.attr("cx", xScale(d[0]))
	    		.attr("cy", yScale(d[1]));
				
			posDot
				.transition()
				.duration(longAnimation * 2)
				.ease("elastic", 1 + (posNegData[curQuestion][i][1]/2), .45)
	    		.attr("cx", xScale(posNegData[curQuestion][i][0]))
	    		.attr("cy", yScale(posNegData[curQuestion][i][1]))
	    		.attr("fill", color(posNegData[curQuestion][i][0]))
	    		.attr("r", 10)
			    .attr("opacity", 1);
			    
			negDot
				.transition()
				.duration(longAnimation * 2)
				.ease("elastic", 1 + (posNegData[curQuestion][i + 30][1]/2), .45)
	    		.attr("cx", xScale(posNegData[curQuestion][i + 30][0]))
	    		.attr("cy", yScale(posNegData[curQuestion][i + 30][1]))
	    		.attr("fill", color(posNegData[curQuestion][i+ 30][0]))
	    		.attr("r", 10)
			    .attr("opacity", 1);
				
			curDot.transition()
				.duration(shortAnimation)
				.attr("r", 3)
				.attr("fill", "#ccc");
				
			posArc.transition()
				.duration(shortAnimation)
				.attr("opacity", 1);
				
			negArc.transition()
				.duration(shortAnimation)
				.attr("opacity", 1);
		}
		
		else
		{			
			curDot.attr("opacity", 1);
			
			var label = svg.append("text")
				.text(function() { return d[0] + " , " + d[1]})
					
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
	}
	
	//on mouseout, get the current dot, check to see if it's visible, remove the text label and sets opacity back to normal
	function mouseout(d, i)
	{
		curDot = d3.select(this);
		
		//explode dot
		if(!dotsExpanded)
		{
			d3.selectAll("circle.expanded")
				.transition()
				.duration(shortAnimation)
				.delay(longAnimation)
				.attr("cy", yScale(0))
				.attr("opacity", .0001)
				.remove();
			
			d3.selectAll("path.expanded")
				.transition()
				.duration(shortAnimation)
				.delay(longAnimation)
				.attr("opacity", .0001)
				.remove()
			
			curDot.transition()
				.duration(longAnimation)
				.delay(longAnimation)
				.ease("bounce")
				.attr("r", 10 )
				.attr("fill", function(d) { return color(d[0]); });
		}
		
		else
		{
			curDot.attr("opacity", 0.8);
					
			d3.selectAll("text.label")
				.transition()
				.delay(shortAnimation)
				.duration(shortAnimation)
				.attr("opacity", 0.0001)
				.remove()
		}
	}
	
	function expand() {
		
		//need to add arc to transition, move on arc path as well as draw arc trailing dot		
		posNegCircles.transition()
    		.duration(longAnimation * 2)
    		.delay(function(d, i) { return i * delayFactor; })
    		.ease("bounce")
    		.attr("cx", function(d) { return xScale(d[0]); })
    		.attr("cy", function(d) { return yScale(d[1]) })
    		.attr("fill", function(d) { return color(d[0]); })
    		.attr("r", 10)
		    .attr("opacity", .8);
		 
		 //transition sum circles to small dots
		sumCircles.transition()
			.duration(longAnimation)
			.attr("fill", "#ccc")
			.attr("opacity", 1)
			.attr("r", 3);
		    
		 arcs.transition()
		 	.duration(longAnimation)
		 	.attr("display", "inline")
		 	.attr("opacity", 1);
	}
	
	function collapse() {
		
		//set radius to 0 so these pn circles don't  interfere with hover
		posNegCircles.transition()
			.duration(longAnimation)
			.attr("cx", function(d, i) { return xScale(sumData[curQuestion][i%30][0]) })
			.attr("cy", function(d, i) { return yScale(sumData[curQuestion][i%30][1]) })
			.attr("opacity", 0.0001)
			.attr("r", 0);
		
		//transition sum circles back to larger circles
		sumCircles.transition()
			.duration(longAnimation)
			.delay(shortAnimation)
			.ease("bounce")
     		.attr("fill", function(d) {
		    	return color(d[0]);})
			.attr("r", function(d, i) { return 10 * radiusMult(d, i, true); })
			.attr("opacity", .8);
			
		 arcs.transition()
		 	.duration(longAnimation)
		 	.attr("opacity", 0.0001);
	}
	
	function getCookieValue() {
		cookieVals = null;
		var nameEQ = "mixedFeelingsCookie=";
		var cookieBits = document.cookie.split(';');
		for(var i=0;i < cookieBits.length;i++) {
			var c = cookieBits[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) cookieVals = c.substring(nameEQ.length,c.length);
		}
		if (cookieVals) { 
			cookieArray = cookieVals.split(',');
		}
	}
	
	//returns null or [sum, neg, pos, ambiv]
	function getUserValue() {
		if (!cookieArray) getCookieValue();
		if (!cookieArray) return null;
		var pos = 0;
		var neg = 0;
		
		switch(curQuestion) {
			case 4: //homeless
				pos = cookieArray[8];
				neg = cookieArray[9];
				break;
			case 5: //diet
				pos = cookieArray[2];
				neg = cookieArray[3];
				break;
			case 8: //facebook
				pos = cookieArray[0];
				neg = cookieArray[1];
				break;
			case 9: //organs
				pos = cookieArray[6];
				neg = cookieArray[7];
				break;
			case 12: //romney
				pos = cookieArray[4];
				neg = cookieArray[5];
				break;
			default:
				return null;
		}
		
		pos = parseInt(pos);
		neg = parseInt(neg);
		
		return [pos-neg+300, neg, pos+300, (((neg+pos)/2)-Math.abs(neg-pos)+150)/450]; 
	}