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
  var startPress = document.getElementById("start-game-button");
  var strictPress = document.getElementById("strict-mode-button");
  var onButton = document.getElementById("game-on-button");
  var offButton = document.getElementById("game-off-button");

  // sets listeners for when mousedowns happen to change button colors
  bluePress.addEventListener("mousedown", function () {
    userButtonPress(bluePress);
  });

  greenPress.addEventListener("mousedown", function () {
    userButtonPress(greenPress);
  });

  yellowPress.addEventListener("mousedown", function () {
    userButtonPress(yellowPress);
  });

  redPress.addEventListener("mousedown", function () {
    userButtonPress(redPress);
  });

  startPress.addEventListener("mousedown", function () {
    if (!onFlag || blocked)
    {
      return;
    }

    buttonsFeedback(startPress);
    resetAll();
    winningPatternArr = startGame();    
    playPattern();
  });
  
  strictPress.addEventListener("mousedown", function () {
    if (!onFlag || blocked)
    {
      return;
    }
    buttonsFeedback(strictPress);
    resetAll();
    strictToggle();
    winningPatternArr = startGame();    
  });

  onButton.addEventListener("mousedown", function () {
    // if already on ignore button press
    if (onFlag)
    {
      return;
    }
    onOffToggle(onButton, offButton);
  });  

  offButton.addEventListener("mousedown", function () {
    // if already off ignore button press
    if (!onFlag)
    {
      return;
    }
    onOffToggle(onButton, offButton);
  });
});

// triggers color flash to indicate button has been pressed
function buttonsFeedback(type)
{
  if (!onFlag)
  {
    return;
  }
  // plays button sounds only for main four color buttons
  if (type.id != "start-game-button" && type.id != "strict-mode-button")
  {
    var audioLocation = "audio/" + type.id + ".mp3";
  }
  var audio = new Audio(audioLocation);
  audio.play();

  // toggles button colors
  var currentButton = document.getElementById(type.id);
  var style = window.getComputedStyle(currentButton);
  var unpressedStyle = style.fill;
  var pressedStyle = unpressedStyle.slice(0, -4);
  currentButton.style.fill = pressedStyle + "1.0)";
  type.addEventListener("mouseup", function () {
    currentButton.style.fill = unpressedStyle; 
  });

  setTimeout(function() {
    var evt = new MouseEvent("mouseup");
    currentButton.dispatchEvent(evt); 
  },1000);
}

// this toggles strict mode and appropriate indicator light
function strictToggle()
{
  if (strictMode)
  { 
    var strictIndicator = document.getElementById("strict-mode-indicator-true");
    strictIndicator.id = "strict-mode-indicator-false"; 
  }
  else
  {
    var strictIndicator = document.getElementById("strict-mode-indicator-false");
    // this if statement handles if game is turned off while in strict mode
    // it will turn off strict mode indicator, it returns after that because
    // the onOffToggle() function will handle toggling the strict mode status
    if (strictIndicator == null)
    {
      var strictIndicator = document.getElementById("strict-mode-indicator-true");
      strictIndicator.id = "strict-mode-indicator-false"; 
      return; 
    }
    strictIndicator.id = "strict-mode-indicator-true";
  }
  strictMode = !strictMode;    
}

// this toggles indicator color for on/off buttons
// also initializes/deinitializes game state and appropriate globals
function onOffToggle(on, off)
{
  if (onFlag)
  {
    off.style.fill = "#404040";  
    on.style.fill = "#808080";
    onFlag = !onFlag;

    if (strictMode)
    {
      strictToggle();
    }
    updateScoreDisplay(-1);
    patternCount = 1;
    winningPatternArr = [];
    userPatternArr = [];
    userCount = 0;
    blocked = false;
    strictFail = false;
  }
  else
  {
    off.style.fill = "#808080";
    on.style.fill = "#404040";
    updateScoreDisplay(0);
    onFlag = !onFlag;  
  }

}

// this function handles changing/updating/shutting down score-count display
function updateScoreDisplay(num)
{
  // grabs score-count display
  var scoreCountDisplay = document.getElementById("score-count"); 
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
      buttonsFeedback(currentPress);
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
  var titleOops = document.getElementById("tspan49"); 
  updateScoreDisplay(100);  
  var audio = new Audio("/audio/error.mp3");
  audio.play();
  titleOops.innerHTML = "oops!";
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
  var titleOops = document.getElementById("tspan49"); 
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
  var simon  = document.getElementById("tspan49");
  simon.innerHTML = "Simon";
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
  if (blocked || !onFlag)
  {
    return;
  }

  if (userPatternArr.length == userCount)
  {
    userPatternArr.push(buttonType.id);
  }
  buttonsFeedback(buttonType);
  checkUserEntry(userCount, buttonType.id); 
  userCount++;

  if (userPatternArr.length == patternCount)
  {
    playPattern();
    patternCount++;
  }

}

