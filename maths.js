"use strict";

var currentDifficulty = 0;

var format = (function() {
    var evaluatePlus = (term) => term > 0 ? "+" + term : term;
    var wrapLatex = (term, block) => block ? `\$\$${term}\$\$` : `\\(${term}\\)`;
    var hideIfOne = (term, addPlus = true) => {
        var value;
        if(term == 1) value = addPlus ? "+" : "";
        else if(term == -1) value = "-";
        else value = addPlus ? evaluatePlus(term) : term;
        return value;
    };
    return {
        evaluatePlus: evaluatePlus,
        wrapLatex: wrapLatex,
        hideIfOne: hideIfOne,
        asQuadratic: (quadratic, wrap = true) => wrap ? `\\(${hideIfOne(quadratic.a, false)}x^2${hideIfOne(quadratic.b)}x${evaluatePlus(quadratic.c)}\\)` : `${hideIfOne(quadratic.a, false)}x^2${hideIfOne(quadratic.b)}x${evaluatePlus(quadratic.c)}`,
        asfQuadratic: (wrap = true) => `\\((${hideIfOne(a, false)}x${evaluatePlus(step)})(x${evaluatePlus(answer2)})\\)`
    }
})();

var random = (function() {
    const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
    var lastGeneratedLetter = "a";
    const NAMES = ["Thanh", "Clifton", "Vincent", "Len", "Orlando", "Marcel", "Christoper", "Granville", "Brenton", "Buford", "Jerry", "Michal", "Corey", "Simon", "Marvin", "Gerry", "Rufus", "Darrell", "Benton", "Jonathon", "Gerardo", "Deangelo", "Gabriel", "Bill", "Carol", "Demetrius", "Sammie", "Wendell", "Tim", "Jermaine", "Trey", "Scott", "Jamar", "Jacob", "Gus", "Alvaro", "Luther", "Weston", "Rodolfo", "Mac", "Branden", "Julio", "Royce", "Malcolm", "Ramiro", "Kelvin", "Elliot", "Ethan", "Waldo", "Joesph"];
    var lastGeneratedName = "Thanh";
    var lastGeneratedNumber = 2;
    var coinflip = () => Math.random() > 0.5;
    return {
        letter: function() {
            do {
                var letter = ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
            } while(letter == lastGeneratedLetter);
            lastGeneratedLetter = letter;
            return letter;
        },
        name: function() {
            do {
                name = NAMES[Math.floor(Math.random() * NAMES.length)];
            } while(name == lastGeneratedName);
            lastGeneratedName = name;
            return name;
        },
        number: function(lower, upper, negativesEnabled, selectedType, chanceOfOne) {
            if (Math.random() < chanceOfOne) return 1;
            var number = 0;
            do {
                if(selectedType == "scaling" || selectedType == "scalingEven") {
                    number = Math.floor(Math.abs(Math.random() - Math.random()) * (1 + upper - lower) + lower);
                } else {
                    number = Math.floor(Math.random() * (upper - lower + 1) + lower);
                }
                if(negativesEnabled && coinflip()) number *= -1;
                if(selectedType == "even" || selectedType == "scalingEven") number ++;
            } while(Math.abs(number) == Math.abs(lastGeneratedNumber));
            lastGeneratedNumber = number;
            return number;
        },
        coinflip: coinflip
    }
})();
//rewrite
function scalingRange(trueLower, trueUpper, isLower) {
    var isLower = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var lower = 0; var upper = 0;
    if (currentDifficulty <= 5) lower = trueLower; else lower = trueLower + (trueUpper - trueLower) / 10 * (currentDifficulty - 5);
    upper = (trueUpper + trueLower) / 2 + (trueUpper - trueLower) / 20 * currentDifficulty;
    return isLower ? lower : upper;
}

//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
//Quadratic algorithms---------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------

//---------------------------
//Primary algorithms---------
//---------------------------

