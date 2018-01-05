document.addEventListener("DOMContentLoaded", function() {
  // global that indicates game's on/off status
  onFlag = false;

  // global that indicates game's strict mode status
  strictMode = false;

  // MAY NOT NEED THIS!!! global holds score
  //scoreCount = 0;

  // global holds count to track how far along we are in the pattern
  patternCount = 0;

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
    console.log("user enters blue");
    userPatternArr.push(bluePress.id);
    buttonsVisualFeedback(bluePress);
    checkUserAccuracy();
  });

  greenPress.addEventListener("mousedown", function () {
    console.log("user enters green");
    userPatternArr.push(greenPress.id); 
    console.log("this is id: " + greenPress.id);
    buttonsVisualFeedback(greenPress);
    checkUserAccuracy();
  });

  yellowPress.addEventListener("mousedown", function () {
    console.log("user enters yellow");
    userPatternArr.push(yellowPress.id); 
    buttonsVisualFeedback(yellowPress);
    checkUserAccuracy();
  });

  redPress.addEventListener("mousedown", function () {
    console.log("user enters red");
    userPatternArr.push(redPress.id); 
    buttonsVisualFeedback(redPress);
    checkUserAccuracy();
  });

  startPress.addEventListener("mousedown", function () {
    if (!onFlag)
    {
      return;
    }
    buttonsVisualFeedback(startPress);
    winningPatternArr = startGame();    
    setTimeout(function() {
      playPattern();
    },1500);
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
  console.log("type.id " + type.id);
  // plays button sounds only for main four color buttons
  if (type.id != "start-game-button" && type.id != "strict-mode-button")
  {
    var audioLocation = "audio/" + type.id + ".mp3";
  }
  var audio = new Audio(audioLocation);
  audio.play();

  // toggles button colors
  var unpressedColor = type.id
  console.log("color pressed: " + type.id);
  type.id = unpressedColor + "-press";
  type.addEventListener("mouseup", function () {
    console.log("ASSIGNING unpressedColor this->" + unpressedColor);
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
    //THIS VAR MAY NOT BE NEEDED scoreCount = 0;
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
    var buttonMap = ['green', 'yellow', 'red', 'blue'];
    pattArr.push(buttonMap[(Math.floor(Math.random() * 4))]);
  }

  console.log("pattArr: " + pattArr);
  return pattArr;
}

// either starts or restarts the game, also this is called when 
// strict is pressed after game has already begun, effectively restarting
// the game
function startGame()
{
  //THIS VAR MAY NOT BE NEEDED scoreCount = 0;
  patternCount = 0;
  return randomPatternSelector();
}

// this function plays appropriate length pattern depending on
// number of correct plays
function playPattern()
{
  for (var i = 0; i <= patternCount; i++)
  {
    console.log("feedback: " + winningPatternArr[patternCount] + "Press");
    console.log("patternCount: " + patternCount);
    console.log("winningPatternArr[" + patternCount + "]->" + winningPatternArr[patternCount]);
    //var currentPress = document.getElementById(winningPatternArr[patternCount]);
    var currentPress = document.getElementById(winningPatternArr[i]);
   
    /*if (currentPress == null)
    {
      
    }*/
    // what happens below is that a MouseEvent("mousedown") is not need for
    // the computer to CLICK the button, because buttonsVisualFeedback handles
    // what would happen anyway if the click happened. What IS needed is for
    // the computer "button press" to unclick itself, thus the need for the
    // MouseEvent("mouseup") below.
    console.log("currentPress " + currentPress);
    buttonsVisualFeedback(currentPress);
    setTimeout(function() {
      var evt = new MouseEvent("mouseup");
      currentPress.dispatchEvent(evt); 
    },1000);
  }  
  patternCount++;
}

// this function compares the user array to the computer array for mistakes
function checkUserAccuracy()
{
  for (var i = 0; i < userPatternArr.length; i++)
  {
    if (userPatternArr[i] != winningPatternArr[i])
    {
      console.log("LOSE!");
    }
  }
  console.log("Preparing to make next CPU play");
  setTimeout(function() {
    playPattern();
  },1500);
  
}
