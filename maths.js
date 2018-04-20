const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
lastLetter = "a";
function randomLetter() {
    do{
        letter = ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    } while(letter == lastLetter);
    lastLetter = letter;
    return letter;
}

const NAMES = ["Thanh", "Clifton", "Vincent", "Len", "Orlando", "Marcel", "Christoper", "Granville", "Brenton", "Buford", "Jerry", "Michal", "Corey", "Simon", "Marvin", "Gerry", "Rufus", "Darrell", "Benton", "Jonathon", "Gerardo", "Deangelo", "Gabriel", "Bill", "Carol", "Demetrius", "Sammie", "Wendell", "Tim", "Jermaine", "Trey", "Scott", "Jamar", "Jacob", "Gus", "Alvaro", "Luther", "Weston", "Rodolfo", "Mac", "Branden", "Julio", "Royce", "Malcolm", "Ramiro", "Kelvin", "Elliot", "Ethan", "Waldo", "Joesph"];
lastName = "Thanh";
function randomName() {
    do{
        name = NAMES[Math.floor(Math.random() * NAMES.length)];
    } while(name == lastName);
    lastName = name;
    return name;
}

//---------------------------
//Decoraters-----------------
//---------------------------
function addPlus(term) {
    return term > 0 ? ("+" + term) : term;
}

function toLatex(term, block = false) {
    return block ? "$$" + term + "$$" : "\\(" + term + "\\)";
}

function hideIfOne(term, firstTerm = true) {
    var value;
    if(term == 1) {
        value = firstTerm ? "" : "+";
    } else if(term == -1) {
        value = "-";
    } else {
        value = firstTerm ? term : addPlus(term);
    }
    return value;
}

function renderQuadratic(a, b, c, block = false) {
    return toLatex(hideIfOne(a) + "x^2" + hideIfOne(b, false) + "x" + addPlus(c), block);
}
function renderFQuadratic(a, step, answer2, block = false) {
    return toLatex("(" + hideIfOne(a) + "x" + addPlus(step) + ")(x" + addPlus(answer2) + ")", block);
}

//---------------------------
//Mathematics----------------
//---------------------------

function quadraticFormula(a, b, c) {
    result = (-1 * b + Math.sqrt(Math.pow(b, 2) - (4 * a * c))) / (2 * a);
    result2 = (-1 * b - Math.sqrt(Math.pow(b, 2) - (4 * a * c))) / (2 * a);
    return [result, result2];
}

//---------------------------
//Randomisers----------------
//---------------------------

function coinflip() {
    return Math.random() > 0.5 ? true : false;
}

var lastValue = random(2, 3);
//0 = regular, 1 = scaling, 2 = even, 3 = scalingEven
function random(lower, upper, negatives = false, type = 0, chanceOfOne = 0) {
    lower = scalingRange(lower, upper); upper = scalingRange(lower, upper, false);
    if(Math.random() < chanceOfOne) return 1;
    do {
        type % 2 != 0 ? value = Math.floor(Math.abs(Math.random() - Math.random()) * (1 + upper - lower) + lower)
                : value = Math.floor(Math.random() * (upper - lower + 1) + lower);
        if(negatives && coinflip()) value = value * -1;
        if(type > 1 && value % 2 != 0) value++;
    } while(Math.abs(value) == Math.abs(lastValue));
    lastValue = value;
    return value;
}

function quadraticRandom() {
    return random(scalingRange(2, 10), scalingRange(2, 10, false), true);
}

var currentDifficulty = 0;
function scalingRange(trueLower, trueUpper, isLower = true) {
    if(currentDifficulty <= 5) lower = trueLower;
    else lower = trueLower + ((trueUpper - trueLower) / 10) * (currentDifficulty - 5);
    upper = ((trueUpper + trueLower) / 2) + ((trueUpper - trueLower) / 20) * currentDifficulty;
    return isLower ? lower : upper;
}

//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
//Quadratic algorithms---------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------

//---------------------------
//Secondary algorithms-------
//---------------------------
function createQuadratic(answer1, answer2, a = random(scalingRange(1, 5), scalingRange(1, 5, false), false, 1, 0.2)) {
    b = (a * answer2 * -1) + (answer1 * a * -1);
    c = (answer1 * a * -1) * answer2 * -1;
    workingIndex = a == 1 ? 0 : 1;
    step1 = answer1; step2 = answer2;
    if(workingIndex == 1) {
        step = a * c;
        i = 1;
        while(step1 * step2 != step && step1 < 1000) {
            i++;
            step1 = answer1 * i; step2 = answer2 * i;
        }
        step1 = step1 * -1; step2 = step2 * -1;
    }
    return {
        a: a, b: b, c: c,
        answer1: answer1,
        answer2: answer2,
        workingAnswer1: step1,
        workingAnswer2: step2,
        workingIndex: workingIndex
    }
}

