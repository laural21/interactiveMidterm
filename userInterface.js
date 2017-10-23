// Computer voice that prompts the user to choose a mood
var voice;


// Question
var question = "What is your mood?";

// Speech input
var userInput;

// Mood (selected verbally)
var mood;

function preload(){
	myFont = loadFont("Fonts/TitilliumWeb-ExtraLight.ttf");
}

function setup(){
	createCanvas(windowWidth, windowHeight);
	background(0);
	textFont(myFont);

	fill(255, 255, 255);
	textSize(50);
	text(question, width/2-250, 50);
	// Create visible buttons which change style when they are verbally selected

	// Create speech to text object
    userInput = new p5.SpeechRec();

    // Create voice object
    voice = new p5.Speech();

    // Continuously detect input, change even in the middle of the song
    userInput.continuous = true;

    // Define a choose mood function
	userInput.onResult = chooseMood;

    userInput.start();
}

function draw(){
	fill(255, 255, 255);
	background(0);

	textSize(50);
	text(question, width/2-250, 50); //CSS needed, size 30px, font-family?, color?
	// Create visible buttons which change style when they are verbally selected

	// draw buttons
	textSize(20);

	drawButton(mouseX, mouseY, width/3 - 90, 80, 1);
	drawButton(mouseX, mouseY, width/3 + 60, 80, 2);
	drawButton(mouseX, mouseY, width/3 + 220, 80, 3);


	fill(0);
	text("happy", width/3 - 63, 102);
	text("chill", width/3 + 98, 102);
	text("energetic", width/3 + 232, 102);
}

function chooseMood(){

	// Set variable for mood
	var mood;

	// Recognize if the user selected a mood
	var userWords = userInput.resultString.split(' ');
	var mostRecentWord = userWords[ userWords.length-1 ];

	// Select mood here; soundVisualizer plays music and does the visuals
	if(mostRecentWord == "happy"){
		// Simulate clicking of the "happy" button
		mood = "happy";
	} else if (mostRecentWord == "chill"){
		mood = "chill";
	} else if (mostRecentWord == "energetic"){
		mood = "energetic";
	} else {
		return;
	}
}

// Question only has to be asked once, when page is loaded or reloaded
// Look for function/workaround for how to perform an action on page loaded
//window.onload = function(){
//	voice.speak(question);
//}

function keyPressed(){
	voice.speak(question);
}

// button functions

function mousePressed() {
  // see if the user is clicking on the button
  var clicked = isButtonPressed(mouseX, mouseY);

	if (clicked == true) {
		// start visualization
	}

}

// function to draw our button
function drawButton(testX, testY, buttonX, buttonY, mood) {

  // if the supplied x & y position are over the button we should change our fill
  // color to indicate that the user is "hovering" over the button
  if (testX > buttonX && testX < buttonX+100 && testY > buttonY && testY < buttonY + 30) {
		if (mood == 1) {
			fill(0,255,0);
		}
		if (mood == 2) {
			fill(0,0,255);
		}
		if (mood == 3) {
			fill(255,0,0);
		}
  }

  else if (mood == 1) {
    fill(204, 255, 188);
	}
	else if (mood == 2) {
		fill(165, 252, 255)
	}
	else if (mood == 3) {
		fill(255, 155, 167);
	}

  rect(buttonX, buttonY, 100, 30);
}

// function to check for button presses
function isButtonPressed(testX, testY) {

  // now test to see if the user is over the button - if so, they are clicking on it!
  if (testX > buttonX && testX < buttonX+100 && testY > buttonY && testY < buttonY + 30) {
    return true;
  }

  // not over the button - return false
  else {
    return false;
  }
}
