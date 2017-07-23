exports.getStringValue = function getStringValue(currentNode) {
    var value = "";
    if (typeof currentNode.text !== "undefined") {
        value = currentNode.text()
    }
    return value;
}
exports.validateScheduleTime = function validateScheduleTime(scheduleTime) {
    return typeof scheduleTime !== 'undefined' && scheduleTime !== 'n/a'
}