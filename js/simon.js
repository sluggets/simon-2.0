document.addEventListener("DOMContentLoaded", function() {
  // global that indicates game's on/off status
  onFlag = false;

  // global that indicates game's strict mode status
  strictMode = false;

  // global marks if user failed in strict mode
  strictFail = false;

  // global holds count to track how far along we are in the pattern
  patternCount = 1;

  // global holds how many presses have been make in current patter
  // before user press is new one and must be pushed into 
  // userPatternArr. This gets reset in checkUserAccuracy
  userCount = 0;

  // global that locks out user from pressing buttons when
  // cpu is playing its turn
  blocked = false;

  // global holds winning pattern 
  winningPatternArr = [];

  // global holds user pattern
  userPatternArr = [];

  // grabs button ids to manipulate them
  var bluePress = document.getElementById("blue");
  var greenPress = document.getElementById("green");
  var yellowPress = document.getElementById("yellow");
  var redPress = document.getElementById("red");
  var startPress = document.getElementById("start");
  var strictPress = document.getElementById("strict");
  var onOffButton = document.getElementById("on-button");

  // sets listeners for when mousedowns happen to change button colors
  bluePress.addEventListener("mousedown", function () {
    if (!onFlag || blocked)
    {
      return;
    }
    toggleColor(bluePress);
    userButtonPress(bluePress);
  });

  greenPress.addEventListener("mousedown", function () {
    if (!onFlag || blocked)
    {
      return;
    }
    toggleColor(greenPress);
    userButtonPress(greenPress);
  });

  yellowPress.addEventListener("mousedown", function () {
    if (!onFlag || blocked)
    {
      return;
    }
    toggleColor(yellowPress);
    userButtonPress(yellowPress);
  });

  redPress.addEventListener("mousedown", function () {
    if (!onFlag || blocked)
    {
      return;
    }
    toggleColor(redPress);
    userButtonPress(redPress);
  });

  startPress.addEventListener("mousedown", function () {
    if (!onFlag || blocked)
    {
      return;
    }

    resetAll();
    winningPatternArr = startGame();    
    playPattern();
  });
  
  strictPress.addEventListener("mousedown", function () {
    if (!onFlag || blocked)
    {
      return;
    }
    resetAll();
    strictToggle();
    winningPatternArr = startGame();    
  });

  onOffButton.addEventListener("mousedown", function () {
    onOffToggle();
  });  

});


// this toggles strict mode and appropriate indicator light
function strictToggle()
{
  var strictIndicator = document.getElementById("strict");
  if (strictMode)
  { 
    strictIndicator.style["background-color"] = "#19e6e2";
    strictIndicator.style.color = "#0e7c7b";
  }
  else
  {
    strictIndicator.style.color = "white";
    strictIndicator.style["background-color"] = "#0d7371";
  }
  strictMode = !strictMode;    
}

// this toggles indicator color for on/off buttons
// also initializes/deinitializes game state and appropriate globals
function onOffToggle()
{
  var onOff = document.getElementById('on-button');
  if (onFlag)
  {
    onFlag = !onFlag;
    onOff.style["background-color"] = "#19e6e2";
    onOff.style.color = "#0e7c7b";
    onOff.innerHTML = "OFF";

    if (strictMode)
    {
      strictToggle();
    }
    updateScoreDisplay(100);
    patternCount = 1;
    winningPatternArr = [];
    userPatternArr = [];
    userCount = 0;
    blocked = false;
    strictFail = false;
  }
  else
  {
    onOff.style.color = "white";
    onOff.style["background-color"] = "#0d7371";
    onOff.innerHTML = "ON";
    updateScoreDisplay(0);
    onFlag = !onFlag;  
  }

}

// this function handles changing/updating/shutting down score-count display
function updateScoreDisplay(num)
{
  // grabs score-count display
  var scoreCountDisplay = document.getElementById("score"); 
  var scoreToDisplay = num;

  if(num == "!")
  {
    scoreCountDisplay.innerHTML = "!!";
  }

  if (num == 100)
  {
    setTimeout(function() {
      scoreCountDisplay.innerHTML = "--"; 
    },100);
  }

  if (num < 0)
  {
    scoreCountDisplay.innerHTML = "";  
  }

  if (num < 10 && num >= 0)
  {
    scoreToDisplay = "0" + num; 
    scoreCountDisplay.innerHTML = scoreToDisplay;
  }
  else if (num <= 20 && num >= 10) 
  {
    scoreCountDisplay.innerHTML = scoreToDisplay;
  }

}

