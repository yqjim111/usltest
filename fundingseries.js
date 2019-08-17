var margin = {top: 30, bottom: 30, left: 30, right: 100}
var modulesize = 200
var w1=1200
var h1=1000
var wt = 400
var bwheight = 250 
var w = w1 - margin.left - margin.right
var h = h1 - margin.top - margin.bottom
var textpadding = 20
var titlesize = 13
var annotationsize = 10
var marginbot = 100
var gridwidth = 0.25
var thickgrid = 0.75
var years = ["2016"]
var fontface = 'helvetica'
// Adjust Colors Here
var color = ["#D07167","#C7EF77","#D87D9A","#5CE3B9","#7CEAA2","#53D0DC","#8DB6E2","#6EC4E3","#A9A7D9","#4BDBCD","#C097C8","#D089B3","#A0EE8B","#D87580","#5B9BB6", "#D07167","#C7EF77","#D87D9A"];

var num = [];
var maxnum = 0;
var minimum = 0;
var fundingnum = 0;

var svg = d3.select("#chart")
	.append("svg")
	.attr("width", w)
	.attr("height", h)
	.attr("transform", "translate("+ margin.left +", "+ margin.top +")");

var title = d3.select("#text")
	.append("title")
	.attr("width", wt)
	.attr("height", h)

d3.select("#chart")
	.attr("align","center");

d3.csv("fundingseries.csv")
    .then(function(data) {
    	// console.log(data);
			var databyName = d3.nest()
				.key(function(d) { return d.name; })
				.entries(data);
                // console.log(databyName)
            getyears(databyName);
            drawannotation(years);
            getmaximum(databyName);
            getminimum(databyName);
            getfundingnum(databyName);
            drawgrid(data);

            var fundingall = databyName.pop()
            // console.log(fundingall);


            for(var order = 0; order < databyName.length; order++){
            	// console.log(order);
            	drawchart(databyName[order], order)
            };

            drawtotalchart(fundingall);


    })
    .catch(function(error){
    })


function getyears(data){
	// console.log(years)

	var lengthdata = d3.keys(d3.values(d3.values(data[0])[1])[0]).length
	var datatemp = d3.keys(d3.values(d3.values(data[0])[1])[0]).slice(0, length - 2)

	for(var i = 0; i < datatemp.length; i ++){
		years.push(datatemp[i])
	}

}

function getTextWidth(text, fontSize, fontFace) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = fontSize + 'px ' + fontFace;
    return context.measureText(text).width;
} 


