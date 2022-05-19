const FOOD_DEFAULT_VALUE = 100;
const FOOD_MIN_VALUE = 50;

function getFood() {
    let food = localStorage.getItem("food");
    if (food === null) {
        // Setup food for the first time
        saveFood(FOOD_DEFAULT_VALUE);
        food = localStorage.getItem("food");
    }
    return food;
}

function saveFood(value) {
    if (value < 0) {
        value = 0;
    } else if (value > FOOD_DEFAULT_VALUE) {
        value = FOOD_DEFAULT_VALUE;
    }
    localStorage.setItem("food", value);
}