function createFQuadratic(answer1, answer2) {
    a = random(scalingRange(1, 5), scalingRange(1, 5, false), false, 1, 0.2)
    step = (a * answer1 * -1);
    b = a * answer2 + step;
    c = (step * answer2 * -1);
    workingIndex = a == 1 ? 0 : 1;
    step1 = answer1; step2 = answer2;
    if(workingIndex == 1) {
        step3 = a * c;
        i = 1;
        while(step1 * step2 != step3 && step1 < 1000) {
            i++;
            step1 = answer1 * i; step2 = answer2 * i;
        }
        step1 = step1 * -1; step2 = step2 * -1;
    }
    console.log("answer1: "+ answer1 + " answer2: " + answer2 + " a: " + a + " b: " + b + " c: " + c);
    return {
        a: a, b: b, c: c, step: step, answer2: answer2,
        workingAnswer1: step1,
        workingAnswer2: step2,
        workingIndex: workingIndex
    }
}

function createQuadraticFraction() {
    commonAnswer = random(scalingRange(2, 6), scalingRange(2, 6, false), true);
    answerTop = random(scalingRange(2, 6), scalingRange(2, 6, false), true);
    do {
        answerBottom = random(scalingRange(2, 6), scalingRange(2, 6, false), true);
    } while(answerBottom == commonAnswer || answerBottom == commonAnswer * -1);
    return {
        answerTop: answerTop,
        answerBottom: answerBottom,
        commonAnswer: commonAnswer
    }
}

//---------------------------
//Primary algorithms---------
//---------------------------
function solveQuadratic() {
    x = createQuadratic(quadraticRandom(), quadraticRandom());
    questionType = coinflip();
    return {
        questionText: (questionType ? "Solve " + renderQuadratic(x.a, x.b, x.c) + " \\(=0\\)" : "Give the x-coordinates of the points where the graph of y = " + renderQuadratic(x.a, x.b, x.c) + " cuts the x-axis."),
        answers: [(x.answer1 + "," + x.answer2), (x.answer2 + "," + x.answer1)],
        stepsOfWorking: [(renderQuadratic(x.a, x.b, x.c) + "\n1. Find the two numbers which add to equal the coefficient of x and multiply to equal the constant. These are " + (x.answer1 * -1) + " and " + (x.answer2 * -1) + ".\n2. Multiply these numbers by negative 1 to get " + x.answer1 + " and " + x.answer2 + "\n3. These are your answers."), (renderQuadratic(x.a, x.b, x.c) + "\n1. Find the product of the coefficient of \\(x^2\\) and the constant, " + x.a * x.c + "\n2. Find the two numbers which add to equal the coefficient of x and multiply to equal this new number, " + x.workingAnswer1 + " and " + x.workingAnswer2 + "\n3. Split the coefficient of x into these two numbers, \\(" + x.a + "x^2" + hideIfOne(x.workingAnswer1, false) + "x" + hideIfOne(x.workingAnswer2, false) + "x" + addPlus(x.c) + "\\)\n4. Factorise the first two terms and the last two terms," + "\\(" + x.a + "x(x" + addPlus(x.workingAnswer1 / x.a) + ")" + addPlus(x.workingAnswer2) + "(x" + addPlus(x.c / x.workingAnswer2) + ")\\)\n5. Finish factorisation, \\((" + x.a + "x" + addPlus(x.workingAnswer2) + ")(x" + addPlus(x.answer1 * -1) + ")\\)\n6. Find the values for x which make a set of brackets equal to 0. These are " + x.answer1 + " and " + x.answer2 + "\n7. These are your answers."), x.workingIndex]
    }
}

