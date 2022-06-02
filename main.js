
const DECAY_PER_HOUR = 10000; // For debugging // for food and power is the same

const FOOD_DECAY_PER_HOUR = DECAY_PER_HOUR / 24; // Assumes food is empty after 24 hours
const POWER_DECAY_PER_HOUR = DECAY_PER_HOUR / 24; // Assumes power is empty after 24 hours

const POWER_ASCEND_PER_HOUR = DECAY_PER_HOUR / 8; // Assumes power is full after 8 hours
const ASCEND_PER_HOUR = 50000; // for debugging 

main();

var sleeping;
function setSleeping() {
    if (localStorage.getItem("sleeping") == 1) {
        sleeping = true;
    } else {
        sleeping = false;
    }
}

function main() {
    // Saves the last unix timestamp in the local storage when the window is closed
    window.onbeforeunload = saveLastTimeStamp;

    setSleeping();
    refresh();

    // setInterval(refresh, 10000); // Calls refresh every 10 seconds
    setInterval(refresh, 1000); // For debugging: Calls refresh every second
}

function refresh() {
    const hoursPassed = getHoursPassedSinceLastTimestamp();

    // console.log(`Refreshing... Hours passed since last time: ${hoursPassed}h`);

    updateFood(hoursPassed);
    updateHydration(hoursPassed);
    updatePower(hoursPassed);
    saveLastTimeStamp();

    refreshUi();
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
            document.getElementById("sleep-or-wake-up").innerHTML = "⏰🌄<br>WAKE UP";
            document.getElementById("sleep-or-wake-up").classList.remove('press');


        } else { // too tiered to wake up
            document.getElementById("sleep-or-wake-up").onclick = "";
            document.getElementById("sleep-or-wake-up").innerHTML = "";
            document.getElementById("sleep-or-wake-up").classList.add('press');

        }

    } else if (power > POWER_TO_ACTIV_VALUE) { // too activ, can´t sleep

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
        // document.getElementById("sleep-or-wake-up").classList.add('press');


    } else if (power > POWER_MIN_VALUE) { // it can try to sleep

        document.getElementById("sleep-or-wake-up").onclick = onSleepOrWakeUpClicked;
        document.getElementById("sleep-or-wake-up").innerHTML = "💤💤<br>SLEEP";
        // document.getElementById("sleep-or-wake-up").classList.remove('press');


        setButtonUp();

        if (power < POWER_GO_TO_SLEEP_VALUE){
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
        document.getElementById("p3").innerHTML = '✔️';
        document.getElementById("p3").style.backgroundColor="#09c709";
    } else {
        document.getElementById("p3").innerHTML = '';
        document.getElementById("p3").style.backgroundColor="";
    }
    if (amountOfExercises >= 2) {
        document.getElementById("p2").innerHTML = '✔️';
        document.getElementById("p2").style.backgroundColor="#09c709";
    } else {
        document.getElementById("p2").innerHTML = '';
        document.getElementById("p2").style.backgroundColor="";
    }
    if (amountOfExercises >= 1) {
        document.getElementById("p1").innerHTML = '✔️';
        document.getElementById("p1").style.backgroundColor="#09c709";
    } else {
        document.getElementById("p1").innerHTML = '';
        document.getElementById("p1").style.backgroundColor="";
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
        } else {
            tag = '<div id="banner">'
        }

        tag += '<h2 style="margin: 15px">📝 Infos</h2><ul style="margin: 15px">';
        
        alerts.forEach((alert) => tag += `<li>  ➡ ${alert}</li>`);
    
        tag += "</ul></div>";

        document.getElementById("banner-wrapper").innerHTML = tag;
    } else {
        document.getElementById("banner-wrapper").innerHTML = "";
    }
}

function updateFood(hoursPassed) {
    const newFood = linearDecay(getFood(), DECAY_PER_HOUR, hoursPassed);
    saveFood(newFood);
}

function updateHydration(hoursPassed) {
    const newhydration = linearDecay(getHydration(), DECAY_PER_HOUR, hoursPassed);
    saveHydration(newhydration);
}

function updatePower(hoursPassed) {
    if (sleeping) {
        const newPower = linearAscend(getPower(), DECAY_PER_HOUR, hoursPassed);
        savePower(newPower);
    } else {
        const newPower = linearDecay(getPower(), DECAY_PER_HOUR, hoursPassed);
        savePower(newPower);
    }
}

function getHoursPassedSinceLastTimestamp() {
    return (currentTimestampInSeconds() - localStorage.getItem("last_timestamp")) / 3600
}

function saveLastTimeStamp() {
    localStorage.setItem("last_timestamp", currentTimestampInSeconds());
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

function currentTimestampInSeconds() {
    return (new Date()).getTime() / 1000;
}

function onFeedClicked() {
    if (!sleeping) {
        saveFood(DEFAULT_MAX_VALUE);
        refresh();
    }
}

function onHydrateClicked() {
    if (!sleeping) {
        saveHydration(DEFAULT_MAX_VALUE);
        refresh();
    } else { refresh() }
}

function onSleepOrWakeUpClicked() {
    if (sleeping) {
        wakeUp();
    } else {
        sleep();
    }
}

function sleep() {
    localStorage.setItem("sleeping", 1); //for set sleeping when reload the page
    sleeping = true;
    setButtonDonw();
    refresh();
}

function wakeUp() {
    localStorage.setItem("sleeping", 0); //for set sleeping when reload the page
    sleeping = false;

    refresh();
}

function onExerciseClicked() {
    if (!sleeping) {
        if (!addExerciseDate(new Date())) {
            alert('Sorry, no more exercises should be completed today!');
        }
        refresh();
    }
}

function onEditName() {
    const name = prompt("Enter a new name here:");
    saveName(name);
    refresh();
}

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