function drawannotation(data){

	var yearnum = data.length
// draw little dash at the bottom
	svg.append("g")
		.selectAll("line")
		.data(data)
		.enter()
		.append("line")
		.attr("x1", function(d, i){
			return wt + (w - wt - margin.right) / (yearnum - 1) * i;
		})
		.attr("x2", function(d, i){
			return wt + (w - wt - margin.right) / (yearnum - 1) * i;
		})
   		.attr("y1", h - marginbot)
   		.attr("y2", h - marginbot + 10)
        .attr("stroke-width", thickgrid)
        .attr("stroke", "black")

// draw years
	svg.append("g")
		.selectAll("text")
		.data(data)
		.enter()
		.append("text")
		.attr("class", "text")
		.attr("x", function(d, i){
			return wt + (w - wt - margin.right) / (yearnum - 1) * i - 10;
		})
		.attr("y", h - marginbot + 20 )
		.text(function(d, i){
			return data[i];
		})
		// .attr("text-anchor", "end")
		.attr("font-size", annotationsize + "px")

// draw summary dash
	svg.append("line")
		.attr("x1", wt + (w - wt - margin.right) / (yearnum - 1) * 0)
		.attr("x2", wt + (w - wt - margin.right) / (yearnum - 1) * 3)
   		.attr("y1", h - marginbot + 35 + titlesize)
   		.attr("y2", h - marginbot + 35 + titlesize)
        .attr("stroke-width", thickgrid)
        .attr("stroke", "black")

	svg.append("line")
		.attr("x1", wt + (w - wt - margin.right) / (yearnum - 1) * 3)
		.attr("x2", wt + (w - wt - margin.right) / (yearnum - 1) * (yearnum - 1))
   		.attr("y1", h - marginbot + 35 + titlesize)
   		.attr("y2", h - marginbot + 35 + titlesize)
        .attr("stroke-width", thickgrid)
        .attr("stroke", "black")

	svg.append("line")
		.attr("x1", wt + (w - wt - margin.right) / (yearnum - 1) * 3)
		.attr("x2", wt + (w - wt - margin.right) / (yearnum - 1) * 3)
   		.attr("y1", h - marginbot + 10 + titlesize)
   		.attr("y2", h - marginbot + 35 + titlesize)
        .attr("stroke-width", thickgrid)
        .attr("stroke", "black")

	svg.append("line")
		.attr("x1", wt + (w - wt - margin.right) / (yearnum - 1) * 0)
		.attr("x2", wt + (w - wt - margin.right) / (yearnum - 1) * 0)
   		.attr("y1", h - marginbot + 10 + titlesize)
   		.attr("y2", h - marginbot + 35 + titlesize)
        .attr("stroke-width", thickgrid)
        .attr("stroke", "black")

	svg.append("line")
		.attr("x1", wt + (w - wt - margin.right) / (yearnum - 1) * (yearnum - 1))
		.attr("x2", wt + (w - wt - margin.right) / (yearnum - 1) * (yearnum - 1))
   		.attr("y1", h - marginbot + 10 + titlesize)
   		.attr("y2", h - marginbot + 35 + titlesize)
        .attr("stroke-width", thickgrid)
        .attr("stroke", "black")

	svg.append("text")
		.attr("class", "text")
		.attr("x", wt + (w - wt - margin.right) / (yearnum - 1) * 3 / 2)
		.attr("y", h - marginbot + 35 + titlesize + 15)
		.text("ACTUAL")
		.attr("font-size", titlesize + "px")
		.attr("text-anchor", "middle")

	svg.append("text")
		.attr("class", "text")
		.attr("x", wt + (w - wt - margin.right) / (yearnum - 1) * (yearnum - 1)/2 + (w - wt - margin.right) / (yearnum - 1) * 1.5)
		.attr("y", h - marginbot + 35 + titlesize + 15)
		.text("POTENTIAL/EXPECTED/PROPOSED")
		.attr("font-size", titlesize + "px")
		.attr("text-anchor", "middle")

}



function getmaximum(data){
	// console.log(data);
	for(var i = 0; i < data.length - 1; i++){

		var datatemp = d3.values(data[i])[1][0];
		// console.log(datavalue);
		var datavalue = d3.values(datatemp).slice(0, d3.values(datatemp).length - 2)

		// console.log(datavalue)
		for (var j = 0; j < datavalue.length; j++){

			dataint = parseInt(datavalue[j])
			// console.log(dataint);

			if(dataint > maxnum){
				maxnum = dataint
			}
    	}
	}
	// console.log(maxnum);
}


function getminimum(data){
	// console.log(maxnum);
	// console.log(minimum);

	for(var i = 0; i < data.length - 1; i++){

		var datatemp = d3.values(data[i])[1][0];
		// console.log(datavalue);
		var datavalue = d3.values(datatemp).slice(0, d3.values(datatemp).length - 2)

	// 	// console.log(datavalue)
		for (var j = 0; j < datavalue.length; j++){

			dataint = parseInt(datavalue[j])
			// console.log(dataint);

			if(dataint < minimum){
				mininum = dataint
			}
    	}
	}
	// console.log(minimum);
}


function getfundingnum(data){
	fundingnum = data.length;
}


