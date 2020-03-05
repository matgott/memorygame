const setWindowSize = () => {
    const game = document.querySelector(".game");
    const w = window.innerWidth;
    const h = window.innerHeight;

    game.style.width = w + "px";
    game.style.height = h + "px";    
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

const initGame = (minValue, maxValue) => {
    const maxRows = 4;
    const basis = 100 / ((maxValue - (minValue-1)) * 2 / maxRows);
    let usedValues = [];

    document.querySelector(".game").style.flexBasis = basis + "%";

    [...Array(maxValue*2)].map(() => {
        let n = ~~(Math.random() * maxValue) + minValue; //~~ is shorthand for Math.floor()
        while (usedValues.filter(e => e == n).length > 1) {
            n = ~~(Math.random() * maxValue) + minValue;
        }
        usedValues.push(n);

        let o = getOptionElement(n);
        o.style.width = basis + "vw";
        o.querySelector(".game__option-value").style.fontSize = (basis / 2) + "vw";

        document.querySelector(".game").appendChild(o);
    });

}

window.addEventListener("DOMContentLoaded", e => {
    initGame(1, 24);
    setWindowSize();
});

window.addEventListener("resize", e => {
    setWindowSize();
});