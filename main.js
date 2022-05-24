const FOOD_DECAY_PER_HOUR = DEFAULT_MAX_VALUE / 24; // Assumes food is empty after 24 hours
const POWER_DECAY_PER_HOUR = DEFAULT_MAX_VALUE /24; // Assumes power is empty after 24 hours
//const DECAY_PER_HOUR = 10000; // For debugging // for food and power is the same

const POWER_ASCEND_PER_HOUR = DEFAULT_MAX_VALUE / 8; // Assumes power is full after 8 hours
//const ASCEND_PER_HOUR = 50000; // for debugging 


main();

function main() {
    // Saves the last unix timestamp in the local storage when the window is closed
    window.onbeforeunload = saveLastTimeStamp;

    refresh();
    
    // setInterval(refresh, 10000); // Calls refresh every 10 seconds
    setInterval(refresh, 1000); // For debugging: Calls refresh every second
}

function refresh() {
    const hoursPassed = getHoursPassedSinceLastTimestamp();

   // console.log(`Refreshing... Hours passed since last time: ${hoursPassed}h`);

    updateFood(hoursPassed);
    updatePower(hoursPassed);
    saveLastTimeStamp();

    refreshUi();
}

function refreshUi() {
    
    const food = getFood();
    const power = getPower();


    if (food <= FOOD_MIN_VALUE) { //hungry
        document.getElementById("rabbit").src = "images/rabbit_hungry.gif";
    }  else {
        document.getElementById("rabbit").src = "images/rabbit_idle.gif";
    }

    if (getSleeping()){
        document.getElementById("rabbit").src = "images/rabbit_sleep.gif";
       if (power == DEFAULT_MAX_VALUE) {
            document.getElementById("rabbit").src = "images/rabbit_jump.gif";
            wakeUp();
        } else if (power > POWER_MIDI_VALUE ) { //it is fit to wake up
            document.getElementById("sleep-or-wake-up").onclick = onSleepOrWakeUpClicked;
            document.getElementById("sleep-or-wake-up").innerHTML = "⏰🌄<br>WAKE UP";
            document.getElementById("sleep-or-wake-up").style.boxShadow = ""; 

        } else { // too tiered to wake up
            document.getElementById("sleep-or-wake-up").onclick = "";
            document.getElementById("sleep-or-wake-up").innerHTML = "";  
            document.getElementById("sleep-or-wake-up").style.boxShadow = "none"; 
        }
    } else if (power > POWER_MIDI_VALUE) { // too activ, can´t sleep
        document.getElementById("rabbit").src = "images/rabbit_vibing.gif";
        document.getElementById("sleep-or-wake-up").onclick = "";
        document.getElementById("sleep-or-wake-up").innerHTML = ""; 
        document.getElementById("sleep-or-wake-up").style.boxShadow = "none";  

    } else if (power > POWER_MIN_VALUE) { // it can try to sleep
        document.getElementById("sleep-or-wake-up").onclick = onSleepOrWakeUpClicked; 
        document.getElementById("sleep-or-wake-up").innerHTML = "💤💤<br>SLEEP";
        document.getElementById("sleep-or-wake-up").style.boxShadow = "";  
    } else { // tiered, it falls asleep
        document.getElementById("rabbit").src = "images/rabbit_sleep.gif";
        sleep();
    }
    
    

    document.getElementById("foodBar").value = food;
    document.getElementById("powerBar").value = power;
}

function updateFood(hoursPassed) {
    const newFood = linearDecay(getFood(), FOOD_DECAY_PER_HOUR, hoursPassed);
    saveFood(newFood);
}

function updatePower(hoursPassed) {
    if(getSleeping()){  
        const newPower = linearAscend(getPower(), POWER_ASCEND_PER_HOUR, hoursPassed);
        savePower(newPower);
    } else {
        const newPower = linearDecay(getPower(), POWER_DECAY_PER_HOUR, hoursPassed);
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
    saveFood(DEFAULT_MAX_VALUE);
    refresh();
}

function onSleepOrWakeUpClicked() {
   if (getSleeping()) {
        wakeUp();
    } else {
        sleep();
    }

}

function sleep() {
    saveSleeping(true);
    document.getElementById("sleep-or-wake-up").classList.replace("sleep", "wake-up");
    refresh();
}

function wakeUp() {
    saveSleeping(false);
    document.getElementById("sleep-or-wake-up").classList.replace("wake-up", "sleep");
    refresh();
}