function factoriseQuadratic() {
    x = createQuadratic(quadraticRandom(), quadraticRandom());
    questionType = random(0, 3);
    return {
        questionText: (questionType == 0 ? "Factorise " + renderQuadratic(x.a, x.b, x.c) :
        (questionType == 1 ? "The area of a rectangle is " + renderQuadratic(x.a, x.b, x.c) + ", what are the lengths of the sides in terms of x?" :
        (questionType == 2 ? "A rectangle has the area of " + renderQuadratic(x.a, x.b, x.c) + ", state the width and length of this rectangle in terms of x.":
                             "The area of a rectange can be represented by " + renderQuadratic(x.a, x.b, x.c) + ", what are the lengths of the sides in terms of x?"))),
        answers: [("(" + hideIfOne(x.a) + "x" + addPlus(x.workingAnswer2) + ")(x" + addPlus(x.answer1 * -1, false) + ")"),
                   ("(x" + addPlus(x.answer1 * -1, false) + ")(" + hideIfOne(x.a) + "x" + addPlus(x.workingAnswer2) + ")"), ("(" + hideIfOne(x.a) + "x" + addPlus(x.workingAnswer1) + ")(x" + addPlus(x.answer2 * -1, false) + ")"), ("(x" + addPlus(x.answer2 * -1, false) + ")(" + hideIfOne(x.a) + "x" + addPlus(x.workingAnswer1) + ")")],
        stepsOfWorking: [(renderQuadratic(x.a, x.b, x.c) + "\n1. Find the two numbers which add to equal the coefficient of x and the constant. These are " + x.answer1 * -1 + " and " + x.answer2 * -1 + "\n2. Put each number in a set of brackets with x, \\((x" + addPlus(x.answer1 * -1) + ")(x" + addPlus(x.answer2 * -1) + ")\\)"), (renderQuadratic(x.a, x.b, x.c) + "\n1. Find the product of the coefficient of \\(x^2\\) and the constant, " + x.a * x.c + "\n2. Find the two numbers which add to equal the coefficient of x and multiply to equal this new number, " + x.workingAnswer1 + " and " + x.workingAnswer2 + "\n3. Split the coefficient of x into these two numbers, \\(" + x.a + "x^2" + hideIfOne(x.workingAnswer1, false) + "x" + hideIfOne(x.workingAnswer2, false) + "x" + addPlus(x.c) + "\\)\n4. Factorise the first two terms and the last two terms," + "\\(" + x.a + "x(x" + addPlus(x.workingAnswer1 / x.a) + ")" + addPlus(x.workingAnswer2) + "(x" + addPlus(x.c / x.workingAnswer2) + ")\\)\n5. Finish factorisation, \\((" + x.a + "x" + addPlus(x.workingAnswer2) + ")(x" + addPlus(x.answer1 * -1) + ")\\)\n6. This is your answer."), x.workingIndex]
    }
}

function simplifyFraction() {
    x = createQuadraticFraction();
    var top = createQuadratic(x.answerTop, x.commonAnswer);
    var bottom = createQuadratic(x.answerBottom, x.commonAnswer);
    return {
        questionText: "Simplify " + toLatex("\\frac{" + hideIfOne(top.a) + "x^2" + hideIfOne(top.b, false) + "x" + addPlus(top.c) + "}{"
                                                      + hideIfOne(bottom.a) + "x^2" + hideIfOne(bottom.b, false) + "x" + addPlus(bottom.c) + "}", true),
        answers: [("(x" + addPlus(x.answerTop * -1) + ")/(x" + addPlus(x.answerBottom * -1) + ")")],
        stepsOfWorking: ["This is a prototype version\n" + "(x" + addPlus(x.answerTop * -1) + ")/(x" + addPlus(x.answerBottom * -1) + ")", 0]
    }
}

function solveFraction() {
    x = createQuadraticFraction();
    x.answerTop = Math.abs(x.answerTop); x.answerBottom = Math.abs(x.answerBottom);
    var top = createQuadratic(x.answerTop, x.commonAnswer, 1);
    var bottom = createQuadratic(x.answerBottom, x.commonAnswer, 1);
    lower = x.answerTop - x.answerBottom > 0 ? x.answerTop + 1 : x.answerBottom + 1;
    answer1 = random(lower, 10, false, 2);
    numerator = answer1 - x.answerTop; denominator = answer1 - x.answerBottom;
    numeratorIsX = true;
    for(let i = 1; ; i++) {
        newNumerator = numerator * i;
        newDenominator = denominator * i;
        if(Math.abs(newNumerator % answer1) == 0) {
            numerator = newNumerator / answer1;
            numeratorIsX = true;
            denominator = newDenominator;
            break;
        }
        if(Math.abs(newDenominator % answer1) == 0) {
            denominator = newDenominator / answer1;
            numeratorIsX = false;
            numerator = newNumerator;
            break;
        }
    }
    answer2 = numeratorIsX ? quadraticFormula(numerator, (x.answerBottom * numerator * -1 - denominator), denominator * x.answerTop)
                               : quadraticFormula(denominator, (x.answerTop * denominator * -1 - numerator), numerator * x.answerBottom);
    answer2 = answer1 == answer2[0] ? answer2[1] : answer2[0];
    numeratorIsX ? numerator = hideIfOne(numerator) + "x" : denominator = hideIfOne(denominator) + "x";
    return {
        questionText: "Solve " + toLatex("\\frac{" + hideIfOne(top.a) + "x^2" + hideIfOne(top.b, false) + "x" + addPlus(top.c) + "}{"
                                                   + hideIfOne(bottom.a) + "x^2" + hideIfOne(bottom.b, false) + "x" + addPlus(bottom.c)
                                     + "}=\\frac{" + numerator + "}{" + denominator + "}", true),
        answers: [(answer1 + "," + answer2), (answer2 + "," + answer1)],
        stepsOfWorking: ["This is a prototype version\n" + (answer1 + ", " + answer2), (answer2 + ", " + answer1) , 0]
    }
}

