const FOOD_DEFAULT_VALUE = 100;
const FOOD_DECAY_PER_HOUR = FOOD_DEFAULT_VALUE / 24; // Assumes food is empty after 24 hours

let x = 1;

document.addEventListener("DOMContentLoaded", () => {
    // DOM is ready, run main code here

    const lastTimeStamp = localStorage.getItem("last_timestamp");
    if (lastTimeStamp === null) {
        // Called when the site is opened for the very first time
    }

    let food = localStorage.getItem("food");
    if (food === null) {
        // Setup food for the first time
        localStorage.setItem("food", FOOD_DEFAULT_VALUE);
        food = FOOD_DEFAULT_VALUE;
    }

    const hoursPassed = (currentTimestamp() - lastTimeStamp) / 3600;
    console.log(`Hours passed since last time: ${hoursPassed}h`);
    food = linearDecay(food, FOOD_DECAY_PER_HOUR, hoursPassed);

    document.getElementById("foodBar").value = food;

    setInterval(() => {
        console.log("ey");
    }, 5000);

    /**
    * Saves the last unix timestamp in the local storage when the window is closed.
    */
    window.onbeforeunload = () => {
        localStorage.setItem("last_timestamp", currentTimestamp());
    };
});

/**
 * Linear decay formula N(t) = N0 - a * t
 * @param {*} startValue N0
 * @param {*} decayPerHour a
 * @param {*} hour t
 * @returns Current value
 */
function linearDecay(startValue, decayPerHour, hour) {
    return startValue - decayPerHour * hour;
}

function currentTimestamp() {
    return (new Date()).getTime() / 1000;
}

function onButtonClick(ev) {
    alert('Hello There!');
}
