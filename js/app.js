const minOptionValue = 1;
const maxOptionValue = 12;
const maxRows = 4;
const minDiff = 4;
const maxDiff = 24;

const setWindowSize = (minValue, maxValue) => {
    const game = document.querySelector(".game");
    const w = window.innerWidth;
    const h = window.innerHeight;

    game.style.width = w + "px";
    game.style.height = h + "px";

    if (minValue && maxValue) {
        const basis = 100 / ((maxValue - (minValue-1)) * 2 / maxRows);
        const optionWidth = window.innerWidth / ((maxValue - (minValue-1)) * 2 / maxRows);
        const options = document.querySelectorAll(".game__option");
        for (o of options) {
            o.style.width = optionWidth + "px";
            o.querySelector(".game__option-value").style.fontSize = (basis / 2) - 5 + "vh";
        }
    }
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

const addDifficulty = (e, addFactor = 2) => {
    const currentDiff = parseInt(document.querySelector(".game").dataset.currentDiff);
    const newDiff = currentDiff + addFactor <= maxDiff ? currentDiff + addFactor : currentDiff;

    if (currentDiff != newDiff) {
        initGame(minOptionValue, newDiff, false);
    }
}

const subDifficulty = (e, subFactor = 2) => {
    const currentDiff = parseInt(document.querySelector(".game").dataset.currentDiff);
    const newDiff = currentDiff - subFactor >= minDiff ? currentDiff - subFactor : currentDiff;

    if (currentDiff != newDiff) {
        initGame(minOptionValue, newDiff, false);
    }
}

const getSettingTrigger = () => {
    let trigger = document.createElement("img");
    trigger.src = "./images/settings.svg";
    trigger.alt = "Settings";
    trigger.className = "game__settings-trigger";
    trigger.addEventListener("click", toggleMenu);

    return trigger;
}

const getSettingMenu = () => {
    let setting = document.createElement("div");
    setting.className = "game__settings";

    let menu = document.createElement("ul");
    menu.className = "game__menu";

    ////
    let difficultyOption = document.createElement("li");
    difficultyOption.className = "game__menu-option";
    difficultyOption.textContent = "Difficulty";

    let subDifficultyElement = document.createElement("span");
    subDifficultyElement.textContent = "-";
    subDifficultyElement.className = "difficulty-modifier sub";
    subDifficultyElement.addEventListener("click", subDifficulty);

    let addDifficultyElement = document.createElement("span");
    addDifficultyElement.textContent = "+";
    addDifficultyElement.className = "difficulty-modifier add";
    addDifficultyElement.addEventListener("click", addDifficulty);

    difficultyOption.appendChild(subDifficultyElement);
    difficultyOption.appendChild(addDifficultyElement);

    menu.appendChild(difficultyOption);
    ////

    let closeSetting = document.createElement("div");
    closeSetting.className = "game__settings-close";
    closeSetting.textContent = "Close";
    closeSetting.addEventListener("click", toggleMenu);

    setting.appendChild(menu);
    setting.appendChild(closeSetting);

    return setting;
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
        initGame(minOptionValue, maxOptionValue);
    });

    result.appendChild(resultText);
    result.appendChild(resultRestart);

    return result;
}

const toggleMenu = () => {
    const menu = document.querySelector(".game__settings");
    if (menu.classList.contains("open")) {
        menu.classList.remove("open");
    } else {
        menu.classList.add("open");
    }
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

const initGame = (minValue, maxValue, clearMenu = true) => {
    let game = document.querySelector(".game");
    game.innerHTML = "";
    game.dataset.currentDiff = maxValue;
    const basis = 100 / ((maxValue - (minValue-1)) * 2 / maxRows);
    const optionWidth = window.innerWidth / ((maxValue - (minValue-1)) * 2 / maxRows);
    let usedValues = [];

    game.style.flexBasis = basis + "%";

    const scoring = getScoreBoard();
    const result = getResult();
    const settingTrigger = getSettingTrigger();
    const settingMenu = getSettingMenu();

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
    if (clearMenu) {
        if(document.querySelector(".game__settings-trigger")) {
            document.querySelector(".game__settings-trigger").remove();
        }

        if (document.querySelector(".game__settings")) {
            document.querySelector(".game__settings").remove();
        }

        document.body.appendChild(settingTrigger);
        document.body.appendChild(settingMenu);
    }
}

document.addEventListener("DOMContentLoaded", e => {
    initGame(minOptionValue, maxOptionValue);
    setWindowSize();
});

window.addEventListener("resize", e => {
    setWindowSize(minOptionValue, maxOptionValue);
});