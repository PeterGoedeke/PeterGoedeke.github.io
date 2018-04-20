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
hasScrolled = false;
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

visible = false;
wildcard = false;
selectedQuestion = NaN;
userAnswer = NaN;
currentQuestion = NaN;

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
        $(".inputBox input").val("E.g. " + exampleFormats[selectedQuestion]);
        $(".inputBox input").focus();
        $(".inputBox input").select();
    } else if(visible) {
        if(!$(event.target).closest(".questionPane").length) {
            $(".questionPane").addClass("hidden");
            visible = false;
            selectedQuestion = NaN;
        }
    }
    if($(event.target).closest(".tab").length) {
        $(".explanationArea").html("<div>" + questionExplanations[selectedQuestion] + "</div>");
        $(".explanationPane").css('color', 'lightgreen'); MathJax.Hub.Queue(["Typeset",MathJax.Hub], function() {$(".explanationPane").css('color', 'black');});
        $(".explanationPane").removeClass("hidden");
    } else $(".explanationPane").addClass("hidden");
});

$(".inputBox").submit(function(event) {
    userAnswer = $(".inputBox input").val().replace(/ /g, '');
    $(".inputBox input").val("");
    if(currentQuestion.answers.includes(userAnswer)) {
        $(".inputBox input").addClass("correct");
        if(currentDifficulty < 9) currentDifficulty += 0.25;
        $(".difficultyArrow").css('bottom', currentDifficulty / 9 * 100 - 5 + '%');
        console.log(currentDifficulty);
        setTimeout(function() {
            $(".inputBox input").removeClass("correct");
        }, 1000);
        refreshQuestion();
    } else {
        $(".displayArea").html("<div>" + currentQuestion.stepsOfWorking[currentQuestion.stepsOfWorking[currentQuestion.stepsOfWorking.length - 1]] + "</div>");
        $(".displayArea").css('color', 'red'); MathJax.Hub.Queue(["Typeset",MathJax.Hub], function() {$(".displayArea").css('color', 'black');});
        $(".inputBox input").addClass("incorrect");
        if(currentDifficulty >= 2) currentDifficulty -= 2.25; else currentDifficulty = 0;
        $(".difficultyArrow").css('bottom', currentDifficulty / 9 * 100 - 5 + '%');
        setTimeout(function() {
            $(".inputBox input").removeClass("incorrect");
        }, 1000);
    }
    return false;
});

function refreshQuestion() {
    currentQuestion = wildcard ? questions[Math.floor(Math.random() * questions.length)]() : questions[selectedQuestion]();
    $(".displayArea").html("<div>" + currentQuestion.questionText + "</div>");
    $(".displayArea").css('color', 'red'); MathJax.Hub.Queue(["Typeset",MathJax.Hub], function() {$(".displayArea").css('color', 'black');});
    console.log(currentQuestion.answers);
}

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