var generate = (function() {
    var quadraticFormula = (a, b, c) => [(-1 * b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a), (-1 * b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a)];
    var stockRandom = () => random.number(scalingRange(2, 10), scalingRange(2, 10, false), true);
    var stockQuadratic = () => rawQuadratic(stockRandom(), stockRandom());

    function rawQuadratic(answer1, answer2, a = random.number(scalingRange(1, 5), scalingRange(1, 5, false), false, "scaling", 0.2)) {
        var b = -1 * (a * (answer1 + answer2));
        var step = -1 * a * answer1
        var c = a * answer1 * answer2;
        var complexWorking = a == 1 ? false : true;
        var step1 = answer1; var step2 = answer2;
        if(complexWorking) {
            var step = a * c;
            var i = 1;
            while(step1 * step2 != step) {
                i++;
                step1 = answer1 * i; step2 = answer2 * i;
            }
            step1 *= -1; step2 *= -1;
        }
        return {
            a: a, b: b, c: c, step: step,
            answer1: answer1, answer2: answer2,
            workingAnswer1: step1, workingAnswer2: step2,
            workingIndex: complexWorking ? 1 : 0
        };
    }
    function rawQuadraticFraction() {
        var commonAnswer = stockRandom(); var answerNumerator = stockRandom();
        var answerDenominator = stockRandom();
        while(Math.abs(answerDenominator) == Math.abs(commonAnswer) || Math.abs(answerDenominator) == Math.abs(answerNumerator)) {
            answerDenominator = stockRandom();
        }
        var numeratorQuadratic = rawQuadratic(commonAnswer, answerNumerator, 1);
        var denominatorQuadratic = rawQuadratic(commonAnswer, answerDenominator, 1);
        return [numeratorQuadratic, denominatorQuadratic]
    }

    var [quadratic, _quadratic, _factor1, _factor2, _answer1, _answer2] = [];
    function reloadQuadratics() {
        quadratic = stockQuadratic();
        _quadratic = format.asQuadratic(quadratic);
        [_factor1, _factor2] = [quadratic.answer1 * -1, quadratic.answer2 * -1];
        [_answer1, _answer2] = [quadratic.answer1, quadratic.answer2];
    }

    return {
        solveQuadratic: function() {
            reloadQuadratics();
            var questionType = random.coinflip();

            var questionText = "";
            if(questionType) questionText = `Solve ${_quadratic} ${format.wrapLatex("=0")}`
            else questionText = `Give the x-coordinates of the points where the graph of ${format.wrapLatex("y =")}${_quadratic} cuts the x-axis.`

            var aValueIsOneWorking = `${_quadratic}\n(1) Find the two numbers which add to equal the coefficient of x and multiply to equal the constant. These are ${_factor1} and ${_factor2}\n(2) Multiply these numbers by negative 1 to get your answers, ${_answer1} and ${_answer2}.`;

            const AC = quadratic.a * quadratic.c;
            var aValueIsNotOneWorking = `${_quadratic}\n
                (1) Find the product of the coefficient of ${format.wrapLatex("x^2")} and the constant, ${AC}\n
                (2) Find the two numbers which add to equal the coefficient of x and multiply to equal this new number, ${quadratic.workingAnswer1} and ${quadratic.workingAnswer2}\n
                (3) Split the coefficient of x into these two numbers, ${format.wrapLatex(quadratic.a + "x^2" + format.hideIfOne(quadratic.workingAnswer1, false) + "x" + format.hideIfOne(quadratic.workingAnswer2, false) + "x" + format.evaluatePlus(quadratic.c))}\n
                (4) Factorise the first two terms and the last two terms, ${format.wrapLatex(quadratic.a + "x(x" + format.evaluatePlus(quadratic.workingAnswer1 / quadratic.a) + ")" + format.evaluatePlus(quadratic.workingAnswer2) + "(x" + format.evaluatePlus(quadratic.c / quadratic.workingAnswer2))}\n
                (5) Finish factorisation, ${format.wrapLatex("(" + quadratic.a + "x" + format.evaluatePlus(quadratic.workingAnswer2) + ")(x" + format.evaluatePlus(_factor2) + ")")}\n
                (6) Find the values for x which make a set of brackets equal to 0. These are ${_answer1} and ${_answer2}\n
                (7) These are your answers.`;

            return {
                questionText: questionText,
                answers: [`${_answer1},${_answer2}`, `${_answer2},${_answer1}`],
                stepsOfWorking: quadratic.a == 1 ? aValueIsOneWorking : aValueIsNotOneWorking
            };
        },
        factoriseQuadratic: function() {
            reloadQuadratics();
            var questionType = random.number(0, 3);
            
            var questionText = "";
            if(questionType == 0) questionText = `Factorise ${_quadratic}`;
            else if(questionType == 1) questionText = `The area of a rectangle is ${_quadratic}, what are the lengths of the sides in terms of x?`;
            else if(questionType == 2) questionText = `A rectangle has the area of ${_quadratic}, state the width and length of this rectangle in terms of x.`;
            else questionText = `The area of a rectangle can be represented by ${_quadratic}, what are the lengths of the sides in terms of x?`;
            
            var answers = quadratic.a == 1 ? [`(x${format.evaluatePlus(_factor1)})(x${format.evaluatePlus(_factor2)})`,
            `(x${format.evaluatePlus(_factor2)})(x${format.evaluatePlus(_factor1)})`] : 
            [`(${quadratic.a}x${format.evaluatePlus(quadratic.workingAnswer2)})(x${format.evaluatePlus(_factor1)})`,
            `(x${format.evaluatePlus(_factor1)})(${quadratic.a}x${format.evaluatePlus(quadratic.workingAnswer2)})`,
            `(${quadratic.a}x${format.evaluatePlus(quadratic.workingAnswer1)})(x${format.evaluatePlus(_factor2)})`,
            `(x${format.evaluatePlus(_factor2)})(${quadratic.a}x${format.evaluatePlus(quadratic.workingAnswer1)})`];

            const AC = quadratic.a * quadratic.c;
            var stepsOfWorking = quadratic.a == 1 ? `${_quadratic}\n
            (1) Find the two numbers which add to equal the coefficient of x and the constant. These are ${_factor1} and ${_factor2}\n
            (2) Put each number in a set of brackets with x, ${format.wrapLatex("(x" + format.evaluatePlus(_factor1) + ")(x" + format.evaluatePlus(_factor2) + ")")}\n
            (3) This is your answer.` : 
            `${_quadratic}\n
            (1) Find the product of the coefficient of ${format.wrapLatex("x^2")} and the constant, ${AC}\n
            (2) Find the two numbers which add to equal the coefficient of x and multiply to equal this new number, ${quadratic.workingAnswer1} and ${quadratic.workingAnsewr2}\n
            (3) Split the coefficient of x into these two numbers, ${format.wrapLatex(quadratic.a + "x^2" + format.hideIfOne(quadratic.workingAnswer1, false) + format.hideIfOne(quadratic.workingAnswer2) + "x" + format.evaluatePlus(quadratic.c))}\n
            (4) Factorise the first two terms and the last two terms, ${format.wrapLatex(quadratic.a + "x(x" + format.evaluatePlus(quadratic.workingAnswer1 / quadratic.a) + ")" + format.evaluatePlus(quadratic.workingAnswer2) + "(x" + format.evaluatePlus(quadratic.c / quadratic.workingAnswer2) + ")")}\n
            (5) Finish factorisation, ${format.wrapLatex("(" + quadratic.a + "x" + format.evaluatePlus(quadratic.workingAnswer2) + ")(x" + format.evaluatePlus(_factor1) + ")")}\n
            (6) This is your answer.`;            
            return {
                questionText: questionText,
                answers: answers,
                stepsOfWorking: stepsOfWorking
            };
        },
        simplifyFraction: function() {
            var quadraticFraction = rawQuadraticFraction();
            var numeratorQuadratic = quadraticFraction[0];
            var denominatorQuadratic = quadraticFraction[1];
            var questionText = `Simplify \\(\\frac\{${format.asQuadratic(numeratorQuadratic.a, numeratorQuadratic.b, numeratorQuadratic.c, false)}\}\{${format.asQuadratic(denominatorQuadratic.a, denominatorQuadratic.b, denominatorQuadratic.c, false)}\}\\)`;
            var answer = `(x${format.evaluatePlus(numeratorQuadratic.answer2 * -1)})/(x${format.evaluatePlus(denominatorQuadratic.answer2 * -1)})`;
            return {
                questionText: questionText,
                answers: [answer],
                stepsOfWorking: [`This is a prototype version. The answer is ${answer}`, 0]
            }
        },
        solveFraction: function() {
            var quadraticFraction = rawQuadraticFraction();
            var numeratorQuadratic = quadraticFraction[0];
            var denominatorQuadratic = quadraticFraction[1];
            numeratorQuadratic.answer2 = Math.abs(numeratorQuadratic.answer2); denominatorQuadratic.answer2 = Math.abs(denominatorQuadratic.answer2);
            var lower = (numeratorQuadratic.answer2 - denominatorQuadratic.answer2) > 0 ? (numeratorQuadratic.answer2 + 1) : (denominatorQuadratic.answer2 + 1);
            var answer1 = random.number(lower, 10, false, "even");
            var rhsNumerator = answer1 - numeratorQuadratic.answer2;
            var rhsDenominator = answer1 - denominatorQuadratic.answer2;
            var rhsNumeratorContainsX = true;
            for(let i = 1;; i++) {
                var rhsNewNumerator = rhsNumerator * i;
                var rhsNewDenominator = rhsDenominator * i;
                if(Math.abs(rhsNewNumerator % answer1) == 0) {
                    rhsNumerator = rhsNewNumerator / answer1;
                    rhsNumeratorContainsX = true;
                    rhsDenominator = rhsNewDenominator;
                    break;
                }
                if(Math.abs(rhsNewDenominator % answer1) == 0) {
                    rhsDenominator = rhsNewDenominator / answer1;
                    rhsNumeratorContainsX = false;
                    rhsNumerator = rhsNewNumerator;
                    break;
                }
            }

            var answer2 = rhsNumeratorContainsX ? quadraticFormula(rhsNumerator, denominatorQuadratic.answer2 * rhsNumerator * -1 - rhsDenominator, rhsDenominator * numeratorQuadratic.answer2) : quadraticFormula(rhsDenominator, numeratorQuadratic.answer2 * rhsDenominator * -1 - rhsNumerator, rhsNumerator * denominatorQuadratic.answer2);
            answer2 = answer1 == answer2[0] ? answer2[1] : answer2[0];
            
            rhsNumeratorContainsX ? rhsNumerator = format.hideIfOne(rhsNumerator, false) + "x" : rhsDenominator = format.hideIfOne(rhsDenominator, false) + "x";
            var questionText = `Solve \\(\\frac\{${format.asQuadratic(numeratorQuadratic.a, numeratorQuadratic.b, numeratorQuadratic.c, false)}\}\{${format.asQuadratic(denominatorQuadratic.a, denominatorQuadratic.b, denominatorQuadratic.c, false)}\}=\\frac\{${rhsNumerator}\}\{${rhsDenominator}\}\\)`;
            return {
                questionText: questionText,
                answers: [answer1 + "," + answer2, answer2 + "," + answer1],
                stepsOfWorking: [`This is a prototype version. The answers are ${answer1} and ${answer2}`, 0]
            };
        },
        expandQuadratic: function() {
            
        }
    };
})();

