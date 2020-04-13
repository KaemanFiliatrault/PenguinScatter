var studentPromise = d3.json("classData.json")

studentPromise.then(
    function(students)
    {
        console.log(students);
        loadButtons(students);
        displaySpread(students,getHwMean,getFinalGrade, "Quiz Mean: ", "HW Mean: ");
    },
    function(err)
    {
        console.log("didnt work");
    })


var displaySpread = function(students,xFunction, yFunction, tooltipX, tooltipY)
{
        var width = 550;
        var height = 300;
    
    var svg = d3.select("#spread #graph")
        .attr("width", width)
        .attr("height",height)
        .attr("id","graph")
    var padding = 20;
    var xScale = d3.scaleLinear()
                .domain([ 
                            d3.min(students,xFunction),
                            d3.max(students,xFunction)
                        ])
                .range([padding,width-padding]);
    var yScale = d3.scaleLinear()
                .domain([
                            d3.min(students,yFunction),
                            d3.max(students,yFunction)
                        ])
                .range([height- padding,padding])
    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    svg.selectAll("circle")
        .data(students)
        .enter()
        .append("circle")
        .attr("class", function(student)
            {
                if (getGrade(student) <= 70)
                {
                    return "failing"
                }
                else{
                    return "passing"
                }
            })
        .attr("cx", function(student)
        {
            return xScale(xFunction(student));
        })
        .attr("cy", function(student)
        {
            return yScale(yFunction(student));
        })
        .attr("r", 3)
        .on("mouseover", function(student)
        {
            var xPosition = d3.event.PageX;
            var yPosition = d3.event.PageY;
            d3.select("#tooltip")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px")
            d3.select("#tooltip #functionx")
                .text(tooltipX + xFunction(student))
            d3.select("#tooltip #functiony")
                .text(tooltipY + yFunction(student))
            d3.select("#tooltip #pengPic")
                .attr("src", getImage(student))
            d3.select("#tooltip").classed("hidden",false)
                       
        })
        .on("mouseout", function(){
            d3.select("#tooltip").classed("hidden", true);  
        })
}
var clearGraph = function()
{
    d3.selectAll("#spread #graph")
        .remove();
    d3.select("#spread")
        .append("svg")
        .attr("id", "graph")
    console.log("graph cleared")
}

var loadButtons = function(students)
{
    var FvHButton = drawButton(0,0, "Final vs Hw Mean", "FvH")
    d3.select("#FvH")
        .on("click", function()
        {
            console.log("click");
            clearGraph();
             d3.select("#spread h2")
                .text("Grade on Final vs HW Average")
            displaySpread(students,getHwMean,getFinalGrade,"Hw Mean: ","Final Grade: ");
            console.log("graph displayed")
        })
    var HvQButton = drawButton(125,0, "HW Mean vs Quiz Mean","HvQ")
    d3.select("#HvQ")
        .on("click", function()
        {
            console.log("click");
            clearGraph();
            d3.select("#spread h2")
                .text("HW Average vs Quiz Average")
            displaySpread(students,getQuizMean,getHwMean,"Quiz Mean: ", "HW Mean: ");
           
        })
    var TvFButton = drawButton(250,0,"Test Mean vs Final Mean","tvF")
    d3.select("#tvF")
        .on("click", function()
        {
            console.log("click");
            clearGraph();
            d3.select("#spread h2")
                .text("Test Average vs Cummulative Grade")
            displaySpread(students,getTestMean,getGrade,"Test Mean: ", "Class Grade: ");
           
        })
    var TvQButton = drawButton(375,0,"Test Mean vs Quiz Mean","TvQ")
    d3.select("#TvQ")
        .on("click", function()
        {
            console.log("click");
            clearGraph();
            d3.select("#spread h2")
                .text("Test Average vs Quiz Average")
            displaySpread(students,getTestMean,getQuizMean,"Test Mean: ", "Quiz Mean: ");
           
        })
}
var drawButton = function(x,y,text,id)
{
    console.log("button made")
    var svg = d3.select("#spread #buttons")
        .append("rect")
        .attr("x", x)
        .attr("y", y)
        .attr("width","125")
        .attr("height","50")
        .attr("id", id)
        .attr("stroke", "black")
        .attr("fill", "grey")
    var svg = d3.select("#spread #buttons")
        .append("text")
            .attr("x",x + 5)
            .attr("y",y + 40)
            .text(text)
            .attr("font-size", "11")
            .attr("fill", "white")
}
var getFinalGrade = function(student)
{
    return student.final[0].grade;
    
}
var getHwMean = function(student)
{
    homework = student.homework;
    hwGrades = homework.map(function(hw){return hw.grade});
    meanGrade = d3.mean(hwGrades);
    return Math.round(meanGrade);
}
var getTestMean = function(student)
{
    tests = student.test;
    testGrades = tests.map(function(test){return test.grade});
    meanGrade = d3.mean(testGrades);
    return Math.round(meanGrade);
}
var getQuizMean = function(student)
{
    quizes = student.quizes;
    quizeGrades = quizes.map(function(quize){return quize.grade});
    meanGrade = d3.mean(quizeGrades);
    return Math.round(meanGrade);
}
var getGrade = function(student)
{
    
    quizMean = getQuizMean(student)*10 *.20;
    hwMean = getHwMean(student)*2 * .15;
    testMean = getTestMean(student)*.30;
    final = getFinalGrade(student)*.35;
    return Math.round(quizMean+hwMean+testMean+final);
}
var getImage = function(student)
{
                 
    console.log(student);
    pictureLink = student.picture;
    picture = "/PenguinScatter/imgs/" + pictureLink;
    console.log(picture)
    return picture;
}