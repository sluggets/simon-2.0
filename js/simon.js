document.addEventListener("DOMContentLoaded", function() {
  // global that indicates game's on/off status
  onFlag = false;

  // global that indicates game's strict mode status
  strictMode = false;

  // MAY NOT NEED THIS!!! global holds score
  //scoreCount = 0;

  // global holds count to track how far along we are in the pattern
  patternCount = 0;

  // global holds how many presses have been make in current patter
  // before user press is new one and must be pushed into 
  // userPatternArr. This gets reset in checkUserAccuracy
  userCount = 0;

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
    if (userPatternArr.length == userCount)
    {
    console.log("userPatternArr.length->" + userPatternArr.length);
    console.log("patternCount->" + patternCount);
      console.log("pushing Blue to userPatternArr")
      userPatternArr.push(bluePress.id);
    }
    buttonsVisualFeedback(bluePress);
    userCount++;
    console.log("userPatternArr.length->" + userPatternArr.length);
    console.log("patternCount->" + patternCount);
    if (userCount == patternCount)
    {
      checkUserAccuracy();
    }
  });

  greenPress.addEventListener("mousedown", function () {
    console.log("user enters green");
    if (userPatternArr.length == userCount)
    {
    console.log("userPatternArr.length->" + userPatternArr.length);
    console.log("patternCount->" + patternCount);
      console.log("pushing green to userPatternArr")
      userPatternArr.push(greenPress.id);
    }
    buttonsVisualFeedback(greenPress);
    userCount++;
    console.log("userPatternArr.length->" + userPatternArr.length);
    console.log("patternCount->" + patternCount);
    if (userCount == patternCount)
    {
      checkUserAccuracy();
    }
  });

  yellowPress.addEventListener("mousedown", function () {
    console.log("user enters yellow");
    if (userPatternArr.length == userCount)
    {
    console.log("userPatternArr.length->" + userPatternArr.length);
    console.log("patternCount->" + patternCount);
      console.log("pushing yellow to userPatternArr")
      userPatternArr.push(yellowPress.id);
    }
    buttonsVisualFeedback(yellowPress);
    userCount++;
    console.log("userPatternArr.length->" + userPatternArr.length);
    console.log("patternCount->" + patternCount);
    if (userCount == patternCount)
    {
      checkUserAccuracy();
    }
  });

  redPress.addEventListener("mousedown", function () {
    console.log("user enters red");
    if (userPatternArr.length == userCount)
    {
    console.log("userPatternArr.length->" + userPatternArr.length);
    console.log("patternCount->" + patternCount);
      console.log("pushing red to userPatternArr")
      userPatternArr.push(redPress.id);
    }
    buttonsVisualFeedback(redPress);
    console.log("userPatternArr.length->" + userPatternArr.length);
    console.log("patternCount->" + patternCount);
    userCount++;
    if (userCount == patternCount)
    {
      checkUserAccuracy();
    }
  });

  startPress.addEventListener("mousedown", function () {
    if (!onFlag)
    {
      return;
    }
    buttonsVisualFeedback(startPress);
    winningPatternArr = startGame();    
    playPattern();
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
  /* this bit of code below borrowed in principle from: http://patrickmuff.ch/blog/2014/03/12/for-loop-with-delay-in-javascript/*/

  var counter = 0;
  (function next() {
    if (counter > patternCount)
    {
      patternCount++;
      return;
    } 
    setTimeout(function() {
      var currentPress = document.getElementById(winningPatternArr[counter]);
      console.log("Going into press button for CPU");
      console.log("Counter is..." + counter);
      console.log("patternCount is..." + patternCount);
      console.log("Going into press button for CPU");
      buttonsVisualFeedback(currentPress);
      console.log("Incrementing counter NOW");
      counter++;
      next();
    }, 2000);
  })();
      
}

// this function compares the user array to the computer array for mistakes
function checkUserAccuracy()
{
  userCount = 0;
  console.log("userPatternArr: " + userPatternArr);
  console.log("winningPatternArr: " + winningPatternArr);
  for (var i = 0; i < userPatternArr.length; i++)
  {
    console.log("userPatternArr[" + i + "]->" + userPatternArr[i]);
    console.log("winningPatternArr[" + i + "]->" + winningPatternArr[i]);
    if (userPatternArr[i] != winningPatternArr[i])
    {
      console.log("LOSE!");
      // need to stop game here with function
      // deduct patternCount x 1
    }
  }
  console.log("Preparing to make next CPU play");
  playPattern();
  
}