function expandQuadratic() {
    x = createFQuadratic(quadraticRandom(), quadraticRandom());
    return {
        questionText: "Expand " + renderFQuadratic(x.a, x.step, x.answer2),
        answers: [((hideIfOne(x.a)) + "x^2" + hideIfOne(x.b, false) + "x" + addPlus(x.c * -1, false))],
        stepsOfWorking: ["This is a prototype version\n" + ((hideIfOne(x.a)) + "x^2" + hideIfOne(x.b, false) + "x" + addPlus(x.c * -1, false)), 0]
    }
}

function oneValueForX() {
    x = createQuadratic(random(scalingRange(2, 10), scalingRange(2, 10, false), true, 2), random(scalingRange(2, 10), scalingRange(2, 10, false), true, 2));
    return {
        questionText: randomName() + " is trying to find a value for c so that " + toLatex(hideIfOne(x.a) + "x^2" + hideIfOne(x.b, false) + "x + c")
                                                                        + " has only one solution for x. Give the value of c.",
        answers: [(Math.pow(x.b / 2, 2)).toString()],
        stepsOfWorking: ["This is a prototype version\n" + (Math.pow(x.b / 2, 2)), 0]
    }
}

function valueAtPoint() {
    x = createQuadratic(quadraticRandom(), quadraticRandom());
    point = random(0, 4, true);
    return {
        questionText: "A parabola has the equation: " + toLatex(hideIfOne(x.a) + "x^2" + hideIfOne(x.b, false) + "x" + addPlus(x.c))
                                                      + ". What is the value of y when x = " + point + "?",
        answers: [((x.a * Math.pow(point, 2) + x.b * point + x.c).toString())],
        stepsOfWorking: ["This is a prototype version\n" + (x.a * Math.pow(point, 2) + x.b * point + x.c), 0]
    }
}

function solveQuadraticWithRHS() {
    x = createQuadratic(random(scalingRange(5, 10), scalingRange(5, 10, false), true, 1), random(scalingRange(5, 10), scalingRange(5, 10, false), true));
    rhs = random(1, 150);
    x.c = x.c + rhs;
    return {
        questionText: "A rectangle has an area of " + renderQuadratic(x.a, x.b, x.c) + ". If the area of the rectangle is " + rhs + ", what is the value(s) of x?",
        answers: [(x.answer1 + "," + x.answer2), (x.answer2 + "," + x.answer1)],
        stepsOfWorking: [(renderQuadratic(x.a, x.b, x.c) + "\\(=" + rhs + "\\) \n1. Quadratics can only be solved if the right hand side is equal to 0. Therefore, the first step is to rearrange by subtracting " + rhs + " from both sides.\n" + renderQuadratic(x.a, x.b, (x.c - rhs)) + "\\(=0\\)" + "\n2. Find the two numbers which add to equal the coefficient of x and multiply to equal the constant. These are " + (x.answer1 * -1) + " and " + (x.answer2 * -1) + ".\n3. Multiply these numbers by negative 1 to get " + x.answer1 + " and " + x.answer2 + "\n4. These are your answers."),
        (renderQuadratic(x.a, x.b, x.c) + "\\(=" + rhs + "\\) \n1. Quadratics can only be solved if the right hand side is equal to 0. Therefore, the first step is to rearrange by subtracting " + rhs + " from both sides.\n" + renderQuadratic(x.a, x.b, (x.c - rhs)) + "\\(=0\\)" + "\n2. Find the product of the coefficient of \\(x^2\\) and the constant, " + x.a * (x.c - rhs) + "\n3. Find the two numbers which add to equal the coefficient of x and multiply to equal this new number, " + x.workingAnswer1 + " and " + x.workingAnswer2 + "\n4. Split the coefficient of x into these two numbers, \\(" + x.a + "x^2" + hideIfOne(x.workingAnswer1, false) + "x" + hideIfOne(x.workingAnswer2, false) + "x" + addPlus((x.c - rhs)) + "\\)\n5. Factorise the first two terms and the last two terms," + "\\(" + x.a + "x(x" + addPlus(x.workingAnswer1 / x.a) + ")" + addPlus(x.workingAnswer2) + "(x" + addPlus((x.c - rhs) / x.workingAnswer2) + ")\\)\n6. Finish factorisation, \\((" + x.a + "x" + addPlus(x.workingAnswer2) + ")(x" + addPlus(x.answer1 * -1) + ")\\)\n7. Find the values for x which make a set of brackets equal to 0. These are " + x.answer1 + " and " + x.answer2 + "\n8. These are your answers."), x.workingIndex]
    }
}

