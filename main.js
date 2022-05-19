// const FOOD_DECAY_PER_HOUR = FOOD_DEFAULT_VALUE / 24; // Assumes food is empty after 24 hours
const FOOD_DECAY_PER_HOUR = 10000; // For debugging

main();

function main() {
    // Saves the last unix timestamp in the local storage when the window is closed.
    window.onbeforeunload = saveLastTimeStamp;

    refresh();
    
    // setInterval(refresh, 10000); // Calls refresh every 10 seconds
    setInterval(refresh, 1000); // For debugging: Calls refresh every second
}

function refresh() {
    const hoursPassed = getHoursPassedSinceLastTimestamp();

    console.log(`Refreshing... Hours passed since last time: ${hoursPassed}h`);

    updateFood(hoursPassed);
    saveLastTimeStamp();

    refreshUi();
}

function refreshUi() {
    document.getElementById("foodBar").value = getFood();
}

function updateFood(hoursPassed) {
    const newFood = linearDecay(getFood(), FOOD_DECAY_PER_HOUR, hoursPassed);
    saveFood(newFood);
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

function currentTimestampInSeconds() {
    return (new Date()).getTime() / 1000;
}

function onFeedClicked() {
    saveFood(FOOD_DEFAULT_VALUE);
    refresh();
}
