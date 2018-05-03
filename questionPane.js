/*
$(document).click(function(e) {
    if($(".questionPane").hasClass("visible")) {
        if(!$(event.target).closest(".questionPane").length) {
            $(".questionPane").addClass("hidden");
            $(".questionPane").removeClass("visible");
            console.log("Hiding pane");
        }
    }
});


$("li").click(function(e) {
    if($(".questionPane").hasClass("hidden")) {
        $(".questionPane").removeClass("hidden");
        $(".questionPane").addClass("visible");
        console.log("Showing pane");
    }
});
*/
var questionNames = ["Solve Quadratics", "Solve Quadratics With RHS", "Factorise Quadratics", "Expand Quadratics", "Simplify Fractions", "Solve Fractions", "Find One Value For x", "Find Value At Point", "Find Time Past Point", "Find When Quadratic Is Negative", "Solve Given Variable", "Rearrange Equations", "Rearrange Equations With Root", "Algebraic Word Questions", "Remove Common Factors", "Simple Simultaneous Equations", "Simultaneous Equations 1", "Simultaneous Equations 2", "Solve Powers", "Solve Removing Bases", "Power Inequalities", "Wildcard Questions"];

var hasScrolled = false;
$(window).scroll(function() {
    hasScrolled = true;
});
setTimeout(function() {
    if(!hasScrolled) {
        $('html, body').animate({
            scrollTop: $(".page").offset().top
        }, 2000);
    }
}, 1500);

var visible = false;
var wildcard = false;
var selectedQuestion = NaN;
var userAnswer = NaN;
var currentQuestion = NaN;

$(document).click(function(event) {
    if($(event.target).closest("li").length) {
        $(".questionPane").removeClass("hidden");
        $(".inputBox").removeClass("hidden");
        visible = true;
        currentDifficulty = 0;
        console.log(currentDifficulty);
        selectedQuestion = event.target.id;
        if(selectedQuestion == 21) wildcard = true; else wildcard = false;
        $(".questionPaneHeading").text(questionNames[selectedQuestion]);
        refreshQuestion();
        $(".inputBox input").attr("placeholder", exampleFormats[selectedQuestion]);
        $(".inputBox input").focus();
    } else if(visible) {
        if(!$(event.target).closest(".questionPane").length && !$(event.target).closest(".explanationPane").length) {
            $(".questionPane").addClass("hidden");
            visible = false;
            selectedQuestion = NaN;
        }
    }
    if($(event.target).closest(".tab").length) {
        $(".explanationArea").html("<div>" + questionExplanations[selectedQuestion] + "</div>");
        $(".explanationPane").css('color', 'white'); MathJax.Hub.Queue(["Typeset",MathJax.Hub], function() {$(".explanationPane").css('color', 'black');});
        $(".explanationPane").removeClass("hidden");
    } else if(!$(event.target).closest(".explanationPane").length) $(".explanationPane").addClass("hidden");
    if($(event.target).closest(".back").length) {
        $(".questionPane").addClass("hidden");
        visible = false;
        selectedQuestion = NaN;
    }
    if($(event.target).closest(".backe").length) $(".explanationPane").addClass("hidden");
});

$(document).keypress(function(event) {
    if(event.which == 13 && $(".inputBox input").is(":focus") && $("input").val() != '') {
        $(".inputBox").trigger('submit');
    }
});

var includes = false;
$(".inputBox").submit(function(event) {
    var userAnswer = $(".inputBox input").val().replace(/ /g, '');
    $(".inputBox input").val("");
    for(let i = 0; i < currentQuestion.answers.length; i ++) {
        if(currentQuestion.answers[i] === userAnswer) {
            includes = true;
            break;
        }
    }
    if(includes) {
        $(".inputBox input").addClass("correct");
        if(currentDifficulty < 9) currentDifficulty += 0.25;
        $(".difficultyArrow").css('bottom', (currentDifficulty / 9) * 95 + '%');
        console.log(currentDifficulty);
        setTimeout(function() {
            $(".inputBox input").removeClass("correct");
        }, 1000);
        refreshQuestion();
    } else {
        $(".displayArea").html("<div>" + currentQuestion.stepsOfWorking + "</div>");
        $(".displayArea").css('color', 'white'); MathJax.Hub.Queue(["Typeset",MathJax.Hub], function() {$(".displayArea").css('color', 'black');});
        $(".inputBox input").addClass("incorrect");
        if(currentDifficulty >= 2) currentDifficulty -= 2.25; else currentDifficulty = 0;
        $(".difficultyArrow").css('bottom', (currentDifficulty / 9) * 95 + '%');
        setTimeout(function() {
            $(".inputBox input").removeClass("incorrect");
        }, 1000);
    }
    includes = false;
    return false;
});

function refreshQuestion() {
    selectedQuestion = wildcard ? Math.floor(Math.random() * questions.length) : selectedQuestion;
    currentQuestion = questions[selectedQuestion];
    $(".displayArea").html("<div>" + currentQuestion.questionText + "</div>");
    $(".displayArea").css('color', 'white'); MathJax.Hub.Queue(["Typeset",MathJax.Hub], function() {$(".displayArea").css('color', 'black');});
    $(".inputBox input").attr("placeholder", exampleFormats[selectedQuestion]);
    console.log(currentQuestion.answers);
}

$("input").on('focus', function() {
    if($(window).width() <= 480) $(".inputBox").css('bottom', '10%');
    else $(".inputBox").css('bottom', '1%');
});
$("input").on('focusout', function() {
    $(".inputBox").css('bottom', '1%');
});

/*
function resize() {
    if(toggle) {
        questionPaneHeight = $(".questionPaneHeading").height() * 1.1 + $(".displayArea").height() * 1.35;
        if(questionPaneHeight > 150) $(".landing").css("height", questionPaneHeight + "px"); else $(".landing").css("height", 100 + "vh");
        displayAreaTopMargin = $(".questionPaneHeading").height();
    } else {
        $(".landing").css("height", 100 + "vh");
        displayAreaTopMargin = ($(".questionPane").height() - $(".displayArea").height()) / 2 - $(".questionPaneHeading").height();
    }
    $(".displayArea").css("margin-top", displayAreaTopMargin, + "px");
}
$(document).ready(resize);
window.onresize = resize;
*/

/*
$(".inputBox").keydown(function(e) {
    if(e.which == 13) {
        userAnswer = $(".inputBox").val();
        console.log(userAnswer);
        //$(".inputBox").submit();
    }
});
*/
/*
let j = 0;
function changeQuestion(id) {
    console.clear();
    id.innerHTML = "";
    for(let i = 0; i < 50; i ++){
        displayElement("ID: " + i + " Question: " + questions[j]().questionText);
        console.log("Question: " + i + " Answers: "+ questions[j]().answers);
    }
    j ++;
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}

for(let i = 0; i < 10; i ++){
    var question = solveQuadraticWithRHS();
    displayElement("ID: " + i + " Question: " + question.questionText);
    console.log("Question: " + i + " Answers: "+ question.answers);
}
function displayElement(element) {
    var equationHTML = document.createElement("p");
    equationHTML.appendChild(document.createTextNode(element));
    document.getElementById("test").appendChild(equationHTML);
}
*/