function howLongPastPoint() {
    x = createQuadratic(quadraticRandom(), quadraticRandom());
    yValue = random(1, 10);
    answer = quadraticFormula(x.a, x.b, x.c);
    answer = answer[0] - answer[1];
    x.c = x.c + yValue;
    return {
        questionText: randomName() + " kicks a ball. The flight path of the ball can be modelled by y = " + renderQuadratic(x.a, x.b, x.c) + ", where x and y are measured in metres. For how many metres of the horizontal distance that the ball travels will it be " + yValue + " metres or more above the ground?",
        answers: [answer.toString(), answer + "m"],
        stepsOfWorking: ["This is a prototype version\n" + answer, 0]
    }
}

function whenNegative() {
    x = createQuadratic(quadraticRandom(), quadraticRandom());
    answer1Greater = false;
    if(x.answer2 - x.answer1 < 0) answer1Greater = true;
    return {
        questionText: "If y = " + renderQuadratic(x.a, x.b, x.c) + ", for what values of x will y be negative?",
        answers: [(answer1Greater ? (x.answer2 + ">x>" + x.answer1) : (x.answer2 + ">x>" + x.answer1)),
                  (answer1Greater ? (x.answer1 + "<x<" + x.answer2) : (x.answer1 + "<x<" + x.answer2))],
        stepsOfWorking: ["This is a prototype version\n" + (answer1Greater ? (x.answer2 + ">x>" + x.answer1) : (x.answer2 + ">x>" + x.answer1)), 0]
    }
}

//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
//Algebraic Expressions algorithms---------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------

function solveGivenVariable() {
    a = randomLetter(); b = randomLetter(); c = randomLetter(); x = randomLetter();
    aValue = random(scalingRange(1, 12), scalingRange(1, 12, false)); bValue = random(scalingRange(1, 12), scalingRange(1, 12, false)); xValue = random(scalingRange(1, 12), scalingRange(1, 12, false));
    aShown = true;
    if(coinflip) {
        a = aValue;
    } else {
        b = bValue;
        aShown = false;
    }
    return {
        questionText: "The distance, " + c + " cm, travelled by an object is given by " + toLatex(c + "=" + (coinflip ? (b + x + "+" + a + x + "^2")
                    : (a + x + "^2+" + b + x))) + ". If " + x + " = " + xValue + " and " + (aShown ? b : a) + " = " + (aShown ? bValue : aValue)
                    + ", calculate the distance the object has travelled.",
        answers: [(aValue * Math.pow(xValue, 2) + bValue * xValue).toString(), (aValue * Math.pow(xValue, 2) + bValue * xValue) + "cm"],
        stepsOfWorking: ["This is a prototype version\n" + (aValue * Math.pow(xValue, 2) + bValue * xValue), 0]
    }
}

function rearrangeEquations() {
    aLetter = randomLetter(); bLetter = randomLetter();
    aIsF = coinflip ? true : false; bIsF = coinflip ? true : false;
    aQuadratic = aIsF ? createFQuadratic(quadraticRandom(), quadraticRandom()) : createQuadratic(quadraticRandom(), quadraticRandom());
    bQuadratic = bIsF ? createFQuadratic(quadraticRandom(), quadraticRandom()) : createQuadratic(quadraticRandom(), quadraticRandom());
    addToA = random(2, 10); addToB = [NaN, NaN];
    if(aQuadratic.a != bQuadratic.a) addToB[0] = (aQuadratic.a - bQuadratic.a);
    if(aQuadratic.b != bQuadratic.b) addToB[1] = (aQuadratic.b - bQuadratic.b);
    return {
        questionText: toLatex(aLetter + "=") + (aIsF ? renderFQuadratic(aQuadratic.a, aQuadratic.step, aQuadratic.answer2)
                                           : renderQuadratic(aQuadratic.a, aQuadratic.b, aQuadratic.c)) + toLatex(addPlus(addToA)) + " and " +
                      toLatex(bLetter + "=") + (bIsF ? renderFQuadratic(bQuadratic.a, bQuadratic.step, bQuadratic.answer2)
                                                         : renderQuadratic(bQuadratic.a, bQuadratic.b, bQuadratic.c)) +
                      toLatex((isNaN(addToB[0]) ? "" : hideIfOne(addToB[0], false) + "x^2") + (isNaN(addToB[1]) ? "" : hideIfOne(addToB[1], false) + "x"))
                      + ". Give an expression for " + aLetter + " in terms of " + bLetter + ".",
        answers: [(aLetter + "=" + bLetter + addPlus(aQuadratic.c + addToA - bQuadratic.c)), (bLetter + addPlus(aQuadratic.c + addToA - bQuadratic.c) + "=" + aLetter)],
        stepsOfWorking: ["This is a prototype version\n" + (aLetter + "=" + bLetter + addPlus(aQuadratic.c + addToA - bQuadratic.c)), 0]
    }
}