function expandQuadratic() {
    var x = createFQuadratic(quadraticRandom(), quadraticRandom());
    return {
        questionText: "Expand " + renderFQuadratic(x.a, x.step, x.answer2),
        answers: [hideIfOne(x.a) + "x^2" + hideIfOne(x.b, false) + "x" + evaluatePlus(x.c * -1, false)],
        stepsOfWorking: ["This is a prototype version\n" + (hideIfOne(x.a) + "x^2" + hideIfOne(x.b, false) + "x" + evaluatePlus(x.c * -1, false)), 0]
    };
}

function oneValueForX() {
    var x = createQuadratic(random(scalingRange(2, 10), scalingRange(2, 10, false), true, 2), random(scalingRange(2, 10), scalingRange(2, 10, false), true, 2));
    return {
        questionText: randomName() + " is trying to find a value for c so that " + wrapLatex(hideIfOne(x.a) + "x^2" + hideIfOne(x.b, false) + "x + c") + " has only one solution for x. Give the value of c.",
        answers: [Math.pow(x.b / 2, 2).toString()],
        stepsOfWorking: ["This is a prototype version\n" + Math.pow(x.b / 2, 2), 0]
    };
}

function valueAtPoint() {
    var x = createQuadratic(quadraticRandom(), quadraticRandom());
    var point = random(0, 4, true);
    return {
        questionText: "A parabola has the equation: " + wrapLatex(hideIfOne(x.a) + "x^2" + hideIfOne(x.b, false) + "x" + evaluatePlus(x.c)) + ". What is the value of y when x = " + point + "?",
        answers: [(x.a * Math.pow(point, 2) + x.b * point + x.c).toString()],
        stepsOfWorking: ["This is a prototype version\n" + (x.a * Math.pow(point, 2) + x.b * point + x.c), 0]
    };
}

