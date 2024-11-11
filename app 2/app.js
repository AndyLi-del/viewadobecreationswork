// Global DOM elements
const grid = document.querySelector(".grid");
const used = document.getElementById("used");

// Game state variables
var currentPlayerIndex = -1;
var currentGoalIndex = -1;
var currentDirectIndex = -1;
var currentPortalIndex = -1;
let width = 16;
let stepsUsed = 0;

// Replace individual portal arrays with a single map
const portals = new Map();
for (let i = 1; i <= 16; i++) {
    portals.set(i, []);
}

// Array to store obstacle positions
var obstacles = [];

// Create the 16x16 grid (256 squares)
for (let i = 0; i < 256; i++) {
  const square = document.createElement("div")
  grid.appendChild(square)
}

// Movement configuration
const MOVES = {
  'ArrowLeft': { offset: -1, check: (idx) => idx % width !== 0, obstacleOffset: 1 },
  'ArrowRight': { offset: 1, check: (idx) => idx % width < width - 1, obstacleOffset: -1 },
  'ArrowUp': { offset: -width, check: (idx) => idx / width >= 1, obstacleOffset: width },
  'ArrowDown': { offset: width, check: (idx) => idx / width < 15, obstacleOffset: -width }
};

// Main functions

/**
 * Resets all game state variables and clears the grid
 */
function clearLevel() {
  const squares = Array.from(document.querySelectorAll(".grid div"))
  for (let i = 0; i < 256; i++) {
    squares[i].removeAttribute("class")
  }
  currentPlayerIndex = -1;
  currentGoalIndex = -1;
  currentDirectIndex = -1;
  currentPortalIndex = -1;
  width = 16;
  stepsUsed = 0;
  portals.forEach((value, key) => {
    portals.set(key, []);
  });
  obstacles = [];
}
const squares = Array.from(document.querySelectorAll(".grid div"))
/**
 * Loads and renders a level from a text file
 * @param {string} textFileName - Path to the level file
 */
function loadLevel(textFileName) {
  console.log("hello")
  clearLevel()
  var levelParts = textFileName.split("Level")
  var levelNumber = levelParts[1].split(".txt")
  const currentLevel = levelNumber[0]
  var displayLevelNumber = currentLevel
  const levelReading = document.getElementById("levelReading");
  levelReading.innerText = displayLevelNumber

  function splitString(stringToSplit) {
    const arrayOfStrings = stringToSplit.split(/\W+/);
    return arrayOfStrings
  }

  function renderLevel(levelName) {
    const isGoal = (element) => element == "g";
    currentGoalIndex = levelName.findIndex(isGoal);
    squares[currentGoalIndex].classList.add('goal')

    if (levelName.includes("u")) {
    const isDirect = (element) => element == "u";
    currentDirectIndex = levelName.findIndex(isDirect);
    squares[currentDirectIndex].classList.add('direct')
    }

    const isPlayer = (element) => element == "p";
    currentPlayerIndex = levelName.findIndex(isPlayer);
    squares[currentPlayerIndex].classList.add('player')

    // Handle obstacles
    if (levelName.includes("b")) {
        levelName.forEach((element, index) => {
            if (element === 'b') {
                obstacles.push(index);
                squares[index].classList.add('obstacle');
            }
        });
    }

    // Handle all portals (1-16)
    for (let portalNum = 1; portalNum <= 16; portalNum++) {
        const portalStr = portalNum.toString();
        if (levelName.includes(portalStr)) {
            levelName.forEach((element, index) => {
                if (element === portalStr) {
                    portals.get(portalNum).push(index);
                    squares[index].classList.add(`portal${portalNum}`);
                }
            });
        }
    }

    var levelStepsParts = levelName[256].split("step")
    const levelPrefix = levelStepsParts.shift()
    var targetSteps = levelStepsParts.shift();
    return targetSteps
  }

  const t = document.getElementById("text");
  fetch(textFileName).then(res=>{
    return res.text().then(text=>{
          let level = splitString(text)
          console.log(level)
          renderLevel(level)
          var levelStepsParts = level[256].split("step")
          const levelPrefix = levelStepsParts.shift()
          let targetSteps = levelStepsParts.shift();
          const targetStepsDisplay = document.getElementById("content");
          targetStepsDisplay.innerText = targetSteps
      });
  });
}

/**
 * Checks player status after each move:
 * - Win condition (reached goal with correct steps)
 * - Direct teleport to goal
 * - Portal teleportation
 */
