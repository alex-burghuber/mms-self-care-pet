// const ASCEND_PER_HOUR = 50000; // for debugging 
// const DECAY_PER_HOUR = 10000; // For debugging // for food and power is the same

const FOOD_DECAY_PER_HOUR = (DEFAULT_MAX_VALUE / 24) * 3; // Assumes food is empty (for a meal) 24/3 (3 meal at day)
const HIDRAT_DECAY_PER_HOUR = (DEFAULT_MAX_VALUE / 24) * 8; // Assumes food is empty (for a glass) 24/8 (8 glass at day)

const POWER_DECAY_PER_HOUR = DEFAULT_MAX_VALUE / 24 // is empty at end of the day
const POWER_ASCEND_PER_HOUR = DEFAULT_MAX_VALUE / 8; // Assumes power is full after 8 hours

var sleeping;

main();

function main() {
    // Saves the last unix timestamp in the local storage when the window is closed
    window.onbeforeunload = saveLastTimeStamp;

    document.querySelector('#valmeal').innerHTML = getCMeal();
    document.querySelector('#valdrink').innerHTML = getCDrink();

    setSleeping();
    refresh();

    setInterval(refresh, 1000); // Calls refresh every 1 seconds
}
//------------------------------------------------------------------------------

//------------------------ REFRESH FUNCTIONS -----------------------------------
function refresh() {
    const hoursPassed = getHoursPassedSinceLastTimestamp();

    // console.log(`Refreshing... Hours passed since last time: ${hoursPassed}h`);

    var today = new Date().getDay();
    updateFood(hoursPassed, today);
    updateHydration(hoursPassed, today);
    localStorage.setItem("day", today);

    updatePower(hoursPassed);
    saveLastTimeStamp();

    refreshUi();

    setButtons();
}

function refreshUi() {
    const food = getFood();
    const power = getPower();
    const hydration = getHydration();

    const alerts = [];

    let gifToUse = "images/rabbit_idle.gif"

    if (food <= FOOD_MIN_VALUE) { //hungry
        gifToUse = "images/rabbit_hungry.gif";
        alerts.push('You should eat');
    }

    if (hydration <= HYDRATION_MIN_VALUE) {  //thirsty
        gifToUse = "images/rabbit_thirsty.gif";
        alerts.push('You should drink');
    }

    document.getElementById("rabbit").src = gifToUse;

    if (sleeping) {
        document.getElementById("rabbit").src = "images/rabbit_sleep.gif";

        setButtonDonw();

        if (power == DEFAULT_MAX_VALUE) {
            document.getElementById("rabbit").src = "images/rabbit_jump.gif";
            wakeUp();
        } else if (power > POWER_FIT_TO_WAKE_UP_VALUE) { //it is fit to wake up

            document.getElementById("sleep-or-wake-up").onclick = onSleepOrWakeUpClicked;
            document.getElementById("sleep-or-wake-up").innerHTML = "???????<br>WAKE UP";
            document.getElementById("sleep-or-wake-up").classList.remove('press');


        } else { // too tiered to wake up
            document.getElementById("sleep-or-wake-up").onclick = "";
            document.getElementById("sleep-or-wake-up").innerHTML = "";
            document.getElementById("sleep-or-wake-up").classList.add('press');

        }

    } else if (power > POWER_TO_ACTIV_VALUE) { // too activ, can??t sleep

        setButtonUp();

        if (food <= FOOD_MIN_VALUE) { //hungry
            document.getElementById("rabbit").src = "images/rabbit_hungry.gif";
        } else if (hydration <= HYDRATION_MIN_VALUE) {  //thirsty
            document.getElementById("rabbit").src = "images/rabbit_thirsty.gif";

        } else {
            document.getElementById("rabbit").src = "images/rabbit_vibing.gif";
        }

        document.getElementById("sleep-or-wake-up").onclick = "";
        document.getElementById("sleep-or-wake-up").innerHTML = "";

    } else if (power > POWER_MIN_VALUE) { // it can try to sleep

        document.getElementById("sleep-or-wake-up").onclick = onSleepOrWakeUpClicked;
        document.getElementById("sleep-or-wake-up").innerHTML = "????????<br>SLEEP";

        setButtonUp();
        if (power < POWER_GO_TO_SLEEP_VALUE) {
            alerts.push('You should sleep');
        }

    } else { // tiered, it falls asleep
        document.getElementById("rabbit").src = "images/rabbit_sleep.gif";
        sleep();
    }
    document.getElementById("hydrationBar").value = hydration;
    document.getElementById("foodBar").value = food;
    document.getElementById("powerBar").value = power;

    const amountOfExercises = getExerciseDates().length;

    if (amountOfExercises === 3) {
        document.getElementById("p3").innerHTML = '??????';
        document.getElementById("p3").style.backgroundColor = "#09c709";
    } else {
        document.getElementById("p3").innerHTML = '';
        document.getElementById("p3").style.backgroundColor = "";
    }
    if (amountOfExercises >= 2) {
        document.getElementById("p2").innerHTML = '??????';
        document.getElementById("p2").style.backgroundColor = "#09c709";
    } else {
        document.getElementById("p2").innerHTML = '';
        document.getElementById("p2").style.backgroundColor = "";
    }
    if (amountOfExercises >= 1) {
        document.getElementById("p1").innerHTML = '??????';
        document.getElementById("p1").style.backgroundColor = "#09c709";
    } else {
        document.getElementById("p1").innerHTML = '';
        document.getElementById("p1").style.backgroundColor = "";
    }

    const name = getName();
    if (name === null) {
        document.getElementById("name").innerHTML = "Click to give me a name!";
    } else {
        document.getElementById("name").innerHTML = name;
    }

    if (alerts.length > 0) {
        let tag;

        if (document.getElementById("banner-wrapper").children.length === 0) {
            tag = '<div id="banner" class="banner-anim">'
            document.getElementById("central_panel").style.cssText =
                'animation: panel-move 250ms ease-out forwards;';
        } else {
            tag = '<div id="banner">'
        }

        tag += '<h2 style="margin: 15px">???? Infos</h2><ul style="margin: 15px">';

        alerts.forEach((alert) => tag += `<li>  ??? ${alert}</li>`);

        tag += "</ul></div>";

        document.getElementById("banner-wrapper").innerHTML = tag;
    } else {
        document.getElementById("banner-wrapper").innerHTML = "";
        document.getElementById("central_panel").style.cssText = 'animation: none;';
    }
}
//------------------------------------------------------------------------------


