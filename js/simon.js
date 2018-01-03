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
  });
});

// Add function definitions below here

// triggers color flash to indicate button has been pressed
function buttonsVisualFeedback(type)
{
  console.log(type.id);
  var unpressedColor = type.id
  type.id = unpressedColor + "-press";
  type.addEventListener("mouseup", function () {
    type.id = unpressedColor;
  });
  
  if (unpressedColor == "strict-mode-button")
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
}