function solveQuadraticWithRHS() {
    var x = createQuadratic(random(scalingRange(5, 10), scalingRange(5, 10, false), true, 1), random(scalingRange(5, 10), scalingRange(5, 10, false), true));
    var rhs = random(1, 150);
    x.c = x.c + rhs;
    return {
        questionText: "A rectangle has an area of " + renderQuadratic(x.a, x.b, x.c) + ". If the area of the rectangle is " + rhs + ", what is the value(s) of x?",
        answers: [x.answer1 + "," + x.answer2, x.answer2 + "," + x.answer1],
        stepsOfWorking: [renderQuadratic(x.a, x.b, x.c) + "\\(=" + rhs + "\\) \n1. Quadratics can only be solved if the right hand side is equal to 0. Therefore, the first step is to rearrange by subtracting " + rhs + " from both sides.\n" + renderQuadratic(x.a, x.b, x.c - rhs) + "\\(=0\\)" + "\n2. Find the two numbers which add to equal the coefficient of x and multiply to equal the constant. These are " + x.answer1 * -1 + " and " + x.answer2 * -1 + ".\n3. Multiply these numbers by negative 1 to get " + x.answer1 + " and " + x.answer2 + "\n4. These are your answers.", renderQuadratic(x.a, x.b, x.c) + "\\(=" + rhs + "\\) \n1. Quadratics can only be solved if the right hand side is equal to 0. Therefore, the first step is to rearrange by subtracting " + rhs + " from both sides.\n" + renderQuadratic(x.a, x.b, x.c - rhs) + "\\(=0\\)" + "\n2. Find the product of the coefficient of \\(x^2\\) and the constant, " + x.a * (x.c - rhs) + "\n3. Find the two numbers which add to equal the coefficient of x and multiply to equal this new number, " + x.workingAnswer1 + " and " + x.workingAnswer2 + "\n4. Split the coefficient of x into these two numbers, \\(" + x.a + "x^2" + hideIfOne(x.workingAnswer1, false) + "x" + hideIfOne(x.workingAnswer2, false) + "x" + evaluatePlus(x.c - rhs) + "\\)\n5. Factorise the first two terms and the last two terms," + "\\(" + x.a + "x(x" + evaluatePlus(x.workingAnswer1 / x.a) + ")" + evaluatePlus(x.workingAnswer2) + "(x" + evaluatePlus((x.c - rhs) / x.workingAnswer2) + ")\\)\n6. Finish factorisation, \\((" + x.a + "x" + evaluatePlus(x.workingAnswer2) + ")(x" + evaluatePlus(x.answer1 * -1) + ")\\)\n7. Find the values for x which make a set of brackets equal to 0. These are " + x.answer1 + " and " + x.answer2 + "\n8. These are your answers.", x.workingIndex]
    };
}

