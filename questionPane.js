(function() {
    var categoryIDs = ["solveQuadratic", "solveQuadraticWithRHS", "factoriseQuadratic", "expandQuadratic", "simplifyFraction", "solveFraction", "oneValueForX", "valueAtPoint", "howLongPastPoint", "whenNegative", "solveGivenVariable", "rearrangeEquations", "rearrangeWithRoot", "algebraicWordQuestions", "simplify", "rawNumeric", "exchange", "ratios", "solveConversionsToPowers", "solveRemovingBases", "powerInequalities"];

    var selectedCategory;
    var currentQuestion;
    var wildcardModeEnabled;

    const displayArea = document.querySelector(".displayArea");
    const inputBox = document.querySelector(".inputBox");
    const inputForm = document.querySelector(".inputForm");
    const questionPane = document.querySelector(".questionPane");
    const explanationPane = document.querySelector(".explanationPane");
    const explanationArea = document.querySelector(".explanationArea");

    //Refresh display
    function refreshDisplay(displayType) {
        setDisplayAreaText(displayType);
        refreshMathJax(displayArea);
        document.querySelector(".questionPaneHeading").textContent = currentQuestion.headingText;
        inputBox.placeholder = currentQuestion.placeholderText;
        console.log(currentQuestion.answers);
    }

    //Validate input
    inputForm.addEventListener("submit", validate);
    function validate(event) {
        event.preventDefault();
        var answeredCorrectly = markAnswer();
        inputBox.value = "";
        adjustDifficulty(answeredCorrectly);
        let displayType = answeredCorrectly ? "question" : "working";
        refreshDisplay(displayType);
    }

    //Open popup
    document.querySelector(".categories").addEventListener("click", openPopup);
    function openPopup(event) {
        if(event.target.tagName == "UL") return;
        adjustDifficulty("reset");
        checkForWildcard();
        refreshDisplay("question");
        questionPane.classList.remove("hidden");
        inputBox.focus();
    }

    //Close popup
    window.addEventListener("click", closePopup);
    function closePopup(event) {
        const closeBoth = ["categories", "page", "landing", "landingimg", "back"];
        const closeExplanation = ["displayArea", "backe"];
        if(closeBoth.includes(event.target.classList.value.toString())) {
            questionPane.classList.add("hidden");
            explanationPane.classList.add("hidden");
        } else if(closeExplanation.includes(event.target.classList.value)) {
            explanationPane.classList.add("hidden");
        }
    }

    //Open explanation pane
    document.querySelector(".tab").addEventListener("click", openExplanationPane);
    function openExplanationPane() {
        refreshExplanationDisplay();
        explanationPane.classList.remove("hidden");
    }

    //Move input for mobile devices
    inputBox.addEventListener("focus", moveInputForMobile);
    function moveInputForMobile() {
        const form = inputForm;
        if(window.outerWidth <= 480) form.style.bottom = "10%";
        else form.style.bottom = "1%";
    }
    inputBox.addEventListener("focusout", () => inputForm.style.bottom = "1%");

    //Autoscroll
    var scrollTimeOut = setTimeout(() => $('html, body').animate({scrollTop: $(".page").offset().top}, 2000), 1500);
    addEventListener("scroll", remove);
    function remove(event) {
        clearTimeout(scrollTimeOut);
        removeEventListener("scroll", remove);
    }

    function refreshMathJax(element) {
        element.style.color = "white";
        MathJax.Hub.Queue(["Typeset", MathJax.Hub], () => element.style.color = "black");
    }

    function setDisplayAreaText(displayType) {
        let text;
        if(displayType == "question") {
            selectedCategory = wildcardModeEnabled ? Math.floor(Math.random() * categoryIDs.length) : selectedCategory;
            currentQuestion = generate.question(categoryIDs[selectedCategory]);
            text = "<div>" + currentQuestion.questionText + "</div>";
        }
        else if(displayType = "working") {
            text = "<div>" + currentQuestion.stepsOfWorking + "</div>";
        }
        displayArea.innerHTML = text;
    }

    function markAnswer() {
        const userAnswer = inputBox.value.replace(/\s/g, '');
        var answeredCorrectly = !!currentQuestion.answers.includes(userAnswer);
        if(answeredCorrectly) inputBox.classList.add("correct");
        else inputBox.classList.add("incorrect");
        setTimeout(() => {inputBox.classList.remove("correct"); inputBox.classList.remove("incorrect")}, 1000);
        return answeredCorrectly;
    }

    function adjustDifficulty(answeredCorrectly) {
        if(answeredCorrectly == "reset") {
            currentDifficulty = 9;
            return;
        }
        if(answeredCorrectly) {
            if(currentDifficulty < 9) currentDifficulty += 0.25;
        } else {
            if(currentDifficulty >= 2) currentDifficulty -= 2.25;
            else currentDifficulty = 0;
        }
        document.querySelector(".difficultyArrow").style.bottom = (currentDifficulty / 9) * 95 + '%';
    }

    function checkForWildcard() {
        selectedCategory = event.target.classList.value;
        selectedCategory == 21 ? wildcardModeEnabled = true : wildcardModeEnabled = false;
    }

    function refreshExplanationDisplay() {
        explanationArea.innerHTML = "<div>" + currentQuestion.explanationText + "</div>";
        refreshMathJax(explanationArea);
    }
})();