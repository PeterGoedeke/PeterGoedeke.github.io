

var questions = [generate.question("solveQuadratic"), generate.question("solveQuadraticWithRHS"), generate.question("factoriseQuadratic"), generate.question("expandQuadratic"), generate.question("simplifyFraction"), generate.question("solveFraction"), generate.question("oneValueForX"), generate.question("valueAtPoint"), generate.question("howLongPastPoint"), generate.question("whenNegative"), generate.question("solveGivenVariable"), generate.question("rearrangeEquations"), generate.question("rearrangeWithRoot"), generate.question("algebraicWordQuestions"), generate.question("simplify"), generate.question("rawNumeric"), generate.question("exchange"), generate.question("ratios"), generate.question("solveConversionsToPowers"), generate.question("solveRemovingBases"), generate.question("powerInequalities")];
questions.push(questions[0]);

var questionNames = ["Solve Quadratics", "Solve Quadratics With RHS", "Factorise Quadratics", "Expand Quadratics", "Simplify Fractions", "Solve Fractions", "Find One Value For x", "Find Value At Point", "Find Time Past Point", "Find When Quadratic Is Negative", "Solve Given Variable", "Rearrange Equations", "Rearrange Equations With Root", "Algebraic Word Questions", "Remove Common Factors", "Simple Simultaneous Equations", "Simultaneous Equations 1", "Simultaneous Equations 2", "Solve Powers", "Solve Removing Bases", "Power Inequalities", "Wildcard Questions"];

var questionExplanations = ["Solving a quadratic means finding values for x which make the equation true. An example of a quadratic equation would be $$x^2+5x+6$$ To make this equation true, the quadratic expression on the left hand side must equal 0.\nTo do this, find the two numbers which add up to equal the coefficient to x, and multiply to equal the constant.\nFor this particular quadratic, the numbers 2 and 3 add to equal 5, and multiply to equal 6.\nThe inverse of these two numbers (a.k.a. these two numbers multiplied by -1) are the solutions to the quadratic; therefore, -2 and -3 are the solutions for this quadratic.", "Quadratic equations can only be solved if the right hand side is equal to zero. This means that the only way to solve a quadratic which has a right hand size which is not equal to zero is to rearrange so that the right hand side is equal to zero. An example of a quadratic equation with a right hand side would be $$x^2-15x+58=8$$ To solve this, 8 must be subtracted from both sides to make the right hand side equal to zero. To solve from here, see the explanation for the 'Solve Quadratics' category.", "Factorising a Quadratic means converting a quadratic expression into two sets of brackets which, when expanded, are equal to the original quadratic. For example, if you expand \\((x+2)(x+1)\\), you will see that it is equal to \\(x^2+3x+2\\).To factorise a quadratic, find the two numbers which add up to equal the coefficient of x, and multiply to equal the constant. For example, the numbers 2 and 1 add to equal 3, and multiply to equal 6.The factorised quadratic is two sets of brackets which each contain x and one of these numbers. If \\(x^2\\) has a coefficient, then the process is different. Instead of finding two numbers which add to equal the coefficient of x and multiply to equal the constant, you find two numbers which add to equal the coefficient of x and multiple to equal the constant multiplied by the coefficient of \\(x^2\\). For example, if the quadratic was \\(2x^2-8x+6\\), then these numbers would be -6 and -2, as they multiply to equal 12. The next step is then to" + " break the coefficient of x up into these two values. In this example this would result in the expression \\(2x^2-2x-6x+6\\). From here, the equation can be factorised easily by finding the common factors of the first two terms, and then the common factors of the second two terms. In this example, this would result in the expression \\(2x(x-1)-6(x-1)\\). This means that you have 2x lots of (x-1) and -6 lots of (x-1). This is the same as (2x-6) lots of (x-1). Therefore, the final step is simply to finish factorising. In this example, this would result in the expression \\((2x-6)(x-1)\\).", "Expanding quadratics simply means multipling every term in the first set of brackets by every term in the second set of brackets. For example, \\((x-3)(x+2)\\) becomes \\(x^2-x-6\\).", "Simplifying a fraction simply means factorising the top half of the fraction, factorising the bottomm half of the equation, and then cancelling out the common factor which appears in the top and bottom half. For example, the fraction $$\\frac{x^2-2x-8}{x^2-x-6}$$ factorises to $$\\frac{(x-4)(x+2)}{(x-3)(x+2)}$$ Both the top and the bottom halves of the fraction contain the term (x+2), which can be cancelled out. The final answer is $$\\frac{x-4}{x-3}$$", "This is a prototype version", "Find one value for x means that you need to find the value of c which would ensure that the quadratic expression has only one solution. To find this, simply divide the coefficient of x by two and then square the result. For example, if the quadratic expression was \\(x^2-8x+c\\), the value for c would be 16. This is because \\(\\frac{-8}{2}=-4\\), and -4 squared is equal to 16.", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version"];

var exampleFormats = ["a, b", "a, b", "(x+a)(x+b)", "ax^2+bx-c", "(x+a)/(x+b)", "a, b", "a", "a", "a", "a>x>b", "a", "a=b+c", "(a^b)/c=d+e", "a", "(a+b)/c", "a", "a, b", "a", "a", "a, b", "a, b, c"];
exampleFormats.push(exampleFormats[0]);


var scrollTimeOut = setTimeout(() => $('html, body').animate({scrollTop: $(".page").offset().top}, 2000), 1500);
addEventListener("scroll", remove);
function remove(event) {
    clearTimeout(scrollTimeOut);
    removeEventListener("scroll", remove);
}

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
    currentQuestion = questions[selectedQuestion]();
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
