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
        asfQuadratic: (quadratic, wrap = true) => wrap ? `\\((${hideIfOne(quadratic.a, false)}x${evaluatePlus(quadratic.a == 1 ? quadratic.workingAnswer2 * -1 : quadratic.workingAnswer2)})(x${evaluatePlus(quadratic.answer1 * -1)})\\)` : `(${hideIfOne(quadratic.a, false)}x${evaluatePlus(quadratic.a == 1 ? quadratic.workingAnswer2 * -1 : quadratic.workingAnswer2)})(x${evaluatePlus(quadratic.answer1 * -1)})`
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
                if(number % 2 != 0 && (selectedType == "even" || selectedType == "scalingEven")) number ++;
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
        var step = -1 * a * answer1;
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
            workingAnswer1: step1, workingAnswer2: step2
        };
    }
    //Takes a then step then answer2
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

    return {
        question: function(question) {
            return function() {
                var quadratic = stockQuadratic();
                if(question == "solveQuadraticWithRHS") quadratic = rawQuadratic(random.number(scalingRange(5, 10), scalingRange(5, 10, false), true), random.number(scalingRange(5, 10), scalingRange(5, 10, false), true));
                
                var _quadratic = format.asQuadratic(quadratic);
                var _fQuadratic = format.asfQuadratic(quadratic);
                var [_factor1, _factor2] = [quadratic.answer1 * -1, quadratic.answer2 * -1];
                var [_answer1, _answer2] = [quadratic.answer1, quadratic.answer2];
                const X2 = format.wrapLatex("x^2");

                var questionText;
                var answers;
                var stepsOfWorking;

                if(question == "solveQuadratic") {
                    let questionType = random.coinflip();

                    questionText = "";
                    if(questionType) questionText = `Solve ${_quadratic} ${format.wrapLatex("=0")}`
                    else questionText = `Give the x-coordinates of the points where the graph of ${format.wrapLatex("y =")}${_quadratic} cuts the x-axis.`
        
                    answers = [`${_answer1},${_answer2}`, `${_answer2},${_answer1}`];

                    let aValueIsOneWorking = `${_quadratic}\n
                    (1) Find the two numbers which add to equal the coefficient of x and multiply to equal the constant. These are ${_factor1} and ${_factor2}\n
                    (2) Multiply these numbers by negative 1 to get your answers, ${_answer1} and ${_answer2}.`;
                    const AC = quadratic.a * quadratic.c;
                    let aValueIsNotOneWorking = `${_quadratic}\n
                        (1) Find the product of the coefficient of ${format.wrapLatex("x^2")} and the constant, ${AC}\n
                        (2) Find the two numbers which add to equal the coefficient of x and multiply to equal this new number, ${quadratic.workingAnswer1} and ${quadratic.workingAnswer2}\n
                        (3) Split the coefficient of x into these two numbers, ${format.wrapLatex(quadratic.a + "x^2" + format.hideIfOne(quadratic.workingAnswer1, false) + "x" + format.hideIfOne(quadratic.workingAnswer2, false) + "x" + format.evaluatePlus(quadratic.c))}\n
                        (4) Factorise the first two terms and the last two terms, ${format.wrapLatex(quadratic.a + "x(x" + format.evaluatePlus(quadratic.workingAnswer1 / quadratic.a) + ")" + format.evaluatePlus(quadratic.workingAnswer2) + "(x" + format.evaluatePlus(quadratic.c / quadratic.workingAnswer2))}\n
                        (5) Finish factorisation, ${format.wrapLatex("(" + quadratic.a + "x" + format.evaluatePlus(quadratic.workingAnswer2) + ")(x" + format.evaluatePlus(_factor2) + ")")}\n
                        (6) Find the values for x which make a set of brackets equal to 0. These are ${_answer1} and ${_answer2}\n
                        (7) These are your answers.`;
                    stepsOfWorking = quadratic.a == 1 ? aValueIsOneWorking : aValueIsNotOneWorking;
                }

                else if(question == "factoriseQuadratic") {
                    let questionType = random.number(0, 3);
                
                    questionText = "";
                    if(questionType == 0) questionText = `Factorise ${_quadratic}`;
                    else if(questionType == 1) questionText = `The area of a rectangle is ${_quadratic}, what are the lengths of the sides in terms of x?`;
                    else if(questionType == 2) questionText = `A rectangle has the area of ${_quadratic}, state the width and length of this rectangle in terms of x.`;
                    else questionText = `The area of a rectangle can be represented by ${_quadratic}, what are the lengths of the sides in terms of x?`;
                    
                    answers = quadratic.a == 1 ? [`(x${format.evaluatePlus(_factor1)})(x${format.evaluatePlus(_factor2)})`,
                    `(x${format.evaluatePlus(_factor2)})(x${format.evaluatePlus(_factor1)})`] : 
                    [`(${quadratic.a}x${format.evaluatePlus(quadratic.workingAnswer2)})(x${format.evaluatePlus(_factor1)})`,
                    `(x${format.evaluatePlus(_factor1)})(${quadratic.a}x${format.evaluatePlus(quadratic.workingAnswer2)})`,
                    `(${quadratic.a}x${format.evaluatePlus(quadratic.workingAnswer1)})(x${format.evaluatePlus(_factor2)})`,
                    `(x${format.evaluatePlus(_factor2)})(${quadratic.a}x${format.evaluatePlus(quadratic.workingAnswer1)})`];
        
                    const AC = quadratic.a * quadratic.c;
                    stepsOfWorking = quadratic.a == 1 ? `${_quadratic}\n
                    (1) Find the two numbers which add to equal the coefficient of x and the constant. These are ${_factor1} and ${_factor2}\n
                    (2) Put each number in a set of brackets with x, ${format.wrapLatex("(x" + format.evaluatePlus(_factor1) + ")(x" + format.evaluatePlus(_factor2) + ")")}\n
                    (3) This is your answer.` : 
                    `${_quadratic}\n
                    (1) Find the product of the coefficient of ${format.wrapLatex("x^2")} and the constant, ${AC}\n
                    (2) Find the two numbers which add to equal the coefficient of x and multiply to equal this new number, ${quadratic.workingAnswer1} and ${quadratic.workingAnswer2}\n
                    (3) Split the coefficient of x into these two numbers, ${format.wrapLatex(quadratic.a + "x^2" + format.hideIfOne(quadratic.workingAnswer1, false) + format.hideIfOne(quadratic.workingAnswer2) + "x" + format.evaluatePlus(quadratic.c))}\n
                    (4) Factorise the first two terms and the last two terms, ${format.wrapLatex(quadratic.a + "x(x" + format.evaluatePlus(quadratic.workingAnswer1 / quadratic.a) + ")" + format.evaluatePlus(quadratic.workingAnswer2) + "(x" + format.evaluatePlus(quadratic.c / quadratic.workingAnswer2) + ")")}\n
                    (5) Finish factorisation, ${format.wrapLatex("(" + quadratic.a + "x" + format.evaluatePlus(quadratic.workingAnswer2) + ")(x" + format.evaluatePlus(_factor1) + ")")}\n
                    (6) This is your answer.`;            
                }

                else if(question == "simplifyFraction") {
                    let quadraticFraction = rawQuadraticFraction();
                    let numeratorQuadratic = quadraticFraction[0];
                    let denominatorQuadratic = quadraticFraction[1];
                    questionText = `Simplify \\(\\frac\{${format.asQuadratic(numeratorQuadratic, false)}\}\{${format.asQuadratic(denominatorQuadratic, false)}\}\\)`;
                    answers = [`(x${format.evaluatePlus(numeratorQuadratic.answer2 * -1)})/(x${format.evaluatePlus(denominatorQuadratic.answer2 * -1)})`];
                    stepsOfWorking = `This is a prototype version. The answer is ${answers[0]}`;
                }

                else if(question == "solveFraction") {
                    let quadraticFraction = rawQuadraticFraction();
                    let numeratorQuadratic = quadraticFraction[0];
                    let denominatorQuadratic = quadraticFraction[1];
                    numeratorQuadratic.answer2 = Math.abs(numeratorQuadratic.answer2); denominatorQuadratic.answer2 = Math.abs(denominatorQuadratic.answer2);
                    let lower = (numeratorQuadratic.answer2 - denominatorQuadratic.answer2) > 0 ? (numeratorQuadratic.answer2 + 1) : (denominatorQuadratic.answer2 + 1);
                    let answer1 = random.number(lower, 10, false, "even");
                    let rhsNumerator = answer1 - numeratorQuadratic.answer2;
                    let rhsDenominator = answer1 - denominatorQuadratic.answer2;
                    let rhsNumeratorContainsX = true;
                    for(let i = 1;; i++) {
                        let rhsNewNumerator = rhsNumerator * i;
                        let rhsNewDenominator = rhsDenominator * i;
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

                    let answer2 = rhsNumeratorContainsX ? quadraticFormula(rhsNumerator, denominatorQuadratic.answer2 * rhsNumerator * -1 - rhsDenominator, rhsDenominator * numeratorQuadratic.answer2) : 
                    quadraticFormula(rhsDenominator, numeratorQuadratic.answer2 * rhsDenominator *-1 - rhsNumerator, rhsNumerator * denominatorQuadratic.answer2);
                    answer2 = answer1 == answer2[0] ? answer2[1] : answer2[0];
                    
                    rhsNumeratorContainsX ? rhsNumerator = format.hideIfOne(rhsNumerator, false) + "x" :
                    rhsDenominator = format.hideIfOne(rhsDenominator, false) + "x";
                    questionText = `Solve \\(\\frac\{${format.asQuadratic(numeratorQuadratic, false)}\}\{${format.asQuadratic(denominatorQuadratic, false)}\}=\\frac\{${rhsNumerator}\}\{${rhsDenominator}\}\\)`;
                    answers = [answer1 + "," + answer2, answer2 + "," + answer1];
                    stepsOfWorking = `This is a prototype version. The answers are ${answer1} and ${answer2}`;
                }

                else if(question == "expandQuadratic") {
                    questionText = `Expand ${_fQuadratic}`;
                    answers = [format.asQuadratic(quadratic, false)];
                    stepsOfWorking = `This is a prototype version. The answers are ${answers[0]}`;
                }

                else if(question == "oneValueForX") {
                    quadratic = rawQuadratic(random.number(scalingRange(2, 10), scalingRange(2, 10, false), true, "even"), random.number(scalingRange(2, 10), scalingRange(2, 10, false), true, "even"), 1);
                    if(Math.abs(quadratic.b) == 1) quadratic.b = 2; 
                    _quadratic = format.asQuadratic({a: quadratic.a, b: quadratic.b, c: "+c"});
                        
                    questionText = `${random.name()} is trying to find a value for c so that ${_quadratic} has only one solution for x. Give the value of c.`;
                    answers = [Math.pow(quadratic.b / 2, 2).toString()];
                    stepsOfWorking = `This is a prototype version. The answer is ${Math.pow(quadratic.b / 2, 2)}`;
                }

                else if(question == "valueAtPoint") {
                    let point = random.number(0, 4, true);
                    questionText = `A parabola has the equation: ${_quadratic}. What is the value of y when x = ${point}?`;
                    answers = [(quadratic.a * Math.pow(point, 2) + quadratic.b * point + quadratic.c).toString()];
                    stepsOfWorking = `This is a prototype version. The answer is ${answers[0]}`;
                }

                else if(question == "solveQuadraticWithRHS") {
                    let rhs = random.number(1, 150);
                    quadratic.c = quadratic.c + rhs;
                    let _quadraticNew = format.asQuadratic(quadratic);

                    questionText = `A rectangle has the area of ${_quadraticNew}. If the area of the rectangle is ${rhs}, what is the value(s) of x?`;
                    answers = [quadratic.answer1 + "," + quadratic.answer2, quadratic.answer2 + "," + quadratic.answer1];
                    
                    const AC = quadratic.a * (quadratic.c - rhs);
                    stepsOfWorking = quadratic.a == 1 ? `${_quadraticNew}${format.wrapLatex("=" + rhs)}\n
                    (1) Quadratics can only be solved if the right hand side is equal to 0. Therefore, the first step is to rearrange by subtracting ${rhs} from both sides to get ${_quadratic + format.wrapLatex("=0")}\n
                    (2) Find the two numbers which add to equal the coefficient of x and multiply to equal the constant. These are ${_factor1} and ${_factor2}\n
                    (3) Multiply these numbers by negative 1 to get ${_answer1} and ${_answer2}\n
                    (4). These are your answers.` :
                    `${_quadraticNew + format.wrapLatex("=" + rhs)}\n
                    (1) Quadratics can only be solved if the right hand side is equal to 0. Therefore, the first step is to rearrange by subtracting ${rhs} from both sides to get ${_quadratic}${format.wrapLatex("=0")}\n
                    (2) Find the product of the coefficient of ${X2} and the constant, ${AC}\n
                    (3) Find the two numbers which add to equal the coefficient of x and multiply to equal this new number, ${quadratic.workingAnswer1} and ${quadratic.workingAnswer2}.\n
                    (4) Split the coefficient of x into these two numbers, ${format.wrapLatex(quadratic.a + "x^2" + format.hideIfOne(quadratic.workingAnswer1, false) + "x" + format.hideIfOne(quadratic.workingAnswer2, false) + "x" + format.evaluatePlus(quadratic.c - rhs))}\n
                    (5) Factorise the first two terms and the last two terms, ${format.wrapLatex(quadratic.a + "x(x" + format.evaluatePlus(quadratic.workingAnswer1 / quadratic.a) + ")" + format.evaluatePlus(quadratic.workingAnswer2) + "(x" + format.evaluatePlus(((quadratic.c - rhs) / quadratic.workingAnswer2)) + ")")}\n
                    (6) Finish factorisation ${"(" + format.wrapLatex(quadratic.a + "x" + format.evaluatePlus(quadratic.workingAnswer2) + ")(x" + format.evaluatePlus(_factor1) + ")")}\n
                    (7) Find the values for x which make a set of brackets equal to 0. These are ${_answer1} and ${_answer2}\n
                    (8) These are your answers.`;
                }

                else if(question == "howLongPastPoint") {
                    let yValue = random.number(1, 10);

                    questionText = `${random.name()} kicks a ball. The flight path of the ball can be modelled by ${format.wrapLatex("y=")}${_quadratic}, where x and y are measured in metres. For how many metres of the horizontal distance that the ball travels will it be ${yValue} metres or more above the ground?`;

                    let answer = quadraticFormula(quadratic.a, quadratic.b, quadratic.c);
                    answers = [(answer[0] - answer[1]).toString(), (answer[0] - answer[1]) + "m"];
                    quadratic.c += yValue;

                    stepsOfWorking = `This is a prototype version. The answer is ${answers[0]}`;
                }

                else if(question == "whenNegative") {
                    let answer1Greater = false;
                    if (_answer2 - _answer1 < 0) answer1Greater = true;
                    questionText = `If ${format.wrapLatex("y=")}${_quadratic}, for what values of x will y be negative?`;
                    answers = [answer1Greater ? _answer2 + ">x>" + _answer1 : _answer2 + ">x>" + _answer1, answer1Greater ? _answer1 + "<x<" + _answer2 : _answer1 + "<x<" + _answer2];
                    stepsOfWorking = `This is a prototype version. The answer is ${answers[0]}`;
                }

                else if(question == "solveGivenVariable") {
                    let [a, b, c, x] = [random.letter(), random.letter(), random.letter(), random.letter()];
                    let [aValue, bValue, xValue] = [random.number(scalingRange(1, 12), scalingRange(1, 12, false)), random.number(scalingRange(1, 12), scalingRange(1, 12, false)), random.number(scalingRange(1, 12), scalingRange(1, 12, false))];
                    let aShown = true;
                    if (random.coinflip()) {
                        a = aValue;
                    } else {
                        b = bValue;
                        aShown = false;
                    }
                    const equation = random.coinflip() ? b + x + "+" + a + x + "^2" : a + x + "^2+" + b + x;
                    const termToStateValue = aShown ? b : a;
                    const valueOfTermToState = aShown ? bValue : aValue;
                    questionText = `The distance, ${c} cm, travelled by an object is given by ${format.wrapLatex(`${c}=${equation}`)}. If ${x}=${xValue} and ${termToStateValue}=${valueOfTermToState}, calculate the distance the object has travelled.`;

                    answers = [(aValue * Math.pow(xValue, 2) + bValue * xValue).toString(), aValue * Math.pow(xValue, 2) + bValue * xValue + "cm"];
                    stepsOfWorking = `This is a prototype version. The answer is ${answers[0]}.`;
                }

                else if(question == "rearrangeEquations") {
                    let [aLetter, bLetter] = [random.letter(), random.letter()];
                    let [aIsFactorised, bIsFactorised] = [random.coinflip(), random.coinflip()];
                    let [aQuadratic, bQuadratic] = [stockQuadratic(), stockQuadratic()];
                    let addToA = random.number(2, 10);
                    let addToB = [NaN, NaN];
                    if (aQuadratic.a != bQuadratic.a) addToB[0] = aQuadratic.a - bQuadratic.a;
                    if (aQuadratic.b != bQuadratic.b) addToB[1] = aQuadratic.b - bQuadratic.b;

                    const _aQuadratic = aIsFactorised ? format.asfQuadratic(aQuadratic) : format.asQuadratic(aQuadratic);
                    const _bQuadratic = bIsFactorised ? format.asfQuadratic(bQuadratic) : format.asQuadratic(bQuadratic);
                    const _addToB1 = isNaN(addToB[0]) ? "" : format.hideIfOne(addToB[0], false) + "x^2";
                    const _addToB2 = isNaN(addToB[1]) ? "" : format.hideIfOne(addToB[1], false) + "x";
                    questionText = `${format.wrapLatex(`${aLetter}=`)}${_aQuadratic}${format.wrapLatex(format.evaluatePlus(addToA))} and ${format.wrapLatex(`${bLetter}=`)}${_bQuadratic}${format.wrapLatex(_addToB1 + _addToB2)}. Give an expression for ${aLetter} in terms of ${bLetter}.`;

                    answers = [aLetter + "=" + bLetter + format.evaluatePlus(aQuadratic.c + addToA - bQuadratic.c), bLetter + format.evaluatePlus(aQuadratic.c + addToA - bQuadratic.c) + "=" + aLetter];
                    stepsOfWorking = `This is a prototype version. The answer is ${answers[0]}.`;
                }

                else if(question == "rearrangeWithRoot") {
                    let [rhs, solveFor] = [random.letter(), random.letter()];
                    let [coefficient, denominator] = [random.number(2, 4), random.number(2, 15)];

                    const equation = format.wrapLatex(`${rhs}=${coefficient}\\sqrt\{\\frac\{${solveFor}\}\{${denominator}\}\}`);
                    questionText = `The formula${equation} solves for ${rhs}. Rearrange the formula to solve for ${solveFor}.`;
                    
                    answers = ["(" + denominator + rhs + "^2)/" + coefficient + "^2=" + solveFor, solveFor + "=(" + denominator + rhs + "^2)/" + coefficient + "^2", "(" + denominator + rhs + "^2)/" + Math.pow(coefficient, 2) + "=" + solveFor, solveFor + "=(" + denominator + rhs + "^2)/" + Math.pow(coefficient, 2)];
                    
                    stepsOfWorking = `This is a prototype version. The answer is ${answers[3]}.`;
                }

                else if(question == "algebraicWordQuestions") {
                    let [firstTime, firstCharge, additionalHours, additionalCost] = [random.number(2, 5), random.number(5, 15), random.number(3, 10), random.number(1, 5)];
                    let name = random.name();

                    const totalCost = firstCharge + additionalHours * additionalCost;
                    questionText = `${name} hired a bike for a ride. It cost $${firstCharge} for ${firstTime} hours, and then $${additionalCost} for every additional hour. The ride cost $${totalCost}. How long did ${name} hire the bike for?`;

                    answers = [(additionalHours + firstTime).toString(), additionalHours + firstTime + "h", additionalHours + firstTime + "hours"];
                    stepsOfWorking = `This is in a protype version. The answer is ${answers[0]}.`;
                }

                //This function could be refactored to be far more readable, but it's given me enough of a headache as it is.
                else if(question == "simplify") {
                    let [letter1, letter2] = [random.letter(), random.letter()];
                    
                    let termsInNumerator = random.number(scalingRange(2, 5), scalingRange(2, 5, false));
                    let numeratorTerms = [];
                    for(let i = 0; i < termsInNumerator; i++) {
                        let [coefficientInTerm, letter1sInTerm, letter2sInTerm] = [random.number(1, 5), random.number(1, 4), random.number(1, 4)];
                        numeratorTerms.push({coefficientInTerm: coefficientInTerm, letter1sInTerm: letter1sInTerm, letter2sInTerm: letter2sInTerm});
                    }
                    let coefficientInDenominator = random.number(1, 5);
                    let [letter1sInDenominator, letter2sInDenominator] = [random.number(1, 4), random.number(1, 4)];
                    let denominatorTerm = {coefficientInTerm: coefficientInDenominator, letter1sInTerm: letter1sInDenominator, letter2sInTerm: letter2sInDenominator};

                    let numeratorText = "";
                    for(let i = 0; i < termsInNumerator; i++) {
                        let coefficientInTerm = numeratorTerms[i].coefficientInTerm;
                        let letter1sInTerm = numeratorTerms[i].letter1sInTerm;
                        let letter2sInTerm = numeratorTerms[i].letter2sInTerm;

                        let _coefficientInTerm = i == 0 ? format.hideIfOne(coefficientInTerm, false) : format.hideIfOne(coefficientInTerm);
                        let _letter1sInTerm = letter1sInTerm == 1 ? letter1 : `${letter1}^${letter1sInTerm}`;
                        let _letter2sInTerm = letter2sInTerm == 1 ? letter2 : `${letter2}^${letter2sInTerm}`;
                        numeratorText += (_coefficientInTerm + _letter1sInTerm + _letter2sInTerm);
                    }
                    let _coefficientInDenominator = format.hideIfOne(coefficientInDenominator, false);
                    let _letter1sInDenominator = letter1sInDenominator == 1 ? letter1 : `${letter1}^${letter1sInDenominator}`;
                    let _letter2sInDenominator = letter2sInDenominator == 1 ? letter2 : `${letter2}^${letter2sInDenominator}`;
                    let denominatorText = (_coefficientInDenominator + _letter1sInDenominator + _letter2sInDenominator);
                    questionText = `Simplify${format.wrapLatex(`\\frac{${numeratorText}}{${denominatorText}}`, true)}`;

                    let [coefficientsForEachTerm, letter1sForEachTerm, letter2sForEachTerm] = [[], [], []];
                    for(let i = 0; i < numeratorTerms.length; i++) {
                        coefficientsForEachTerm.push(i == 0 ? format.hideIfOne(numeratorTerms[i].coefficientInTerm, false) : format.hideIfOne(numeratorTerms[i].coefficientInTerm));
                        letter1sForEachTerm.push(numeratorTerms[i].letter1sInTerm);
                        letter2sForEachTerm.push(numeratorTerms[i].letter2sInTerm);
                    }
                    letter1sForEachTerm.push(letter1sInDenominator);
                    letter2sForEachTerm.push(letter2sInDenominator);
                    let commonLetter1s = Math.min(...letter1sForEachTerm);
                    let commonLetter2s = Math.min(...letter2sForEachTerm);

                    let _numeratorText = "";
                    for(let i = 0; i < numeratorTerms.length; i++) {
                        numeratorTerms[i].letter1sInTerm -= commonLetter1s;
                        numeratorTerms[i].letter2sInTerm -= commonLetter2s;
                        let _letter1InTerm = numeratorTerms[i].letter1sInTerm == 0 ? "" : numeratorTerms[i].letter1sInTerm == 1 ? letter1 : `${letter1}^${numeratorTerms[i].letter1sInTerm}`;
                        let _letter2InTerm = numeratorTerms[i].letter2sInTerm == 0 ? "" : numeratorTerms[i].letter2sInTerm == 1 ? letter2 : `${letter2}^${numeratorTerms[i].letter2sInTerm}`;
                        _numeratorText += `${coefficientsForEachTerm[i]}${_letter1InTerm}${_letter2InTerm}`;
                        console.log(_numeratorText);
                    }

                    letter1sInDenominator -= commonLetter1s;
                    letter2sInDenominator -= commonLetter2s;
                    _letter1sInDenominator = letter1sInDenominator == 1 ? letter1 : `${letter1}^${letter1sInDenominator}`;
                    _letter2sInDenominator = letter2sInDenominator == 1 ? letter2 : `${letter2}^${letter2sInDenominator}`;

                    answers = [`(${_numeratorText})/${_coefficientInDenominator}${_letter1sInDenominator}${_letter2sInDenominator}`];
                    stepsOfWorking = `This is a prototype version. The answer is ${answers[0]}.`;
                }

                else if(question == "rawNumeric") {
                    let [x, y] = [random.letter(), random.letter()];
                    let [xValue, yValue] = [random.number(scalingRange(1, 12), scalingRange(1, 12, false)), random.number(scalingRange(1, 12), scalingRange(1, 12, false))];
                    let a = random.number(scalingRange(1, 8), scalingRange(1, 8, false));
                    let b = random.number(scalingRange(1, 8), scalingRange(1, 8, false));
                    let d = random.number(scalingRange(1, 8), scalingRange(1, 8, false));
                    let e = random.number(scalingRange(1, 8), scalingRange(1, 8, false));
                    let c = a * xValue + b * yValue;
                    let f = d * xValue + e * yValue;
                    
                    let _equationOne = format.wrapLatex(`${format.hideIfOne(a)}${x}${format.hideIfOne(b, false)}${y}=${c}`);
                    let _equationTwo = format.wrapLatex(`${format.hideIfOne(d)}${x}${format.hideIfOne(e, false)}${y}=${f}`);
                    questionText = `If ${_equationOne} and ${_equationTwo}, what is the value of ${x}?`;
                    answers = [xValue.toString()];
                    stepsOfWorking = `This is a prototype version. The answer is ${xValue}`;

                }

                else if(question == "exchange") {
                    let twiceMoney = random.number(70, 150, false, "even");
                    let shift = random.number(4, 30, false, "even");
                    let answer1 = twiceMoney - shift;
                    let answer2 = twiceMoney / 2 + shift;
                    let [name1, name2] = [random.name(), random.name()];

                    let _moneyToGive = (answer1 - answer2) / 2;
                    questionText = `${name1} has more money than ${name2}. If ${name1} gave ${name2} $${_moneyToGive}, they would have the same amount. 
                    If instead ${name2} gave ${name1} $${shift}, ${name1} would have twice as much money as ${name2}. 
                    How much money does each person actually have?`;
                    answers = [`${answer1},${answer2}`, `${answer2},${answer1}`, `$${answer1},$${answer2}`, `$${answer2},$${answer1}`];
                    stepsOfWorking = `This is a prototype version. The answer is ${answers[0]}.`; 
                }

                else if(question == "ratios") {

                }

                else if(question == "SolveConversionsToPowers") {

                }

                else if(question == "solveRemovingBases") {

                }

                else if(question == "powerInequalities") {

                }
            
                return {
                    questionText: questionText,
                    answers: answers,
                    stepsOfWorking: stepsOfWorking
                };
            }
    }
    };
})();

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

var questions = [generate.question("solveQuadratic"), generate.question("solveQuadraticWithRHS"), generate.question("factoriseQuadratic"), generate.question("expandQuadratic"), generate.question("simplifyFraction"), generate.question("solveFraction"), generate.question("oneValueForX"), generate.question("valueAtPoint"), generate.question("howLongPastPoint"), generate.question("whenNegative"), generate.question("solveGivenVariable"), generate.question("rearrangeEquations"), generate.question("rearrangeWithRoot"), generate.question("algebraicWordQuestions"), generate.question("simplify"), generate.question("rawNumeric"), generate.question("exchange"), generate.question("ratios"), generate.question("solveConversionsToPowers"), generate.question("solveRemovingBases"), generate.question("powerInequalities")];
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
