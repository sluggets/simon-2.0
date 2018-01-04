document.addEventListener("DOMContentLoaded", function() {
  // global that indicates game's on/off status
  onFlag = false;

  // global that indicates game's strict mode status
  strictMode = false;

  // global holds score
  scoreCount = 0;

  // global holds count to track how far along we are in the pattern
  patternCount = 0;

  // global holds winning pattern 
  winningPatternArr = [];

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
    buttonsVisualFeedback(bluePress);
  });

  greenPress.addEventListener("mousedown", function () {
    buttonsVisualFeedback(greenPress);
  });

  yellowPress.addEventListener("mousedown", function () {
    buttonsVisualFeedback(yellowPress);
  });

  redPress.addEventListener("mousedown", function () {
    buttonsVisualFeedback(redPress);
  });

  startPress.addEventListener("mousedown", function () {
    if (!onFlag)
    {
      return;
    }
    buttonsVisualFeedback(startPress);
    winningPatternArr = startGame();    
  });
  
  strictPress.addEventListener("mousedown", function () {
    if (!onFlag)
    {
      return;
    }
    buttonsVisualFeedback(strictPress);
    if (winningPatternArr.length != 0)
    {
      strictToggle()
      startGame();
    }
    else
    {
      strictToggle();
    }
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

// Add function definitions below here

// triggers color flash to indicate button has been pressed
function buttonsVisualFeedback(type)
{
  var unpressedColor = type.id
  type.id = unpressedColor + "-press";
  type.addEventListener("mouseup", function () {
    type.id = unpressedColor;
  });
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
    scoreCount = 0;
    onFlag = !onFlag;
    if (strictMode)
    {
      strictToggle();
      strictMode = false;
    }
    updateScoreDisplay(-1);
    patternCount = 0;
    winningPatternArr = [];
  }
  else
  {
    off.style.fill = "#808080";
    on.style.fill = "#404040";
    updateScoreDisplay(0);
    onFlag = !onFlag;  
  }
  console.log("strict status is: " + strictMode);

}

// this function handles changing/updating/shutting down score-count display
function updateScoreDisplay(num)
{
  // grabs score-count display
  var scoreCountDisplay = document.getElementById("score-count"); 
  var scoreToDisplay = num;

  if (num < 0)
  {
    scoreCountDisplay.innerHTML = "";  
  }
  else
  {
    if (num < 10)
    {
      scoreToDisplay = "0" + num; 
    }
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
    pattArr.push((Math.floor(Math.random() * 4)))
  }

  console.log("pattArr: " + pattArr);
  return pattArr;
}

// either starts or restarts the game, also this is called when 
// strict is pressed after game has already begun, effectively restarting
// the game
function startGame()
{
  scoreCount = 0;
  patternCount = 0;
  return randomPatternSelector();
}
