const DEFAULT_MAX_VALUE = 100; // default for all bars at max
const HYDRATION_MIN_VALUE=50;
const FOOD_MIN_VALUE = 50;
const POWER_MIN_VALUE = 10;
const POWER_MIDI_VALUE = 60; 

// food functions
function getFood() {
    let food = localStorage.getItem("food");
    if (food === null) {
        // Setup food for the first time
        saveFood(DEFAULT_MAX_VALUE);
        food = localStorage.getItem("food");
    }
    return food;
}

function saveFood(value) {
    if (value < 0) {
        value = 0;
    } else if (value > DEFAULT_MAX_VALUE) {
        value = DEFAULT_MAX_VALUE;
    }
    localStorage.setItem("food", value);
}
//hydration functions
function getHydration() {
    let hydration = localStorage.getItem("hydration");
    if (hydration === null) {
        // Setup hydration for the first time
        saveHydration(DEFAULT_MAX_VALUE);
        hydration = localStorage.getItem("hydration");
    }
    return hydration;
}
function saveHydration(value) {
    if (value < 0) {
        value = 0;
    } else if (value > DEFAULT_MAX_VALUE) {
        value = DEFAULT_MAX_VALUE;
    }
    localStorage.setItem("hydration", value);
}
//power functions
function getPower() {
    let power = localStorage.getItem("power");
    if (power === null) {
        // Setup power for the first time
        savePower(DEFAULT_MAX_VALUE);
        power = localStorage.getItem("power");
    }
    return power;
}

function savePower(value) {
    if (value < 0) {
        value = 0;
    } else if (value > DEFAULT_MAX_VALUE) {
        value = DEFAULT_MAX_VALUE;
    }
    localStorage.setItem("power", value);
}

// function getSleeping () {
//     let sleeping = localStorage.getItem("sleeping");
//     if (sleeping === null) {
//         saveSleeping(false);
//         sleeping = localStorage.getItem("sleeping");
//     }
//     return sleeping;
// }
// function saveSleeping(value) {
//     localStorage.setItem("sleeping", value);
// }