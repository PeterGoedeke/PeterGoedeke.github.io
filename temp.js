//else if(question == "simplify") {
    let [letter1, letter2] = [random.letter(), random.letter()];
    const termsOnTop = random.number(scalingRange(2, 4), scalingRange(2, 4, false));
    let [coefficients, letter1s, letter2s, terms] = [[], [], [], []];
    for (let i = 0; i < termsOnTop; i++) {
        coefficients.push(random.number(2, 4));
        if(i == termsOnTop - 2) coefficients[coefficients.length - 1] = 1;
        letter1s.push(random.number(1, 3));
        letter2s.push(random.number(1, 3));
        const letter1sToPush = letter1s[i] > 1 ? letter1 + "^" + letter1s[i] : letter1;
        const letter2sToPush = letter2s[i] > 1 ? letter2 + "^" + letter2s[i] : letter2;
        terms.push(format.hideIfOne(coefficients[i], i == 0 ? false : true) + letter1sToPush + letter2sToPush);
    }
    if (!!letter1s.reduce(function(a, b) {return (a === b) ? a : NaN;})) letter1s[0] += 1;
    let letter1sToSubtract = Math.min(...letter1s);
    let letter2sToSubtract = Math.min(...letter2s);
    let topText = "";
    for(let i in terms) if(i < termsOnTop) topText += terms[i];
    let answerTerms = [];
    console.log(`${coefficients[coefficients.length - 1]} ${letter1s[letter1s.length - 1]} ${letter2s[letter2s.length - 1]}`);
    for(let i = 0; i < coefficients.length; i ++) {
        console.log(i);
        answerTerms[i] = format.hideIfOne(coefficients[i], i == 0 ? true : false);
        const newLetter1s = letter1s[i] - letter1sToSubtract;
        const letter1sInAnswer = newLetter1s > 0 ? (newLetter1s > 1 ? `${letter1}^${newLetter1s}` : `${letter1}`) : "";
        const newLetter2s = letter2s[i] - letter2sToSubtract;
        const letter2sInAnswer = newLetter2s > 0 ? (newLetter2s > 1 ? `${letter2}^${newLetter2s}` : `${letter2}`) : "";
        answerTerms[i] += (letter1sInAnswer + letter2sInAnswer);
       // if(answerTerms[i] == "+" || "-") {answerTerms[i] = 1;}
        console.log(answerTerms[i]);
    }
    console.log(answerTerms);
    let answerText = "";
    for(let i = 0; i < answerTerms.length - 1; i++) {
        answerText += (i != 0 ? "+" : "") + answerTerms[i];
    }

    const [denominatorLetter1Index, denominatorLetter2Index] = [letter1s.length - 1, letter2s.length - 1];
    const denominatorLetter1s = letter1s[denominatorLetter1Index] > 1 ? letter1 + "^" + letter1s[denominatorLetter1Index] : letter1;
    const denominatorLetter2s = letter1s[denominatorLetter2Index] > 1 ? letter2 + "^" + letter2s[denominatorLetter2Index] : letter2;
    const bottomText = denominatorLetter1s + denominatorLetter2s;
    questionText = `Simplify${format.wrapLatex(`\\frac\{${topText}\}\{${bottomText}\}`, true)}`;

    answers = [`(${answerText})/${answerTerms[answerTerms.length - 1]}`];
    stepsOfWorking = `This is a prototype version. The answer is ${answers[0]}.`;
//}