function drawtotalchart(data){

	var scalefunding = d3.scaleLinear()
	.domain([0, maxnum])
	.range([0, h / fundingnum - 10]);
	
	// console.log(scalefunding);

	sumvaluetemp = d3.values(data)[1][0];
	sumvalue = d3.values(sumvaluetemp).slice(0, d3.values(sumvaluetemp).length - 2)
	var yearnum = sumvalue.length
	// var sumvaluelength = []
	var growth = []

	console.log(sumvalue)
	var formatpercentage = d3.format(".0%")

	for(var j = 0; j < sumvalue.length - 1; j++){
		growthtemp = formatpercentage(((parseInt(sumvalue[j + 1]) - parseInt(sumvalue[j])) / parseInt(sumvalue[j])))
		growth.push(growthtemp)
	}
	console.log(growth)

	// getTextWidth(sumvalue[i], annotationsize, fontface)
	// // console.log(getComputedTextLength(sumvalue[0]))
	// for(j in sumvalue){
	// 	console.log(sumvalue[j])
	// 	console.log(getTextWidth(sumvalue[i], annotationsize, fontface))
	// }
	// console.log(sumvaluelength)

	svg.append("g")
		.selectAll("g")
		.data(sumvalue)
		.enter()
		.append("g")
		.append("rect")
		.attr("x", function(d, i){
			return wt + (w - wt - margin.right) / yearnum * i;
		})
		.attr("y", function(d, i){
			return h - scalefunding(d) - marginbot;
		})
		.attr("width", (w - wt - margin.right) / yearnum)
		.attr("height", function(d, i){
			return scalefunding(d);
		})
		.attr("fill", "black")
		.on("mouseover",function(d){

			d3.selectAll("#textDiv").remove()

			var tx = parseFloat(d3.select(this).attr("x"))
			var ty = parseFloat(d3.select(this).attr("yScale"))

			d3.select(this)
			.attr("opacity", 0.7)

			d3.select("#tooltip").style("opacity", 1);
        	var mx = event.clientX
        	var my = event.clientY

			var tooltipDiv = d3.select("#tooltip")
				.style("left", mx + "px")
				.style("top", my + "px")
				.style("background-color", "rgba(220, 220, 220, 0.8)")

        	var tooltipText = tooltipDiv.append("div").attr("id","textDiv")
			tooltipText.text("$" + d)
		})

		.on("mouseout",function(d){
	        d3.select(this)
		          .attr("opacity", 1)

		    d3.select("#tooltip").style("opacity", 0);
            d3.selectAll("#textDiv").remove()
		})

// ###draw "Sum by Year" in the left
	svg.append("text")
		.attr("class", "text")
		.attr("x", wt - textpadding)
		.attr("y", h - marginbot)
		// .attr("font-size", "20px")
		// .attr("fill", "black")
		.text("Sum by Year")
		.attr("text-anchor", "end")
		.attr("font-size", titlesize + "px")

// ### draw sum value text
	svg.append("g")
		.selectAll("text")
		.data(sumvalue)
		.enter()
		.append("text")
		.attr("class", "text")
		.attr("x", function(d, i){
			return wt + (w - wt - margin.right) / yearnum * i + (w - wt - margin.right) / yearnum / 2;
		})
		.attr("y", h - marginbot + 37)
		.text(function(d, i){
			return "$" + d;
		})
		// .attr("text-anchor", "end")
		.attr("font-size", annotationsize + "px")
		.attr("text-anchor", "middle")

	svg.append("g")
		.selectAll("text")
		.data(growth)
		.enter()
		.append("text")
		.attr("class", "text")
		.attr("x", function(d, i){
			return wt + (w - wt - margin.right) / yearnum * (i + 1) + (w - wt - margin.right) / yearnum / 2;
		})
		.attr("y", h - marginbot + 15)
		.text(function(d, i){
			return d;
		})
		// .attr("text-anchor", "end")
		.attr("font-size", annotationsize + "px")
		.attr("fill", "grey")
		.attr("text-anchor", "middle")
}




function drawgrid(data){
	
	var datatemp = d3.values(data)[0];
	var datavalue = d3.values(datatemp).slice(0, d3.values(datatemp).length - 1)

	var fundingnum = data.length
	var yearnum = datavalue.length - 1

	// console.log(yearnum)

	for(var i = 0; i < data.length - 1; i++){
	// console.log(datavalue);

		svg.append("line")
   		.attr("x1", wt)
   		.attr("x2", w - margin.right)
   		.attr("y1", (h - bwheight) / fundingnum * i + margin.top)
   		.attr("y2", (h - bwheight) / fundingnum * i + margin.top)
        .attr("stroke-width", gridwidth)
        .attr("stroke", "#858585")
	}


	for(var j = 0; j < yearnum + 1; j++){
		svg.append("line")
   		.attr("x1", wt + (w - wt - margin.right) / yearnum * j)
   		.attr("x2", wt + (w - wt - margin.right) / yearnum * j)
   		.attr("y1", 0)
   		.attr("y2", h - marginbot)
        .attr("stroke-width", gridwidth)
        .attr("stroke", "#858585")

    }
		svg.append("line")
   		.attr("x1", wt)
   		.attr("x2", wt)
   		.attr("y1", 0)
   		.attr("y2", h - marginbot)
        .attr("stroke-width", gridwidth * 2)
        .attr("stroke", "black")


}


