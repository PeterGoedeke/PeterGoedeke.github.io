var categoryIDs = ["solveQuadratic", "solveQuadraticWithRHS", "factoriseQuadratic", "expandQuadratic", "simplifyFraction", "solveFraction", "oneValueForX", "valueAtPoint", "howLongPastPoint", "whenNegative", "solveGivenVariable", "rearrangeEquations", "rearrangeWithRoot", "algebraicWordQuestions", "simplify", "rawNumeric", "exchange", "ratios", "solveConversionsToPowers", "solveRemovingBases", "powerInequalities"];

var exampleFormats = ["a, b", "a, b", "(x+a)(x+b)", "ax^2+bx-c", "(x+a)/(x+b)", "a, b", "a", "a", "a", "a>x>b", "a", "a=b+c", "(a^b)/c=d+e", "a", "(a+b)/c", "a", "a, b", "a", "a", "a, b", "a, b, c"];

(function() {
    var selectedCategory;
    var currentQuestion;
    var wildcardModeEnabled;

    function refreshDisplay(displayType) {
        let text;
        if(displayType == "question") {
            selectedCategory = wildcardModeEnabled ? Math.floor(Math.random() * categoryIDs.length) : selectedCategory;
            currentQuestion = generate.question(categoryIDs[selectedCategory]);
            text = "<div>" + currentQuestion.questionText + "</div>";
        }
        else if(displayType = "working") {
            text = "<div>" + currentQuestion.stepsOfWorking + "</div>";
        }
        document.querySelector(".displayArea").innerHTML = text;
        document.querySelector(".displayArea").style.color = "white";
        MathJax.Hub.Queue(["Typeset", MathJax.Hub], () => document.querySelector(".displayArea").style.color = "black");
        document.querySelector(".questionPaneHeading").textContent = currentQuestion.headingText;
        document.querySelector(".inputBox").placeholder = exampleFormats[selectedCategory];
        console.log(currentDifficulty);
        console.log(currentQuestion.answers);
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
        selectedCategory == 21 ? wildcardModeEnabled = true : wildcardModeEnabled = false;
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
        document.querySelector(".explanationArea").innerHTML = "<div>" + currentQuestion.explanationText + "</div>";
        document.querySelector(".explanationArea").style.color = "white";
        MathJax.Hub.Queue(["Typeset",MathJax.Hub], () => document.querySelector(".explanationArea").style.color = "black");
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