function howLongPastPoint() {
    var x = createQuadratic(quadraticRandom(), quadraticRandom());
    var yValue = random(1, 10);
    var answer = quadraticFormula(x.a, x.b, x.c);
    var answer = answer[0] - answer[1];
    x.c = x.c + yValue;
    return {
        questionText: randomName() + " kicks a ball. The flight path of the ball can be modelled by y = " + renderQuadratic(x.a, x.b, x.c) + ", where x and y are measured in metres. For how many metres of the horizontal distance that the ball travels will it be " + yValue + " metres or more above the ground?",
        answers: [answer.toString(), answer + "m"],
        stepsOfWorking: ["This is a prototype version\n" + answer, 0]
    };
}

function whenNegative() {
    var x = createQuadratic(quadraticRandom(), quadraticRandom());
    var answer1Greater = false;
    if (x.answer2 - x.answer1 < 0) answer1Greater = true;
    return {
        questionText: "If y = " + renderQuadratic(x.a, x.b, x.c) + ", for what values of x will y be negative?",
        answers: [answer1Greater ? x.answer2 + ">x>" + x.answer1 : x.answer2 + ">x>" + x.answer1, answer1Greater ? x.answer1 + "<x<" + x.answer2 : x.answer1 + "<x<" + x.answer2],
        stepsOfWorking: ["This is a prototype version\n" + (answer1Greater ? x.answer2 + ">x>" + x.answer1 : x.answer2 + ">x>" + x.answer1), 0]
    };
}

//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
//Algebraic Expressions algorithms---------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------

function solveGivenVariable() {
    var a = randomLetter(); var b = randomLetter(); var c = randomLetter(); var x = randomLetter();
    var aValue = random(scalingRange(1, 12), scalingRange(1, 12, false)); var bValue = random(scalingRange(1, 12), scalingRange(1, 12, false)); var xValue = random(scalingRange(1, 12), scalingRange(1, 12, false));
    var aShown = true;
    if (coinflip) {
        a = aValue;
    } else {
        b = bValue;
        aShown = false;
    }
    return {
        questionText: "The distance, " + c + " cm, travelled by an object is given by " + wrapLatex(c + "=" + (coinflip ? b + x + "+" + a + x + "^2" : a + x + "^2+" + b + x)) + ". If " + x + " = " + xValue + " and " + (aShown ? b : a) + " = " + (aShown ? bValue : aValue) + ", calculate the distance the object has travelled.",
        answers: [(aValue * Math.pow(xValue, 2) + bValue * xValue).toString(), aValue * Math.pow(xValue, 2) + bValue * xValue + "cm"],
        stepsOfWorking: ["This is a prototype version\n" + (aValue * Math.pow(xValue, 2) + bValue * xValue), 0]
    };
}

function rearrangeEquations() {
    var aLetter = randomLetter(); var bLetter = randomLetter();
    var aIsF = coinflip ? true : false; var bIsF = coinflip ? true : false;
    var aQuadratic = aIsF ? createFQuadratic(quadraticRandom(), quadraticRandom()) : createQuadratic(quadraticRandom(), quadraticRandom());
    var bQuadratic = bIsF ? createFQuadratic(quadraticRandom(), quadraticRandom()) : createQuadratic(quadraticRandom(), quadraticRandom());
    var addToA = random(2, 10); var addToB = [NaN, NaN];
    if (aQuadratic.a != bQuadratic.a) addToB[0] = aQuadratic.a - bQuadratic.a;
    if (aQuadratic.b != bQuadratic.b) addToB[1] = aQuadratic.b - bQuadratic.b;
    return {
        questionText: wrapLatex(aLetter + "=") + (aIsF ? renderFQuadratic(aQuadratic.a, aQuadratic.step, aQuadratic.answer2) : renderQuadratic(aQuadratic.a, aQuadratic.b, aQuadratic.c)) + wrapLatex(evaluatePlus(addToA)) + " and " + wrapLatex(bLetter + "=") + (bIsF ? renderFQuadratic(bQuadratic.a, bQuadratic.step, bQuadratic.answer2) : renderQuadratic(bQuadratic.a, bQuadratic.b, bQuadratic.c)) + wrapLatex((isNaN(addToB[0]) ? "" : hideIfOne(addToB[0], false) + "x^2") + (isNaN(addToB[1]) ? "" : hideIfOne(addToB[1], false) + "x")) + ". Give an expression for " + aLetter + " in terms of " + bLetter + ".",
        answers: [aLetter + "=" + bLetter + evaluatePlus(aQuadratic.c + addToA - bQuadratic.c), bLetter + evaluatePlus(aQuadratic.c + addToA - bQuadratic.c) + "=" + aLetter],
        stepsOfWorking: ["This is a prototype version\n" + (aLetter + "=" + bLetter + evaluatePlus(aQuadratic.c + addToA - bQuadratic.c)), 0]
    };
}