// this function randomly selects 20 colors to hold in an array
// to use as winning pattern
function randomPatternSelector()
{
  var pattArr = []
  for (var i = 0; i < 20; i++)
  {
    var buttonMap = ['green', 'yellow', 'red', 'blue'];
    pattArr.push(buttonMap[(Math.floor(Math.random() * 4))]);
  }

  return pattArr;
}

// either starts or restarts the game, also this is called when 
// strict is pressed after game has already begun, effectively restarting
// the game
function startGame()
{
  patternCount = 1;
  return randomPatternSelector();
}


// this function plays appropriate length pattern depending on
// number of correct plays
function playPattern()
{
  if (strictFail || !onFlag)
  {
    return;
  }
  userCount = 0;
  blocked = true;
  /* this bit of code below borrowed in principle from: http://patrickmuff.ch/blog/2014/03/12/for-loop-with-delay-in-javascript/*/

  var counter = 0;
  (function next() {
    if ((counter == patternCount && patternCount != 0) || !onFlag)
    {
      blocked = false;
      return;
    } 
    setTimeout(function() {
      var currentPress = document.getElementById(winningPatternArr[counter]);
      toggleColor(currentPress);
      counter++;
      next();
    }, 1250);
  })();
      
}

// handles loss if strict mode is not on
function nonStrictLoss()
{
  
  if (userCount + 1 == patternCount)
  {
    userPatternArr.pop();
  }
  var titleOops = document.getElementById("feedback"); 
  updateScoreDisplay(100);  
  var audio = new Audio("/audio/error.mp3");
  audio.play();
  titleOops.innerHTML = "OOPS!";
  setTimeout(function() {
    updateScoreDisplay(100);  
    titleOops.innerHTML = "Simon";
  },2000);
  patternCount--;
}

// handles loss if strict mode IS enabled
function strictLoss()
{
  strictFail = true;
  var titleOops = document.getElementById("feedback"); 
  titleOops.innerHTML = "FAIL!";
  var audio = new Audio("/audio/error.mp3");
  audio.play();
  setTimeout(function() {
    updateScoreDisplay(0);  
  },1000);
}

// checks for incorrect plays after each user entry
function checkUserEntry(count, color)
{
  if (winningPatternArr[count] != color)
  {
    if (!strictMode)
    {
      nonStrictLoss(); 
    }
    else
    {
      strictLoss();
    }
  }
  updateScoreDisplay(userPatternArr.length); 
  if (userPatternArr.length == 20)
  {
    triggerWin();
  }
}

// this should reset all globals to default and arrays to default
function resetAll()
{
  strictFail = false;
  patternCount = 1;
  winningPatternArr = [];
  userPatternArr = [];
  userCount = 0;
  updateScoreDisplay(0); 
  var simon  = document.getElementById("feedback");
  simon.innerHTML = "SIMON";
}

// this triggers the win condition
function triggerWin()
{
  var youWin = document.getElementById("tspan49");
  youWin.innerHTML = "WIN!!";
  resetAll();
  updateScoreDisplay("!");
}

// this handles the user button presses
function userButtonPress(buttonType)
{
  buttonType = buttonType.id.slice(0, -8);
  if (blocked || !onFlag)
  {
    return;
  }

  if (userPatternArr.length == userCount)
  {
    userPatternArr.push(buttonType);
  }
  checkUserEntry(userCount, buttonType); 
  userCount++;

  if (userPatternArr.length == patternCount)
  {
    playPattern();
    patternCount++;
  }

}

function changeColor(type)
{
  var currentButton = document.getElementById(type.id);
  var oldId = currentButton.id;
  var newId;
  if (oldId.indexOf('-') < 0)
  {
    newId = oldId + "-pressed"; 
  }
  else
  {
    newId = oldId.slice(0, -8);
  }

  currentButton.id = newId;
  
}

function toggleColor(type)
{
  changeColor(type);
  setTimeout(function() {
    changeColor(type);
  },350);

  if (type.id != "start-game-button" && type.id != "strict-mode-button")
  {
    if (type.id.indexOf('-') < 0)
    {
      var audioLocation = "audio/" + type.id + ".mp3";
    }
    else
    {
      var audioLocation = "audio/" + type.id.slice(0, -8) + ".mp3";
    }
    var audio = new Audio(audioLocation);
    audio.play();
  }
}


