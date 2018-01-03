document.addEventListener("DOMContentLoaded", function() {

  // grabs button ids to manipulate them
  var bluePress = document.getElementById("blue");
  var greenPress = document.getElementById("green");
  var yellowPress = document.getElementById("yellow");
  var redPress = document.getElementById("red");

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