function drawchart(data, order){

	// console.log(data)

	var scalefunding = d3.scaleLinear()
		.domain([minimum, maxnum])
		.range([0, h / fundingnum - 10]);

	var datatemp = d3.values(data)[1][0];
	var datavalue = d3.values(datatemp).slice(0, d3.values(datatemp).length - 2)
	var texttemp = d3.values(datatemp).slice(d3.values(datatemp).length - 2, d3.values(datatemp).length - 1)
	var textinfo = texttemp[0];
	var fundingInt = []
	// var maxfunding = d3.max(datavalue)
	// console.log(maxfunding)
	for(i in datavalue){
		dataint = parseInt(datavalue[i])
		fundingInt.unshift(dataint)
	}
	var maxfunding = d3.max(fundingInt)
	// console.log(maxfunding)
	// console.log(textinfo)
	var yearnum = datavalue.length
	// console.log(datatemp)
	// console.log(yearnum);
	 // if(typeof parseInt(k) == 'number'){
		// console.log(" is a number ");
	 // }else{
		// console.log(" is not a number ");
	 // }
	svg.append("g")
		.selectAll("g")
		.data(datavalue)
		.enter()
		.append("g")
		.append("rect")
		.attr("x",function(d, i){
			return wt + (w - wt - margin.right) / yearnum * i;
		})
		.attr("y", function(d, i){
			return -0.5 * scalefunding(d) + (h -bwheight) / fundingnum * order + margin.top
		})
		.attr("width", (w - wt - margin.right) / yearnum)
		.attr("height", function(d, i){
			return scalefunding(d)
		})
		.attr("fill", function(d, i){
			return color[order];
		})
		.on("mouseover",function(d){

			var tx = parseFloat(d3.select(this).attr("x"))
			var ty = parseFloat(d3.select(this).attr("yScale"))

			d3.select(this)
			.attr("opacity", 0.7)

			d3.select("#tooltip").style("opacity", 1);
        	var mx = event.clientX
        	var my = event.clientY
       		d3.selectAll("#textDiv").remove()
			var tooltipDiv = d3.select("#tooltip")
				.style("left", mx + "px")
				.style("top", my + "px")
				.style("background-color", "rgba(220, 220, 220, 0.8)")

        	var tooltipText = tooltipDiv.append("div").attr("id","textDiv")
			tooltipText.text("$" + d)
		})

		.on("mouseout",function(d){
	        d3.select(this)
		          .attr("opacity", 1)

		    d3.select("#tooltip").style("opacity", 0);
            d3.selectAll("#textDiv").remove()
		})
// draw index on the left

		svg.append("text")
			.attr("class", "text")
			.attr("x", wt - textpadding)
			.attr("y", titlesize / 2 + (h - bwheight) / fundingnum * order + margin.top)
			// .attr("font-size", "20px")
			// .attr("fill", "black")
			.text(textinfo)
			.attr("text-anchor", "end")
			.attr("font-size", titlesize + "px")


		svg.append("text")
			.attr("class", "text")
			.attr("x", w - margin.right + 20)
			.attr("y", annotationsize/2 + (h - bwheight) / fundingnum * order + margin.top)
			// .attr("font-size", "20px")
			// .attr("fill", "black")
			.text("$" + maxfunding)
			.attr("text-anchor", "start")
			.attr("font-size", annotationsize + "px")

		svg.append("line")
	   		.attr("x1", w - margin.right + 15)
	   		.attr("x2", w - margin.right + 15)
	   		.attr("y1", (h - bwheight) / fundingnum * order + margin.top - scalefunding(maxfunding) / 2)
	   		.attr("y2", (h - bwheight) / fundingnum * order + margin.top + scalefunding(maxfunding) / 2)
	        .attr("stroke-width", gridwidth * 2)
	        .attr("stroke", "black")

		svg.append("line")
	   		.attr("x1", w - margin.right + 13)
	   		.attr("x2", w - margin.right + 17)
	   		.attr("y1", (h - bwheight) / fundingnum * order + margin.top + scalefunding(maxfunding) / 2)
	   		.attr("y2", (h - bwheight) / fundingnum * order + margin.top + scalefunding(maxfunding) / 2)
	        .attr("stroke-width", gridwidth * 2)
	        .attr("stroke", "black")

		svg.append("line")
	   		.attr("x1", w - margin.right + 13)
	   		.attr("x2", w - margin.right + 17)
	   		.attr("y1", (h - bwheight) / fundingnum * order + margin.top - scalefunding(maxfunding) / 2)
	   		.attr("y2", (h - bwheight) / fundingnum * order + margin.top -scalefunding(maxfunding) / 2)
	        .attr("stroke-width", gridwidth * 2)
	        .attr("stroke", "black")
// draw horizontalGrid

}