function rearrangeWithRoot() {
    var rhs = randomLetter(); var coefficient = random(2, 4); var solveFor = randomLetter(); var denominator = random(2, 15);
    return {
        questionText: "The formula " + wrapLatex(rhs + "=" + coefficient + "\\sqrt{\\frac{" + solveFor + "}{" + denominator + "}}") + " solves for " + rhs + ". Rearrange the formula to solve for " + solveFor + ".",
        answers: ["(" + denominator + rhs + "^2)/" + coefficient + "^2=" + solveFor, solveFor + "=(" + denominator + rhs + "^2)/" + coefficient + "^2", "(" + denominator + rhs + "^2)/" + Math.pow(coefficient, 2) + "=" + solveFor, solveFor + "=(" + denominator + rhs + "^2)/" + Math.pow(coefficient, 2)],
        stepsOfWorking: ["This is a prototype version\n" + ("(" + denominator + rhs + "^2)/" + coefficient + "^2=" + solveFor), 0]
    };
}

function algebraicWordQuestions() {
    var firstTime = random(2, 5); var firstCharge = random(5, 15); var additionalHours = random(3, 10); var additionalCost = random(1, 5);
    var name1 = randomName();
    return {
        questionText: name1 + " hired a bike for a ride. It cost $" + firstCharge + " for " + firstTime + " hours, and then $" + additionalCost + " for every additional hour. The ride cost $" + (firstCharge + additionalHours * additionalCost) + ". How long did " + name1 + " hire the bike?",
        answers: [(additionalHours + firstTime).toString(), additionalHours + firstTime + "h", additionalHours + firstTime + "hours"],
        stepsOfWorking: ["This is a prototype version\n" + (additionalHours + firstTime), 0]
    };
}

function simplify() {
    var letter1 = randomLetter(); var letter2 = randomLetter();
    var termsOnTop = random(scalingRange(2, 4), scalingRange(2, 4, false));
    var coefficients = []; var letter1s = []; var letter2s = []; var terms = [];
    for (var _i2 = 0; _i2 < termsOnTop + 1; _i2++) {
        coefficients.push(random(2, 4));
        if (_i2 == termsOnTop - 2) coefficients[coefficients.length - 1] = 1;
        letter1s.push(random(1, 3));letter2s.push(random(1, 3));
        terms.push(hideIfOne(coefficients[_i2], _i2 == 0 ? true : false) + (letter1s[_i2] > 1 ? letter1 + "^" + letter1s[_i2] : letter1) + (letter2s[_i2] > 1 ? letter2 + "^" + letter2s[_i2] : letter2));
    }
    if (!!letter1s.reduce(function (a, b) {
        return a === b ? a : NaN;
    })) letter1s[0] += 1;
    var letter1sToSubtract = Math.min.apply(Math, _toConsumableArray(letter1s));
    var letter2sToSubtract = Math.min.apply(Math, _toConsumableArray(letter2s));
    var topText = "";
    for (var _i3 in terms) {
        if (_i3 < termsOnTop) topText += terms[_i3];
    } var answerTerms = [];
    for (var _i4 = 0; _i4 < coefficients.length; _i4++) {
        answerTerms[_i4] = hideIfOne(coefficients[_i4]);
        answerTerms[_i4] += letter1s[_i4] - letter1sToSubtract > 0 ? letter1s[_i4] - letter1sToSubtract > 1 ? letter1 + "^" + (letter1s[_i4] - letter1sToSubtract) : letter1 : "";
        answerTerms[_i4] += letter2s[_i4] - letter2sToSubtract > 0 ? letter2s[_i4] - letter2sToSubtract > 1 ? letter2 + "^" + (letter2s[_i4] - letter2sToSubtract) : letter2 : "";
    }
    var answerText = "";
    for (var _i5 = 0; _i5 < answerTerms.length - 1; _i5++) {
        answerText += (_i5 != 0 ? "+" : "") + answerTerms[_i5];
    }
    return {
        questionText: "Simplify" + wrapLatex("\\frac{" + topText + "}{" + hideIfOne(coefficients[coefficients.length - 1]) + (letter1s[letter1s.length - 1] > 1 ? letter1 + "^" + letter1s[letter1s.length - 1] : letter1) + (letter2s[letter2s.length - 1] > 1 ? letter2 + "^" + letter2s[letter2s.length - 1] : letter2) + "}", true),
        answers: ["(" + answerText + ")/" + answerTerms[answerTerms.length - 1]],
        stepsOfWorking: ["This is a prototype version\n" + ("(" + answerText + ")/" + answerTerms[answerTerms.length - 1]), 0]
    };
}

//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
//Simultaneous Equation algorithms---------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------

