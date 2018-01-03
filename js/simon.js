document.addEventListener("DOMContentLoaded", function() {
  // global that indicates game's on/off status
  onFlag = false;

  // global that indicates game's strict mode status
  strictMode = false;

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
    buttonsVisualFeedback(startPress);
  });
  
  strictPress.addEventListener("mousedown", function () {
    buttonsVisualFeedback(strictPress);
    strictToggle();
  });

  onButton.addEventListener("mousedown", function () {
    onOffToggle(onButton, offButton);
  });  

  offButton.addEventListener("mousedown", function () {
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
  }
  else
  {
    off.style.fill = "#808080";
    on.style.fill = "#404040";
  }

  onFlag = !onFlag;  
}
