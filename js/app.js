const setWindowSize = () => {
    const game = document.querySelector(".game");
    const w = window.innerWidth;
    const h = window.innerHeight;

    game.style.width = w + "px";
    game.style.height = h + "px";    
}

const getScoreBoard = () => {
    let scoring = document.createElement("div");
    scoring.className ="game__scoring";
    scoring.textContent = "Moves: ";
    let scoreValue = document.createElement("span");
    scoreValue.className = "game__scoring-value";
    scoreValue.textContent = "0";
    scoring.appendChild(scoreValue);

    return scoring;
}

const getResult = () => {
    let result = document.createElement("div");
    result.className = "game__result";

    let resultText = document.createElement("div");
    resultText.className = "game__result-text";
    resultText.innerHTML = "You finish the game with <span class='moves'>X</span> moves";

    let resultRestart = document.createElement("button");
    resultRestart.className = "game__result-restart";
    resultRestart.type = "button";
    resultRestart.textContent = "RESTART";
    resultRestart.addEventListener("click", e => {
        initGame(1, 4);
    });

    result.appendChild(resultText);
    result.appendChild(resultRestart);

    return result;
}

const getOptionElement = (v) => {
    const option = document.createElement("div");
    option.className = "game__option";
    
    const value = document.createElement("div");
    value.className = "game__option-value";
    value.innerHTML = v;

    option.appendChild(value);

    return option;
}

const toggleClass = (e, c) => {
    if (e.classList.contains(c)) {
        e.classList.remove(c);
    } else {
        e.classList.add(c);
    }
}

const setCorrectOptions = (previousOption, currentOption) => {
    toggleClass(currentOption, "correct");

    toggleClass(previousOption, "correct");
    toggleClass(previousOption, "selected");

    setTimeout(() => {
        toggleClass(currentOption, "correct");
        toggleClass(currentOption, "hidden");
        
        toggleClass(previousOption, "correct");
        toggleClass(previousOption, "hidden");

        isFinish();
    }, 700);
}

const setErrorOptions = (previousOption, currentOption) => {
    toggleClass(currentOption, "error");

    toggleClass(previousOption, "error");
    toggleClass(previousOption, "selected");

    setTimeout(() => {
        toggleClass(currentOption, "error");
        
        toggleClass(previousOption, "error");
    }, 700);
}

const addMove = () => {
    let score = parseInt(document.querySelector(".game__scoring-value").textContent);
    document.querySelector(".game__scoring-value").textContent = ++score;
}

const isFinish = () => {
    const totalOptions = document.querySelectorAll(".game__option").length;
    const hiddenOptions = document.querySelectorAll(".game__option.hidden").length;

    if (totalOptions == hiddenOptions) {
        const moves = document.querySelector(".game__scoring-value").innerHTML;
        document.querySelector(".game__result-text .moves").textContent = moves;
        toggleClass(document.querySelector(".game__result"), "active");
    }
}

const checkOption = (e) => {
    const option = e.target;
    const value = parseInt(e.target.querySelector(".game__option-value").innerHTML);

    //If click on hidden element, do nothing
    if (option.classList.contains("hidden")) {
        return;
    }

    //If click on the same element, remove selected class
    if (option.classList.contains("selected")) {
        toggleClass(option, "selected");
        addMove();
        return;
    }

    const previousOption = document.querySelector(".game__option.selected");

    //If not exists previous option selected, set selected current option
    if (!previousOption) {
        toggleClass(option, "selected");
    } else {
        addMove();
        const previousValue = parseInt(previousOption.querySelector(".game__option-value").innerHTML);

        //If values are the same, so the option is correct
        if (value == previousValue) {
            setCorrectOptions(previousOption, option);
        } else {
            setErrorOptions(previousOption, option);
        }
    }
}

const initGame = (minValue, maxValue) => {
    let game = document.querySelector(".game");
    game.innerHTML = "";
    const maxRows = 4;
    const basis = 100 / ((maxValue - (minValue-1)) * 2 / maxRows);
    const optionWidth = window.innerWidth / ((maxValue - (minValue-1)) * 2 / maxRows);
    let usedValues = [];

    game.style.flexBasis = basis + "%";

    const scoring = getScoreBoard();
    const result = getResult();

    [...Array(maxValue*2)].map(() => {
        let n = ~~(Math.random() * maxValue) + minValue; //~~ is shorthand for Math.floor()
        while (usedValues.filter(e => e == n).length > 1) {
            n = ~~(Math.random() * maxValue) + minValue;
        }
        usedValues.push(n);

        let o = getOptionElement(n);
        o.addEventListener("click", checkOption);
        o.style.width = optionWidth + "px";
        o.querySelector(".game__option-value").style.fontSize = (basis / 2) - 5 + "vh";

        game.appendChild(o);
    });

    game.appendChild(scoring);
    game.appendChild(result);
}

window.addEventListener("DOMContentLoaded", e => {
    initGame(1, 4);
    setWindowSize();
});

window.addEventListener("resize", e => {
    setWindowSize();
});