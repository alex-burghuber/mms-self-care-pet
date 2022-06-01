
const DECAY_PER_HOUR = 10000; // For debugging // for food and power is the same

const FOOD_DECAY_PER_HOUR = DECAY_PER_HOUR / 24; // Assumes food is empty after 24 hours
const POWER_DECAY_PER_HOUR = DECAY_PER_HOUR /24; // Assumes power is empty after 24 hours

const POWER_ASCEND_PER_HOUR = DECAY_PER_HOUR / 8; // Assumes power is full after 8 hours
const ASCEND_PER_HOUR = 50000; // for debugging 


//-----------------------
const feedB = document.getElementById('feed');
const wasserB = document.getElementById('drink');
const sleepB =document.getElementById('sleep-or-wake-up');
const sportB = document.getElementById('make-sport'); 
// ----------------------




main();


var sleeping;
function setSleeping() {
    if(localStorage.getItem("sleeping") == 1){
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

    if (food <= FOOD_MIN_VALUE) { //hungry
        document.getElementById("rabbit").src = "images/rabbit_hungry.gif";
    } else if (hydration <= HYDRATION_MIN_VALUE) {  //thirsty
        document.getElementById("rabbit").src = "images/rabbit_thirsty.gif";
    }  else {
        document.getElementById("rabbit").src = "images/rabbit_idle.gif";
    }


    if (sleeping){
        document.getElementById("rabbit").src = "images/rabbit_sleep.gif";
        // setButtonDonw();
        document.getElementById("feed").classList.add('press');
        // document.getElementById("feed").classList.add('press:hover');
       if (power == DEFAULT_MAX_VALUE) {
            document.getElementById("rabbit").src = "images/rabbit_jump.gif";
            wakeUp();
        } else if (power > POWER_MIDI_VALUE ) { //it is fit to wake up
            document.getElementById("sleep-or-wake-up").innerHTML = "⏰🌄<br>WAKE UP";
            
        } else { // too tiered to wake up
            document.getElementById("sleep-or-wake-up").innerHTML = "";  
        }

    } else if (power > POWER_MIDI_VALUE) { // too activ, can´t sleep
        if (food <= FOOD_MIN_VALUE) { //hungry
            document.getElementById("rabbit").src = "images/rabbit_hungry.gif";
        }  else if (hydration <= HYDRATION_MIN_VALUE) {  //thirsty
            document.getElementById("rabbit").src = "images/rabbit_thirsty.gif";
            notifyMe();
        }  else {
            document.getElementById("rabbit").src = "images/rabbit_vibing.gif";
        }
        
        document.getElementById("sleep-or-wake-up").innerHTML = "";  
  

    } else if (power > POWER_MIN_VALUE) { // it can try to sleep

        document.getElementById("sleep-or-wake-up").innerHTML = "💤💤<br>SLEEP";
 
    } else { // tiered, it falls asleep
        document.getElementById("rabbit").src = "images/rabbit_sleep.gif";
        sleep();
    }
    
    document.getElementById("hydrationBar").value = hydration;
    document.getElementById("foodBar").value = food;
    document.getElementById("powerBar").value = power;
}

function updateFood(hoursPassed) {
    const newFood = linearDecay(getFood(), FOOD_DECAY_PER_HOUR*100, hoursPassed);
    saveFood(newFood);
}
function updateHydration(hoursPassed) {
    const newhydration = linearDecay(getHydration(), DECAY_PER_HOUR*4, hoursPassed);
    saveHydration(newhydration);
}

function updatePower(hoursPassed) {
    if(sleeping){  
        const newPower = linearAscend(getPower(), POWER_ASCEND_PER_HOUR*10, hoursPassed);
        savePower(newPower);
    } else {
        const newPower = linearDecay(getPower(), POWER_DECAY_PER_HOUR*100, hoursPassed);
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
    if(!sleeping){
        saveFood(DEFAULT_MAX_VALUE);
        refresh();
    }
}
function onHydrateClicked() {
    if(!sleeping){
        saveHydration(DEFAULT_MAX_VALUE);
        refresh();
    }else {refresh()}
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




function setButtonDonw () {
    feedB.style.boxShadow = '3px 5px rgb(92, 100, 75) inset';
    wasserB.style.boxShadow = '3px 5px rgb(92, 100, 75) inset';
    sleepB.style.boxShadow = '3px 5px rgb(92, 100, 75) inset';
    sportB.style.boxShadow = '3px 5px rgb(92, 100, 75) inset';
}

function wakeUp() {
    localStorage.setItem("sleeping", 0); //for set sleeping when reload the page
    sleeping = false;
    
    refresh();
}
