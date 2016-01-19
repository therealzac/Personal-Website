var timeLimit = function (revenue, timeLimit) {
  var description = "Generate $" + revenue +
                    " in " + timeLimit +
                    " seconds!";

  return {
    description: description,
    evaluate: function (world) {
      if (world.elapsedTime >= timeLimit ||
          world.revenue >= revenue) {

        return (world.elapsedTime <= timeLimit &&
                world.revenue >= revenue);

      } else {
        return null;
      }
    }
  };
};

var waitLimit = function (revenue, waitLimit) {
  var description = "Generate $" + revenue +
                    ". Let nobody wait for more than " + waitLimit +
                    " seconds!";

  return {
    description: description,
    evaluate: function (world) {
      if (world.maxWait >= waitLimit ||
          world.revenue >= revenue) {

        return (world.maxWait <= waitLimit &&
                world.revenue >= revenue);

      } else {
        return null;
      }
    }
  };
};

var moveLimit = function (revenue, moveLimit) {
  var description = "Generate $" + revenue +
                    " using only " + moveLimit +
                    " moves!"

  return {
    description: description,
    evaluate: function (world) {
      if (world.moveCount >= moveLimit ||
          world.revenue >= revenue) {

        return (world.moveCount <= moveLimit &&
                world.revenue >= revenue);

      } else {
        return null;
      }
    }
  };
};

var timeAndWaitLimit = function (revenue, timeLimit, waitLimit) {
  var description = "Generate $" + revenue +
                    " in " + timeLimit +
                    " seconds. Let nobody wait for more than " + waitLimit +
                    " seconds!";

  return {
    description: description,
    evaluate: function (world) {
      if (world.elapsedTime >= timeLimit ||
          world.revenue >= revenue ||
          world.maxWait >= waitLimit) {

        return (world.elapsedTime <= timeLimit &&
                world.revenue >= revenue &&
                world.maxWait <= waitLimit);

      } else {
        return null;
      }
    }
  };
};

var timeAndMoveLimit = function (revenue, timeLimit, moveLimit) {
  var description = "Generate $" + revenue +
                    " in " + timeLimit +
                    " seconds using only " + moveLimit +
                    " moves!";

  return {
    description: description,
    evaluate: function (world) {
      if (world.elapsedTime >= timeLimit ||
          world.revenue >= revenue ||
          world.moveCount >= moveLimit) {

        return (world.elapsedTime <= timeLimit &&
                world.revenue >= revenue &&
                world.moveCount <= moveLimit);

      } else {
        return null;
      }
    }
  };
};

var allLimits = function (revenue, timeLimit, moveLimit, waitLimit) {
  var description = "Generate $" + revenue +
                    " in " +timeLimit +
                    " seconds using only " + moveLimit +
                    " moves. Let nobody wait for more than " + waitLimit +
                    " seconds!"

  return {
    description: description,
    evaluate: function (world) {
      if (world.elapsedTime >= timeLimit ||
          world.revenue >= revenue ||
          world.moveCount >= moveLimit ||
          world.maxWait >= waitLimit) {

        return (world.elapsedTime <= timeLimit &&
                world.revenue >= revenue &&
                world.moveCount <= moveLimit &&
                world.maxWait <= waitLimit);

      } else {
        return null;
      }
    }
  };
};


var noLimits = function () {
  var description = "Have fun!";
  return {
    description: description,
    evaluate: function () { return null; }
  };
};

var challenges = [
     {options: {floorCount: 5,
                elevatorCount: 1,
                spawnRate: 0.3},
                condition: timeLimit(20, 70)},

     {options: {floorCount: 7,
                elevatorCount: 2,
                spawnRate: 0.3},
                condition: timeLimit(20, 60)},

     {options: {floorCount: 5,
                elevatorCount: 1,
                spawnRate: 0.5,
                elevatorCapacities: [6]},
                condition: moveLimit(30, 60)},
     {options: {floorCount: 8,
                elevatorCount: 2,
                spawnRate: 0.6},
                condition: moveLimit(30, 60)},

     {options: {floorCount: 6,
                elevatorCount: 4,
                spawnRate: 1.7},
                condition: waitLimit(100, 15)},

     {options: {floorCount: 4,
                elevatorCount: 2,
                spawnRate: 0.8},
                condition: waitLimit(40, 60)},

     {options: {floorCount: 3,
                elevatorCount: 3,
                spawnRate: 3.0},
                condition: timeAndMoveLimit(100, 63)},

     {options: {floorCount: 6,
                elevatorCount: 2,
                spawnRate: 0.4,
                elevatorCapacities: [5]},
                condition: timeAndWaitLimit(50, 21)},

     {options: {floorCount: 7,
                elevatorCount: 3,
                spawnRate: 0.6},
                condition: waitLimit(50, 20)},

     {options: {floorCount: 13,
                elevatorCount: 2,
                spawnRate: 1.1,
                elevatorCapacities: [4,10]},
                condition: timeLimit(50, 70)},

     {options: {floorCount: 9,
                elevatorCount: 5,
                spawnRate: 1.1},
                condition: waitLimit(60, 19)},

     {options: {floorCount: 9,
                elevatorCount: 5,
                spawnRate: 1.1},
                condition: waitLimit(80, 17)},

     {options: {floorCount: 9,
                elevatorCount: 5,
                spawnRate: 1.1,
                elevatorCapacities: [5]},
                condition: waitLimit(100, 15)},

     {options: {floorCount: 9,
                elevatorCount: 5,
                spawnRate: 1.0,
                elevatorCapacities: [6]},
                condition: waitLimit(110, 15)},

     {options: {floorCount: 8,
                elevatorCount: 6,
                spawnRate: 0.9},
                condition: waitLimit(120, 14)},

     {options: {floorCount: 12,
                elevatorCount: 4,
                spawnRate: 1.4,
                elevatorCapacities: [5,10]},
                condition: timeLimit(70, 80)},

     {options: {floorCount: 21,
                elevatorCount: 5,
                spawnRate: 1.9,
                elevatorCapacities: [10]},
                condition: timeLimit(110, 80)},

     {options: {floorCount: 21,
                elevatorCount: 8,
                spawnRate: 1.5,
                elevatorCapacities: [6,8]},
                condition: timeAndWaitLimit(2675, 1800, 45)},

    {options: {floorCount: 21,
               elevatorCount: 8,
               spawnRate: 1.5,
               elevatorCapacities: [6,8]},
               condition: noLimits()}
];