function rearrangeWithRoot() {
    rhs = randomLetter(); coefficient = random(2, 4); solveFor = randomLetter(); denominator = random(2, 15);
    return {
        questionText: "The formula " + toLatex(rhs + "=" + coefficient + "\\sqrt{\\frac{" + solveFor + "}{" + denominator + "}}") + " solves for " + rhs
                      + ". Rearrange the formula to solve for " + solveFor + ".",
        answers: [("(" + denominator + rhs + "^2)/" + coefficient + "^2=" + solveFor), (solveFor + "=(" + denominator + rhs + "^2)/" + coefficient + "^2"), ("(" + denominator + rhs + "^2)/" + Math.pow(coefficient, 2) + "=" + solveFor), (solveFor + "=(" + denominator + rhs + "^2)/" + Math.pow(coefficient, 2))],
        stepsOfWorking: ["This is a prototype version\n" + ("(" + denominator + rhs + "^2)/" + coefficient + "^2=" + solveFor), 0]
    }
}

function algebraicWordQuestions() {
    firstTime = random(2, 5); firstCharge = random(5, 15); additionalHours = random(3, 10); additionalCost = random(1, 5);
    name1 = randomName();
    return {
        questionText: name1 + " hired a bike for a ride. It cost $" + firstCharge + " for " + firstTime + " hours, and then $" + additionalCost
                    + " for every additional hour. The ride cost $" + (firstCharge + additionalHours * additionalCost) + ". How long did " + name1 + " hire the bike?",
        answers: [(additionalHours + firstTime).toString(), (additionalHours + firstTime) + "h", (additionalHours + firstTime) + "hours"],
        stepsOfWorking: ["This is a prototype version\n" + (additionalHours + firstTime), 0]
    }
}

function simplify() {
    letter1 = randomLetter(); letter2 = randomLetter();
    termsOnTop = random(scalingRange(2, 4), scalingRange(2, 4, false));
    coefficients = []; letter1s = []; letter2s = []; terms = [];
    for(let i = 0; i < termsOnTop + 1; i++) {
        coefficients.push(random(2, 4));
        if(i == termsOnTop - 2) coefficients[coefficients.length - 1] = 1;
        letter1s.push(random(1, 3)); letter2s.push(random(1, 3));
        terms.push(hideIfOne(coefficients[i], i == 0 ? true : false) + (letter1s[i] > 1 ? letter1 + "^" + letter1s[i]
                                              : letter1) + (letter2s[i] > 1 ? letter2 + "^" + letter2s[i] : letter2));
    }
    if (!!letter1s.reduce(function(a, b) {return (a === b) ? a : NaN;})) letter1s[0] += 1;
    letter1sToSubtract = Math.min(...letter1s);
    letter2sToSubtract = Math.min(...letter2s);
    topText = "";
    for(let i in terms)
        if(i < termsOnTop) topText += terms[i];
    answerTerms = [];
    for(let i = 0; i < coefficients.length; i ++) {
        answerTerms[i] = hideIfOne(coefficients[i]);
        answerTerms[i] += (letter1s[i] - letter1sToSubtract > 0 ? (letter1s[i] - letter1sToSubtract > 1 ? (letter1 + "^" +
                          (letter1s[i] - letter1sToSubtract)) : (letter1)) : (""));
        answerTerms[i] += (letter2s[i] - letter2sToSubtract > 0 ? (letter2s[i] - letter2sToSubtract > 1 ? (letter2 + "^" +
                          (letter2s[i] - letter2sToSubtract)) : (letter2)) : (""));
    }
    answerText = "";
    for(let i = 0; i < answerTerms.length - 1; i++) {
        answerText += (i != 0 ? "+" : "") + answerTerms[i];
    }
    return {
        questionText: "Simplify" + toLatex("\\frac{" + topText + "}{"
                    + hideIfOne(coefficients[coefficients.length - 1]) + (letter1s[letter1s.length - 1] > 1 ? letter1 + "^" + letter1s[letter1s.length - 1] : letter1)
                    + (letter2s[letter2s.length - 1] > 1 ? letter2 + "^" + letter2s[letter2s.length - 1] : letter2) + "}", true),
        answers: [("(" + answerText + ")/" + answerTerms[answerTerms.length - 1])],
        stepsOfWorking: ["This is a prototype version\n" + ("(" + answerText + ")/" + answerTerms[answerTerms.length - 1]), 0]
    }
}