function rawNumeric() {
    var x = randomLetter(); var y = randomLetter();
    var xValue = random(scalingRange(1, 12), scalingRange(1, 12, false)); var yValue = random(scalingRange(1, 12), scalingRange(1, 12, false));
    var a = random(scalingRange(1, 8), scalingRange(1, 8, false)); var b = random(scalingRange(1, 8), scalingRange(1, 8, false)); var d = random(scalingRange(1, 8), scalingRange(1, 8, false)); var e = random(scalingRange(1, 8), scalingRange(1, 8, false));
    var c = a * xValue + b * yValue; var f = d * xValue + e * yValue;
    return {
        questionText: "If " + wrapLatex(hideIfOne(a) + x + hideIfOne(b, false) + y + "=" + c) + " and " + wrapLatex(hideIfOne(d) + x + hideIfOne(e, false) + y + "=" + f) + ", what is the value of " + x + "?",
        answers: [xValue.toString()],
        stepsOfWorking: ["This is a prototype version\n" + xValue, 0]
    };
}

function exchange() {
    var twiceMoney = random(70, 150, false, 2);
    var shift = random(4, 30, false, 2);
    var answer1 = twiceMoney - shift; var answer2 = twiceMoney / 2 + shift;
    var name1 = randomName(); var name2 = randomName();
    return {
        questionText: name1 + " has more money than " + name2 + ". If " + name1 + " gave " + name2 + " $" + (answer1 - answer2) / 2 + ", they would have the same amount. If instead " + "" + name2 + " gave " + name1 + " $" + shift + ", " + name1 + " would have twice as much as " + name2 + ". How much money does each person actually have?",
        answers: [answer1 + "," + answer2, answer2 + "," + answer1, "$" + answer1 + "," + "$" + answer2, "$" + answer2 + "," + "$" + answer1],
        stepsOfWorking: ["This is a prototype version\n" + ("(" + answer1 + ", " + answer2 + ")"), "(" + answer2 + ", " + answer1 + ")", 0]
    };
}

function ratios() {
    var speed1 = 25 - random(2, 15, false, 2); var speed2 = 25 - speed1;
    var distance = random(5, 20);
    var name1 = randomName(); var name2 = randomName();
    return {
        questionText: name1 + " and " + name2 + " live " + distance + "km away from each other. " + name1 + " skateboards " + speed1 + "km in the same time as " + name2 + " rides his" + " bike " + speed2 + "km. If they both leave home at the same time and travel towards each other, how far from " + name2 + "'s home will they meet?",
        answers: [(distance * 100 / 25 * speed2 / 100).toString(), distance * 100 / 25 * speed2 / 100 + "km"],
        stepsOfWorking: ["This is a prototype version\n" + distance * 100 / 25 * speed2 / 100, 0]
    };
}

//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
//Power and Exponent algorithms------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------

function solveConversionsToPowers() {
    var termWithX = random(1, 4);
    var base = random(2, 5);
    var firstTermPower = random(2, 3);
    var firstTerm = Math.pow(base, firstTermPower);
    var rhsPower = random(2, 4);
    var rhs = Math.pow(base, rhsPower);
    return {
        questionText: wrapLatex(firstTerm + "*" + base + "^" + "{x" + evaluatePlus(termWithX) + "}=" + rhs),
        answers: [(rhsPower - termWithX - firstTermPower).toString()],
        stepsOfWorking: ["This is a prototype version\n" + (rhsPower - termWithX - firstTermPower), 0]
    };
}

function solveRemovingBases() {
    var x = createQuadratic(quadraticRandom(), quadraticRandom());
    var base = random(scalingRange(2, 7), scalingRange(2, 7, false));
    return {
        questionText: wrapLatex(base + "^{" + x.b * -1 + "x" + evaluatePlus(x.c * -1) + "}=" + base + "^{x^{2}}") + ". Find the value(s) of x.",
        answers: [x.answer1 + "," + x.answer2, x.answer2 + "," + x.answer1],
        stepsOfWorking: ["This is a prototype version\n" + (x.answer1 + ", " + x.answer2), x.answer2 + ", " + x.answer1, 0]
    };
}

function powerInequalities() {
    var termWithX = random(-2, 1);
    var base = random(2, 4);
    var firstTerm = random(2, 5);
    var rhs = random(90, 120);
    var result = -1;
    var answers = [];
    for (var _i6 = 1; result < rhs / firstTerm; _i6++) {
        result = Math.pow(base, _i6 + termWithX);
        if (result < rhs / firstTerm) answers.push(_i6);
    }
    return {
        questionText: "If x is a whole number, for what values of x is " + wrapLatex(firstTerm + "*" + base + "^{x" + evaluatePlus(termWithX) + "}<" + rhs) + "?",
        answers: answers.toString(),
        stepsOfWorking: ["This is a prototype version\n" + answers, 0]
    };
}

var questions = [generate.solveQuadratic, generate.solveQuadraticWithRHS, generate.factoriseQuadratic, generate.expandQuadratic, generate.simplifyFraction, generate.solveFraction, generate.oneValueForX, generate.valueAtPoint, generate.howLongPastPoint, generate.whenNegative, generate.solveGivenVariable, rearrangeEquations, generate.rearrangeWithRoot, generate.algebraicWordQuestions, generate.simplify, generate.rawNumeric, generate.exchange, generate.ratios, generate.solveConversionsToPowers, generate.solveRemovingBases, generate.powerInequalities];
questions.push(questions[0]);

