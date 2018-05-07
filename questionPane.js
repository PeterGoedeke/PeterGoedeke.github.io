var categoryIDs = ["solveQuadratic", "solveQuadraticWithRHS", "factoriseQuadratic", "expandQuadratic", "simplifyFraction", "solveFraction", "oneValueForX", "valueAtPoint", "howLongPastPoint", "whenNegative", "solveGivenVariable", "rearrangeEquations", "rearrangeWithRoot", "algebraicWordQuestions", "simplify", "rawNumeric", "exchange", "ratios", "solveConversionsToPowers", "solveRemovingBases", "powerInequalities"];

var questionNames = ["Solve Quadratics", "Solve Quadratics With RHS", "Factorise Quadratics", "Expand Quadratics", "Simplify Fractions", "Solve Fractions", "Find One Value For x", "Find Value At Point", "Find Time Past Point", "Find When Quadratic Is Negative", "Solve Given Variable", "Rearrange Equations", "Rearrange Equations With Root", "Algebraic Word Questions", "Remove Common Factors", "Simple Simultaneous Equations", "Simultaneous Equations 1", "Simultaneous Equations 2", "Solve Powers", "Solve Removing Bases", "Power Inequalities", "Wildcard Questions"];

var questionExplanations = ["Solving a quadratic means finding values for x which make the equation true. An example of a quadratic equation would be $$x^2+5x+6$$ To make this equation true, the quadratic expression on the left hand side must equal 0.\nTo do this, find the two numbers which add up to equal the coefficient to x, and multiply to equal the constant.\nFor this particular quadratic, the numbers 2 and 3 add to equal 5, and multiply to equal 6.\nThe inverse of these two numbers (a.k.a. these two numbers multiplied by -1) are the solutions to the quadratic; therefore, -2 and -3 are the solutions for this quadratic.", "Quadratic equations can only be solved if the right hand side is equal to zero. This means that the only way to solve a quadratic which has a right hand size which is not equal to zero is to rearrange so that the right hand side is equal to zero. An example of a quadratic equation with a right hand side would be $$x^2-15x+58=8$$ To solve this, 8 must be subtracted from both sides to make the right hand side equal to zero. To solve from here, see the explanation for the 'Solve Quadratics' category.", "Factorising a Quadratic means converting a quadratic expression into two sets of brackets which, when expanded, are equal to the original quadratic. For example, if you expand \\((x+2)(x+1)\\), you will see that it is equal to \\(x^2+3x+2\\).To factorise a quadratic, find the two numbers which add up to equal the coefficient of x, and multiply to equal the constant. For example, the numbers 2 and 1 add to equal 3, and multiply to equal 6.The factorised quadratic is two sets of brackets which each contain x and one of these numbers. If \\(x^2\\) has a coefficient, then the process is different. Instead of finding two numbers which add to equal the coefficient of x and multiply to equal the constant, you find two numbers which add to equal the coefficient of x and multiple to equal the constant multiplied by the coefficient of \\(x^2\\). For example, if the quadratic was \\(2x^2-8x+6\\), then these numbers would be -6 and -2, as they multiply to equal 12. The next step is then to" + " break the coefficient of x up into these two values. In this example this would result in the expression \\(2x^2-2x-6x+6\\). From here, the equation can be factorised easily by finding the common factors of the first two terms, and then the common factors of the second two terms. In this example, this would result in the expression \\(2x(x-1)-6(x-1)\\). This means that you have 2x lots of (x-1) and -6 lots of (x-1). This is the same as (2x-6) lots of (x-1). Therefore, the final step is simply to finish factorising. In this example, this would result in the expression \\((2x-6)(x-1)\\).", "Expanding quadratics simply means multipling every term in the first set of brackets by every term in the second set of brackets. For example, \\((x-3)(x+2)\\) becomes \\(x^2-x-6\\).", "Simplifying a fraction simply means factorising the top half of the fraction, factorising the bottomm half of the equation, and then cancelling out the common factor which appears in the top and bottom half. For example, the fraction $$\\frac{x^2-2x-8}{x^2-x-6}$$ factorises to $$\\frac{(x-4)(x+2)}{(x-3)(x+2)}$$ Both the top and the bottom halves of the fraction contain the term (x+2), which can be cancelled out. The final answer is $$\\frac{x-4}{x-3}$$", "This is a prototype version", "Find one value for x means that you need to find the value of c which would ensure that the quadratic expression has only one solution. To find this, simply divide the coefficient of x by two and then square the result. For example, if the quadratic expression was \\(x^2-8x+c\\), the value for c would be 16. This is because \\(\\frac{-8}{2}=-4\\), and -4 squared is equal to 16.", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version"];

var exampleFormats = ["a, b", "a, b", "(x+a)(x+b)", "ax^2+bx-c", "(x+a)/(x+b)", "a, b", "a", "a", "a", "a>x>b", "a", "a=b+c", "(a^b)/c=d+e", "a", "(a+b)/c", "a", "a, b", "a", "a", "a, b", "a, b, c"];
exampleFormats.push(exampleFormats[0]);

var visible = false;
var selectedQuestion = NaN;
var userAnswer = NaN;
var currentQuestion = NaN;

(function() {
    var selectedCategory;
    var currentQuestion;
    var wildcardModeEnabled

    function refreshDisplay(displayType) {
        document.querySelector(".questionPaneHeading").textContent = questionNames[selectedCategory];
        let text;
        if(displayType == "question") {
            selectedCategory = wildcardModeEnabled ? Math.floor(Math.random() * questions.length) : selectedCategory;
            currentQuestion = generate.question(categoryIDs[selectedCategory]);
            text = "<div>" + currentQuestion.questionText + "</div>";
        }
        else if(displayType = "working") {
            text = "<div>" + currentQuestion.stepsOfWorking + "</div>";
        }
        document.querySelector(".displayArea").innerHTML = text;
        MathJax.Hub.Queue(["Typeset",MathJax.Hub], function() {$("#explanationPane").css('color', 'black');});
        document.querySelector(".inputBox").placeholder = exampleFormats[selectedCategory];
    }

    var scrollTimeOut = setTimeout(() => $('html, body').animate({scrollTop: $(".page").offset().top}, 2000), 1500);
    addEventListener("scroll", remove);
    function remove(event) {
        clearTimeout(scrollTimeOut);
        removeEventListener("scroll", remove);
    }

    document.querySelector(".inputForm").addEventListener("submit", validate);
    function validate(event) {
        event.preventDefault();
        const field = document.querySelector(".inputBox");
        const userAnswer = field.value.replace(/\s/g, '');
        field.value = "";

        let answeredCorrectly = false;
        if(currentQuestion.answers.includes(userAnswer)) answeredCorrectly = true;

        if(answeredCorrectly) {
            field.classList.add("correct");
            if(currentDifficulty < 9) currentDifficulty += 0.25;
        } else {
            field.classList.add("incorrect");
            if(currentDifficulty >= 2) currentDifficulty -= 2.25;
            else currentDifficulty = 0;
        }
        console.log(currentDifficulty);
        document.querySelector(".difficultyArrow").style.bottom = (currentDifficulty / 9) * 95 + '%';
        setTimeout(() => {field.classList.remove("correct"); field.classList.remove("incorrect")}, 1000);
        let displayType = answeredCorrectly ? "question" : "working";
        refreshDisplay(displayType);
    }

    document.querySelector(".categories").addEventListener("click", openPopup);
    function openPopup(event) {
        if(event.target.tagName == "UL") return;
        const inputBox = document.querySelector(".inputBox");
        currentDifficulty = 0;
        selectedCategory = event.target.classList.value;
        document.querySelector(".questionPaneHeading").textContent = questionNames[selectedQuestion];
        refreshDisplay("question");
        document.querySelector(".questionPane").classList.remove("hidden");
        inputBox.focus();
    }

    window.addEventListener("click", closePopup);
    function closePopup(event) {
        const closeBoth = ["categories", "page", "landing", "landingimg", "back"];
        const closeExplanation = ["displayArea", "backe"];
        if(closeBoth.includes(event.target.classList.value.toString())) {
            document.querySelector(".questionPane").classList.add("hidden");
            document.querySelector(".explanationPane").classList.add("hidden");
        } else if(closeExplanation.includes(event.target.classList.value)) {
            document.querySelector(".explanationPane").classList.add("hidden");
        }
    }

    document.querySelector(".tab").addEventListener("click", openExplanationPane);
    function openExplanationPane() {
        document.querySelector(".explanationArea").innerHTML = "<div>" + questionExplanations[selectedCategory] + "</div>";
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        document.querySelector(".explanationPane").classList.remove("hidden");
    }

    document.querySelector(".inputBox").addEventListener("focus", moveInputForMobile);
    function moveInputForMobile() {
        const form = document.querySelector(".inputForm");
        if(window.outerWidth <= 480) form.style.bottom = "10%";
        else form.style.bottom = "1%";
    }
    document.querySelector(".inputBox").addEventListener("focusout", () => document.querySelector(".inputForm").style.bottom = "1%");

})();