//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
//Simultaneous Equation algorithms---------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------

function rawNumeric() {
    x = randomLetter(); y = randomLetter();
    xValue = random(scalingRange(1, 12), scalingRange(1, 12, false)); yValue = random(scalingRange(1, 12), scalingRange(1, 12, false));
    a = random(scalingRange(1, 8), scalingRange(1, 8, false)); b = random(scalingRange(1, 8), scalingRange(1, 8, false)); d = random(scalingRange(1, 8), scalingRange(1, 8, false)); e = random(scalingRange(1, 8), scalingRange(1, 8, false));
    c = a * xValue + b * yValue; f = d * xValue + e * yValue;
    return {
        questionText: "If " + toLatex(hideIfOne(a) + x + hideIfOne(b, false) + y + "=" + c) + " and " + toLatex(hideIfOne(d) + x + hideIfOne(e, false) + y + "=" + f) + ", what is the value of " + x + "?",
        answers: [xValue.toString()],
        stepsOfWorking: ["This is a prototype version\n" + xValue, 0]
    }
}

function exchange() {
    twiceMoney = random(70, 150, false, 2);
    shift = random(4, 30, false, 2);
    answer1 = twiceMoney - shift; answer2 = twiceMoney / 2 + shift;
    name1 = randomName(); name2 = randomName();
    return {
        questionText: name1 + " has more money than "+ name2 + ". If " + name1 + " gave " + name2 + " $" + ((answer1 - answer2) / 2) + ", they would have the same amount. If instead " +
        "" + name2 + " gave " + name1 + " $" + shift + ", " + name1 + " would have twice as much as " + name2 + ". How much money does each person actually have?",
        answers: [(answer1 + "," + answer2), (answer2 + "," + answer1), ("$" + answer1 + "," + "$" + answer2), ("$" + answer2 + "," + "$" + answer1)],
        stepsOfWorking: ["This is a prototype version\n" + ("(" + answer1 + ", " + answer2 + ")"), ("(" + answer2 + ", " + answer1 + ")"), 0]
    }
}

function ratios() {
    speed1 = 25 - random(2, 15, false, 2); speed2 = 25 - speed1;
    distance = random(5, 20);
    name1 = randomName(); name2 = randomName();
    return {
        questionText: name1 + " and " + name2 + " live " + distance + "km away from each other. " + name1 + " skateboards " + speed1 + "km in the same time as " + name2 + " rides his"
                    + " bike " + speed2 + "km. If they both leave home at the same time and travel towards each other, how far from " + name2 + "'s home will they meet?",
        answers: [((distance * 100 / 25) * speed2 / 100).toString(), ((distance * 100 / 25) * speed2 / 100) + "km"],
        stepsOfWorking: ["This is a prototype version\n" + (distance * 100 / 25) * speed2 / 100, 0]
    }
}

//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
//Power and Exponent algorithms------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------

function solveConversionsToPowers() {
    termWithX = random(1, 4);
    base = random(2, 5);
    firstTermPower = random(2, 3);
    firstTerm = Math.pow(base, firstTermPower);
    rhsPower = random(2, 4);
    rhs = Math.pow(base, rhsPower);
    return {
        questionText: toLatex(firstTerm + "*" + base + "^" + "{x" + addPlus(termWithX) + "}=" + rhs),
        answers: [(rhsPower - termWithX - firstTermPower).toString()],
        stepsOfWorking: ["This is a prototype version\n" + (rhsPower - termWithX - firstTermPower), 0]
    }
}

function solveRemovingBases() {
    x = createQuadratic(quadraticRandom(), quadraticRandom());
    base = random(scalingRange(2, 7), scalingRange(2, 7, false));
    return {
        questionText: toLatex(base + "^{" + x.b * -1 + "x" + addPlus(x.c * -1) + "}=" + base + "^{x^{2}}") + ". Find the value(s) of x.",
        answers: [(x.answer1 + "," + x.answer2), (x.answer2 + "," + x.answer1)],
        stepsOfWorking: ["This is a prototype version\n" + (x.answer1 + ", " + x.answer2), (x.answer2 + ", " + x.answer1), 0]
    }
}

function powerInequalities() {
    termWithX = random(-2, 1);
    base = random(2, 4);
    firstTerm = random(2, 5);
    rhs = random(90, 120);
    result = -1;
    answers = [];
    for(let i = 1; result < (rhs / firstTerm); i++) {
        result = Math.pow(base, (i + termWithX));
        if(result < (rhs / firstTerm)) answers.push(i);
    }
    return {
        questionText: "If x is a whole number, for what values of x is " + toLatex(firstTerm + "*" + base + "^{x" + addPlus(termWithX) + "}<" + rhs) + "?",
        answers: answers.toString(),
        stepsOfWorking: ["This is a prototype version\n" + answers, 0]
    }
}