//------------------------- UPDATES FUNCTIONS ----------------------------------

//FOOD
function updateFood(hoursPassed, today) {
    var day = localStorage.getItem("day");
    if (day === null) {
        localStorage.setItem("day", new Date().getDay());
        day = localStorage.getItem("day");
    }
    if (day != today) { // new day. Do reset.
        saveFood(DEFAULT_MAX_VALUE);
        localStorage.setItem("meal", 5);

        let tag = '<div class="count"><p id="valmeal"></p></div>';

        document.querySelectorAll('.box-todo')[0].innerHTML = tag;
        document.querySelectorAll('.todos')[0].style.backgroundColor = "";
        document.getElementById("text-meal").innerText = "Eat healthy meal:";
        document.getElementById("text-meal").style.justifyContent = "";

        document.querySelector('#valmeal').innerHTML = getCMeal();
        document.getElementById("feed").classList.remove('press');
        document.getElementById("feed").onclick = onFeedClicked;
    }

    if (getFood() < FOOD_MIN_VALUE) {
        localStorage.setItem("meal", 1);

        let tag = '<div class="count"><span>+ </span><p id="valmeal"></p></div>';

        document.querySelectorAll('.box-todo')[0].innerHTML = tag;
        document.querySelectorAll('.todos')[0].style.backgroundColor = "";
        document.getElementById("text-meal").innerText = "Eat healthy meal:";
        document.getElementById("text-meal").style.justifyContent = "";

        document.querySelector('#valmeal').innerHTML = getCMeal();
        document.getElementById("feed").classList.remove('press');
        document.getElementById("feed").onclick = onFeedClicked;
    }
    const newFood = linearDecay(getFood(), FOOD_DECAY_PER_HOUR, hoursPassed);
    saveFood(newFood);

}

//WATER
function updateHydration(hoursPassed, today) {
    var day = localStorage.getItem("day");
    if (day === null) {
        localStorage.setItem("day", new Date().getDay());
        day = localStorage.getItem("day");
    }
    if (day != today) { // new day
        localStorage.setItem("drink", 10);
        let tag = '<div class="count"><p id="valdrink"></p></div>';

        document.querySelectorAll('.box-todo')[1].innerHTML = tag;
        document.querySelectorAll('.todos')[1].style.backgroundColor = "";
        document.getElementById("text-drink").innerText = "Drink glass of water:";
        document.getElementById("text-drink").style.justifyContent = "";


        document.querySelector('#valdrink').innerHTML = getCDrink();
        document.getElementById("drink").classList.remove('press');
        document.getElementById("drink").onclick = onHydrateClicked;
    }

    if (getHydration() < HYDRATION_MIN_VALUE) {
        localStorage.setItem("drink", 3);
        let tag = '<div class="count"><span>+</span><p id="valdrink"></p></div>';

        document.querySelectorAll('.box-todo')[1].innerHTML = tag;
        document.querySelectorAll('.todos')[1].style.backgroundColor = "";
        document.getElementById("text-drink").innerText = "Drink glass of water:";
        document.getElementById("text-drink").style.justifyContent = "";


        document.querySelector('#valdrink').innerHTML = getCDrink();
        document.getElementById("drink").classList.remove('press');
        document.getElementById("drink").onclick = onHydrateClicked;
    }

    const newhydration = linearDecay(getHydration(), HIDRAT_DECAY_PER_HOUR, hoursPassed);
    saveHydration(newhydration);
}