var questionNames = ["Solve Quadratics", "Solve Quadratics With RHS", "Factorise Quadratics", "Expand Quadratics", "Simplify Fractions", "Solve Fractions", "Find One Value For x", "Find Value At Point", "Find Time Past Point", "Find When Quadratic Is Negative", "Solve Given Variable", "Rearrange Equations", "Rearrange Equations With Root", "Algebraic Word Questions", "Remove Common Factors", "Simple Simultaneous Equations", "Simultaneous Equations 1", "Simultaneous Equations 2", "Solve Powers", "Solve Removing Bases", "Power Inequalities", "Wildcard Questions"];

var questionExplanations = ["Solving a quadratic means finding values for x which make the equation true. An example of a quadratic equation would be $$x^2+5x+6$$ To make this equation true, the quadratic expression on the left hand side must equal 0.\nTo do this, find the two numbers which add up to equal the coefficient to x, and multiply to equal the constant.\nFor this particular quadratic, the numbers 2 and 3 add to equal 5, and multiply to equal 6.\nThe inverse of these two numbers (a.k.a. these two numbers multiplied by -1) are the solutions to the quadratic; therefore, -2 and -3 are the solutions for this quadratic.", "Quadratic equations can only be solved if the right hand side is equal to zero. This means that the only way to solve a quadratic which has a right hand size which is not equal to zero is to rearrange so that the right hand side is equal to zero. An example of a quadratic equation with a right hand side would be $$x^2-15x+58=8$$ To solve this, 8 must be subtracted from both sides to make the right hand side equal to zero. To solve from here, see the explanation for the 'Solve Quadratics' category.", "Factorising a Quadratic means converting a quadratic expression into two sets of brackets which, when expanded, are equal to the original quadratic. For example, if you expand \\((x+2)(x+1)\\), you will see that it is equal to \\(x^2+3x+2\\).To factorise a quadratic, find the two numbers which add up to equal the coefficient of x, and multiply to equal the constant. For example, the numbers 2 and 1 add to equal 3, and multiply to equal 6.The factorised quadratic is two sets of brackets which each contain x and one of these numbers. If \\(x^2\\) has a coefficient, then the process is different. Instead of finding two numbers which add to equal the coefficient of x and multiply to equal the constant, you find two numbers which add to equal the coefficient of x and multiple to equal the constant multiplied by the coefficient of \\(x^2\\). For example, if the quadratic was \\(2x^2-8x+6\\), then these numbers would be -6 and -2, as they multiply to equal 12. The next step is then to" + " break the coefficient of x up into these two values. In this example this would result in the expression \\(2x^2-2x-6x+6\\). From here, the equation can be factorised easily by finding the common factors of the first two terms, and then the common factors of the second two terms. In this example, this would result in the expression \\(2x(x-1)-6(x-1)\\). This means that you have 2x lots of (x-1) and -6 lots of (x-1). This is the same as (2x-6) lots of (x-1). Therefore, the final step is simply to finish factorising. In this example, this would result in the expression \\((2x-6)(x-1)\\).", "Expanding quadratics simply means multipling every term in the first set of brackets by every term in the second set of brackets. For example, \\((x-3)(x+2)\\) becomes \\(x^2-x-6\\).", "Simplifying a fraction simply means factorising the top half of the fraction, factorising the bottomm half of the equation, and then cancelling out the common factor which appears in the top and bottom half. For example, the fraction $$\\frac{x^2-2x-8}{x^2-x-6}$$ factorises to $$\\frac{(x-4)(x+2)}{(x-3)(x+2)}$$ Both the top and the bottom halves of the fraction contain the term (x+2), which can be cancelled out. The final answer is $$\\frac{x-4}{x-3}$$", "This is a prototype version", "Find one value for x means that you need to find the value of c which would ensure that the quadratic expression has only one solution. To find this, simply divide the coefficient of x by two and then square the result. For example, if the quadratic expression was \\(x^2-8x+c\\), the value for c would be 16. This is because \\(\\frac{-8}{2}=-4\\), and -4 squared is equal to 16.", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version"];

var exampleFormats = ["a, b", "a, b", "(x+a)(x+b)", "ax^2+bx-c", "(x+a)/(x+b)", "a, b", "a", "a", "a", "a>x>b", "a", "a=b+c", "(a^b)/c=d+e", "a", "(a+b)/c", "a", "a, b", "a", "a", "a, b", "a, b, c"];
exampleFormats.push(exampleFormats[0]);

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

for(let i = 0; i < 100; i ++){
    var question = solveQuadratic();
    displayElement("ID: " + i + " Question: " + question.questionText);
    console.log("Question: " + i + " Answers: "+ question.answers);
}
function displayElement(element) {
    var equationHTML = document.createElement("p");
    equationHTML.appendChild(document.createTextNode(element));
    document.getElementById("test").appendChild(equationHTML);
}
*/
