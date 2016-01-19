// Ensures input numbers are always in range of min and max.
var limitNumber = function (num, min, max) {
  return Math.min(max, Math.max(num, min));
};

var randomFloor = function(numberOfFloors) {
  return Math.floor(Math.random() * numberOfFloors) + 1;
};

// Evaluates equality if values are within 1/100-millionth of each other.
var epsilonEquals = function (firstVal, secondVal) {
  return Math.abs(firstVal - secondVal) < 0.00000001;
};

var createBoolPassthroughFunction = function (owner, object, objPropertyName) {
  return function (val) {
    if (typeof val !== "undefined") {
      object[objPropertyName] = val ? true : false;
      object.trigger("change:" + objPropertyName, object[objPropertyName]);
      return owner;
    } else {
      return object[objPropertyName];
    }
  }
};

// Gets code from user and ensures basic syntax is correct.
var getCodeObjFromCode = function(code) {
    code = "({init: " + code +
           ", update: function(timeSinceUpdate, elevators, floors) {}});";

    return eval(code);
};

distanceNeededToAchieveSpeed = function (myVel, goalVel, acceleration) {
  return (Math.pow(goalVel, 2) - Math.pow(myVel, 2)) / (2 * acceleration);
};

accelerationToAcieveDistance = function (myVel, goalVel, distance) {
  return 0.5 * ((Math.pow(goalVel, 2) - Math.pow(myVel, 2)) / distance);
};
