// ------------------------- CONSTANTS ---------------------------------

const DEFAULT_MAX_VALUE = 100; // default for all bars at max

const HYDRATION_MIN_VALUE = 20;
const FOOD_MIN_VALUE = 30;
const POWER_MIN_VALUE = 5;

const POWER_GO_TO_SLEEP_VALUE = (DEFAULT_MAX_VALUE/24)*8; 
const POWER_TO_ACTIV_VALUE = 90;
const POWER_FIT_TO_WAKE_UP_VALUE = 20;

// --------------------------------------------------------------------------

// ------------------------- FOOD FUNCTIONS ---------------------------------
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
// --------------------------------------------------------------------------


// ------------------------- HYDRATION FUNCTIONS ---------------------------------
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
// --------------------------------------------------------------------------


// ------------------------ POWER FUNCTIONS ---------------------------------
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
// --------------------------------------------------------------------------


// ------------------------ SPORT FUNCTIONS ---------------------------------
function addExerciseDate(date) {
    const savedExerciseDates = getExerciseDates();

    const wasAnyPerformedToday = savedExerciseDates.some((date) => isToday(new Date(date)));

    if (savedExerciseDates.length < 3 && !wasAnyPerformedToday) {
        savedExerciseDates.push(date.toISOString());
        localStorage.setItem("exercise_dates", JSON.stringify(savedExerciseDates));
        tochange = "exercises";
        return true;
    }
    return false;
}

function getExerciseDates() {
    const savedExerciseDatesStr = localStorage.getItem("exercise_dates");

    if (savedExerciseDatesStr === null) {
        return [];
    }

    const savedExerciseDates = JSON.parse(savedExerciseDatesStr);

    // Filter out exercise dates that are not this week
    const newExerciseDates = savedExerciseDates.filter(date => !isDateInThisWeek(date));
    localStorage.setItem("exercise_dates", JSON.stringify(newExerciseDates));

    return newExerciseDates;
}
// --------------------------------------------------------------------------


// ------------------------- NAME FUNCTIONS ---------------------------------
function saveName(newName) {
    if (newName === null | newName ==''){
        return;
    }
    localStorage.setItem("name", newName);
}

function getName() {
    return localStorage.getItem("name");
}
// --------------------------------------------------------------------------


// ------------------------- TIME FUNCTIONS ---------------------------------

function isToday(date) {
    const today = new Date();
    return date.getDate() == today.getDate()
        && date.getMonth() == today.getMonth()
        && date.getFullYear() == today.getFullYear();
}

function isDateInThisWeek(date) {
    const todayObj = new Date();
    const todayDate = todayObj.getDate();
    const todayDay = todayObj.getDay();

    // get first date of week
    const firstDayOfWeek = new Date(todayObj.setDate(todayDate - todayDay));

    // get last date of week
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

    // if date is equal or within the first and last dates of the week
    return date >= firstDayOfWeek && date <= lastDayOfWeek;
}
// --------------------------------------------------------------------------



// ----------------------- COUNTERS FUNCTIONS -------------------------------
function getCMeal() {
    let m = localStorage.getItem("meal"); 
    if(m === null) {
        localStorage.setItem("meal", 5);
        m = localStorage.getItem("meal");
    }
    return m;
}

function getCDrink() {
    let d = localStorage.getItem("drink"); 
    if(d === null) {
        localStorage.setItem("drink", 10);
        d = localStorage.getItem("drink");
    }
    return d;
}


function doIt(value, id) {
    --value;
    if (value < 0) {
        value = 0;
    }
    localStorage.setItem(id, value);
}