var questions = [solveQuadratic, solveQuadraticWithRHS, factoriseQuadratic, expandQuadratic, simplifyFraction, solveFraction, oneValueForX, valueAtPoint, howLongPastPoint, whenNegative, solveGivenVariable, rearrangeEquations, rearrangeWithRoot, algebraicWordQuestions, simplify, rawNumeric, exchange, ratios, solveConversionsToPowers, solveRemovingBases, powerInequalities]
questions.push(questions[0]);

var questionNames = ["Solve Quadratics", "Solve Quadratics With RHS", "Factorise Quadratics", "Expand Quadratics", "Simplify Fractions", "Solve Fractions", "Find One Value For x", "Find Value At Point", "Find Time Past Point", "Find When Quadratic Is Negative", "Solve Given Variable", "Rearrange Equations", "Rearrange Equations With Root", "Algebraic Word Questions", "Remove Common Factors", "Simple Simultaneous Equations", "Simultaneous Equations 1", "Simultaneous Equations 2", "Solve Powers", "Solve Removing Bases", "Power Inequalities", "Wildcard Questions"];

var questionExplanations = [
    "Solving a quadratic means finding values for x which make the equation true. An example of a quadratic equation would be $$x^2+5x+6$$ To make this equation true, the quadratic expression on the left hand side must equal 0.\nTo do this, find the two numbers which add up to equal the coefficient to x, and multiply to equal the constant.\nFor this particular quadratic, the numbers 2 and 3 add to equal 5, and multiply to equal 6.\nThe inverse of these two numbers (a.k.a. these two numbers multiplied by -1) are the solutions to the quadratic; therefore, -2 and -3 are the solutions for this quadratic.",

    "Quadratic equations can only be solved if the right hand side is equal to zero. This means that the only way to solve a quadratic which has a right hand size which is not equal to zero is to rearrange so that the right hand side is equal to zero. An example of a quadratic equation with a right hand side would be $$x^2-15x+58=8$$ To solve this, 8 must be subtracted from both sides to make the right hand side equal to zero. To solve from here, see the explanation for the 'Solve Quadratics' category.",

    "Factorising a Quadratic means converting a quadratic expression into two sets of brackets which, when expanded, are equal to the original quadratic. For example, if you expand \\((x+2)(x+1)\\), you will see that it is equal to \\(x^2+3x+2\\).To factorise a quadratic, find the two numbers which add up to equal the coefficient of x, and multiply to equal the constant. For example, the numbers 2 and 1 add to equal 3, and multiply to equal 6.The factorised quadratic is two sets of brackets which each contain x and one of these numbers. If \\(x^2\\) has a coefficient, then the process is different. Instead of finding two numbers which add to equal the coefficient of x and multiply to equal the constant, you find two numbers which add to equal the coefficient of x and multiple to equal the constant multiplied by the coefficient of \\(x^2\\). For example, if the quadratic was \\(2x^2-8x+6\\), then these numbers would be -6 and -2, as they multiply to equal 12. The next step is then to" + " break the coefficient of x up into these two values. In this example this would result in the expression \\(2x^2-2x-6x+6\\). From here, the equation can be factorised easily by finding the common factors of the first two terms, and then the common factors of the second two terms. In this example, this would result in the expression \\(2x(x-1)-6(x-1)\\). This means that you have 2x lots of (x-1) and -6 lots of (x-1). This is the same as (2x-6) lots of (x-1). Therefore, the final step is simply to finish factorising. In this example, this would result in the expression \\((2x-6)(x-1)\\).",

    "Expanding quadratics simply means multipling every term in the first set of brackets by every term in the second set of brackets. For example, \\((x-3)(x+2)\\) becomes \\(x^2-x-6\\).",

    "Simplifying a fraction simply means factorising the top half of the fraction, factorising the bottomm half of the equation, and then cancelling out the common factor which appears in the top and bottom half. For example, the fraction $$\\frac{x^2-2x-8}{x^2-x-6}$$ factorises to $$\\frac{(x-4)(x+2)}{(x-3)(x+2)}$$ Both the top and the bottom halves of the fraction contain the term (x+2), which can be cancelled out. The final answer is $$\\frac{x-4}{x-3}$$",

    "This is a prototype version",

    "Find one value for x means that you need to find the value of c which would ensure that the quadratic expression has only one solution. To find this, simply divide the coefficient of x by two and then square the result. For example, if the quadratic expression was \\(x^2-8x+c\\), the value for c would be 16. This is because \\(\\frac{-8}{2}=-4\\), and -4 squared is equal to 16.",

    "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version", "This is a prototype version",]

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