//POWER
function updatePower(hoursPassed) {
    if (sleeping) {
        const newPower = linearAscend(getPower(), POWER_ASCEND_PER_HOUR, hoursPassed);
        savePower(newPower);
    } else {
        const newPower = linearDecay(getPower(), POWER_DECAY_PER_HOUR, hoursPassed);
        savePower(newPower);
    }
}

function setSleeping() {
    if (localStorage.getItem("sleeping") == 1) {
        sleeping = true;
    } else {
        sleeping = false;
    }
}
//------------------------------------------------------------------------------


//------------------------------  TIME FUNCTIONS  ------------------------------

function getHoursPassedSinceLastTimestamp() {
    return (currentTimestampInSeconds() - localStorage.getItem("last_timestamp")) / 3600
}

function saveLastTimeStamp() {
    localStorage.setItem("last_timestamp", currentTimestampInSeconds());
}

function currentTimestampInSeconds() {
    return (new Date()).getTime() / 1000;
}
//--------------------------------------------------------------------------------


//------------------------------- VALUE FUNCTIONS---------------------------------
/**
 * Linear ascend formula N(t) = N0 + a * t
 * @param {number} currentValue N0
 * @param {number} ascendPerHour a
 * @param {number} hour t
 * @returns Current value
 */
function linearAscend(currentValue, ascendPerHour, hour) {
    return parseFloat(currentValue) + parseFloat(ascendPerHour * hour);
}

/**
 * Linear decay formula N(t) = N0 - a * t
 * @param {number} currentValue N0
 * @param {number} decayPerHour a
 * @param {number} hour t
 * @returns Current value
 */
function linearDecay(currentValue, decayPerHour, hour) {
    return currentValue - decayPerHour * hour;
}
//--------------------------------------------------------------------------------


//----------------------------  ONCLICK FUNCTIONS  -------------------------------

//FOOD
function onFeedClicked() {
    if (!sleeping) {
        doIt(getCMeal(), "meal");
        document.querySelector('#valmeal').innerHTML = getCMeal();;
        saveFood(DEFAULT_MAX_VALUE);
        refresh();
    }
}

//WATER
function onHydrateClicked() {
    if (!sleeping) {
        doIt(getCDrink(), "drink");
        document.querySelector('#valdrink').innerHTML = getCDrink();
        saveHydration(DEFAULT_MAX_VALUE);
        refresh();
    } else { refresh() }
}

//POWER
function onSleepOrWakeUpClicked() {
    if (sleeping) {
        wakeUp();
    } else {
        sleep();
    }
}

//SPORT
function onExerciseClicked() {
    if (!sleeping) {
        if (!addExerciseDate(new Date())) {
            alert('Sorry, no more exercises should be completed today!');
        }
        refresh();
    }
}
//--------------------------------------------------------------------------------


//---------------------------- OTHERS FUNCTIONS ----------------------------------

function sleep() {
    localStorage.setItem("sleeping", 1); //for set sleeping when reload the page
    sleeping = true;
    document.getElementById("sleep-or-wake-up").classList.replace("sleep", "wake-up");
    refresh();
}

function wakeUp() {
    localStorage.setItem("sleeping", 0); //for set sleeping when reload the page
    sleeping = false;

    refresh();
}


function onEditName() {
    const name = prompt("Enter a new name here:");
    saveName(name);
    refresh();
}
//--------------------------------------------------------------------------------


//-------------------------- BUTTONS FUNCTIONS -----------------------------------
function setButtonDonw() {
    document.getElementById("feed").classList.add('press');
    document.getElementById("drink").classList.add('press');
    document.getElementById("make-sport").classList.add('press');
}

function setButtonUp() {
    document.getElementById("feed").classList.remove('press');
    document.getElementById("drink").classList.remove('press');
    document.getElementById("make-sport").classList.remove('press');
}

function setButtons() {// when toDo it's doing
    let tag = '<samp style="font-size:30px">&#128516 </samp>'
    tag += '<samp style="font-size:30px">&#128077</samp>';

    if (getCMeal() == 0) { // to much eat
        let element = document.getElementById("feed");
        element.classList.add('press');
        element.onclick = "";

        element = document.getElementById("text-meal");
        element.innerText = "You did it!";
        element.style.display = "flex";
        element.style.justifyContent = "center";

        document.querySelectorAll('.box-todo')[0].innerHTML = tag;

        element = document.querySelectorAll('.todos')[0];
        element.style.backgroundColor = "aqua";
        element.style.borderRadius = "15px 30px";
    }

    if (getCDrink() == 0) { // to much drink
        let element = document.getElementById("drink");
        element.classList.add('press');
        element.onclick = "";

        element = document.getElementById("text-drink");
        element.innerText = "You did it!";
        element.style.display = "flex";
        element.style.justifyContent = "center";

        document.querySelectorAll('.box-todo')[1].innerHTML = tag;

        element = document.querySelectorAll('.todos')[1];
        element.style.backgroundColor = "aqua";
        element.style.borderRadius = "15px 30px";
    }
}
//--------------------------------------------------------------------------------