var getCoeff = giveRandom(2, 4);
var getConstant = giveRandom(-20, 20);
var getQuadraticSolution = giveRandom(-6, 6);

//Decoraters
function addPlus(term) {
    return term > 0 ? "+" + term : term;
}
function toLatex(term) {
    return "$$" + term + "$$";
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

function giveRandom(lower, upper, chanceOfOne = 0.7) {
    return function() {
        var value = 0;
        while(value === 0) {
            value = Math.random() > chanceOfOne ? 1 : Math.floor(Math.random() * (upper - lower + 1) + lower);
            console.log(value);
        }
        return value;
    };
}

function createLinear() {
    var coeff = getCoeff();
    var constant = getConstant();
    var equation;
    return {
        equation: coeff + "x" + addPlus(constant),
        solveForX: function(x) {
            return coeff * x + constant;
        }
    };
}

function createQuadratic(answerToTake, dividableBy) {
    var b = 0;
    while(b == 0) {
        var coeff = getCoeff();
        var solutionOne = getQuadraticSolution();
        var solutionTwo = getQuadraticSolution();
        b = solutionOne + solutionTwo * coeff;
        var c = solutionOne * solutionTwo;
    }
    return {
        equation: hideIfOne(coeff) + "x^2" + hideIfOne(b, false) + "x" + addPlus(c),
        solveForX: function(x) {
            return Math.pow(x, 2) * coeff + b * x + c;
        }
    }
}

function createFraction(top, bottom, canCancel = false) {
    return {
        equation: "\\frac{" + top.equation + "}{" + bottom.equation + "}",
        solveForX: function(x) {
            return top.solveForX(x) / bottom.solveForX(x);
        }
    }
}


/*
x = 5;

top value = something % 5 = 0;
bottom value = 
*/


for(let i = 0; i < 100; i++) {
    var element = createFraction(createLinear(), createQuadratic());

    displayElement(element.equation + "answer" + element.solveForX(2));
    //displayElement(element.equation);
}

function displayElement(element) {
    var equationHTML = document.createElement("p");
    equationHTML.appendChild(document.createTextNode(toLatex(element)));
    document.getElementById("test").appendChild(equationHTML);
}