function checkStatus() {
  if (currentPlayerIndex == currentGoalIndex) {
    if (document.getElementById("content").innerText == stepsUsed) {
      console.log('same')
      window.location.replace("win.html")
    } else {
      window.location.replace("try-again.html")
    }
  }
  if (currentPlayerIndex == currentDirectIndex) {
    console.log(squares[currentPlayerIndex])
    squares[currentPlayerIndex].classList.remove('player')
    currentPlayerIndex = currentGoalIndex;
    squares[currentGoalIndex].classList.add('player')
    checkStatus()
  }

  // Check all portals
  portals.forEach((positions) => {
    if (positions.length > 0) {
      handlePortalTeleport(positions);
    }
  });
}

/**
 * Handles keyboard movement controls
 * @param {KeyboardEvent} e - Keyboard event
 */
function movePlayer(e) {
  const move = MOVES[e.key];
  if (!move) return;

  used.innerText = stepsUsed;
  squares[currentPlayerIndex].classList.remove('player');

  if (move.check(currentPlayerIndex)) {
    const moveable = !obstacles.some(obs => obs + move.obstacleOffset === currentPlayerIndex);
    if (moveable) {
      stepsUsed++;
      currentPlayerIndex += move.offset;
    }
  }

  squares[currentPlayerIndex].classList.add('player');
  used.innerText = stepsUsed;
  checkStatus();
}
document.addEventListener('keydown', movePlayer)

/**
 * Touch control functions for each direction
 * Each function:
 * 1. Updates step counter
 * 2. Checks for obstacles
 * 3. Moves player if valid
 * 4. Updates display
 */
function touchUp() {
  used.innerText = stepsUsed
  squares[currentPlayerIndex].classList.remove('player')
  if (currentPlayerIndex / width >= 1) {
    var moveable = true;
      for (let i = 0; i < obstacles.length + 1; i++) {
        if (obstacles[i] + 16 == currentPlayerIndex) {
          moveable= false;
        }
      }
      if (moveable) {
        stepsUsed = stepsUsed + 1;
        currentPlayerIndex -= 16
      }
  }
  squares[currentPlayerIndex].classList.add('player')
  used.innerText = stepsUsed
  console.log(stepsUsed)
  checkStatus()
}
function touchDown() {
  used.innerText = stepsUsed
  squares[currentPlayerIndex].classList.remove('player')
  if (currentPlayerIndex / width < 15) {
    var moveable = true;
      for (let i = 0; i < obstacles.length + 1; i++) {
        if (obstacles[i] - 16 == currentPlayerIndex) {
          moveable= false;
        }
      }
      if (moveable) {
        stepsUsed = stepsUsed + 1;
        currentPlayerIndex += 16
      }
  }
  squares[currentPlayerIndex].classList.add('player')
  used.innerText = stepsUsed
  console.log(stepsUsed)
  checkStatus()
}
function touchLeft() {
  used.innerText = stepsUsed
  squares[currentPlayerIndex].classList.remove('player')
  if (currentPlayerIndex % width !== 0) {
    var moveable = true;
    for (let i = 0; i < obstacles.length + 1; i++) {
        if (obstacles[i] + 1 == currentPlayerIndex) {
          moveable = false;
        }
      }
      if (moveable) {
        stepsUsed = stepsUsed + 1;
        currentPlayerIndex -= 1
      }
  }
  squares[currentPlayerIndex].classList.add('player')
  used.innerText = stepsUsed
  console.log(stepsUsed)
  checkStatus()
}
function touchRight() {
  used.innerText = stepsUsed
  squares[currentPlayerIndex].classList.remove('player')
  if (currentPlayerIndex % width < width -1) {
    var moveable = true;
    for (let i = 0; i < obstacles.length + 1; i++) {
      if (obstacles[i] - 1 == currentPlayerIndex) {
        moveable = false;
      }
    }
    if (moveable) {
      stepsUsed = stepsUsed + 1;
      currentPlayerIndex += 1;
    }
  }
  squares[currentPlayerIndex].classList.add('player')
  used.innerText = stepsUsed
  console.log(stepsUsed)
  checkStatus()
}

// Simplified portal teleportation
function handlePortalTeleport(portalPositions) {
    for (let i = 0; i < 2; i++) {
        if (currentPlayerIndex === portalPositions[i]) {
            const currentPosition = portalPositions[i];
            portalPositions.push(currentPosition);
            portalPositions.splice(i, 1);
            squares[currentPlayerIndex].classList.remove('player');
            squares[portalPositions[0]].classList.add('player');
            currentPlayerIndex = portalPositions[0];
            break;
        }
    }
}