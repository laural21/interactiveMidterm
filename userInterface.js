// Computer voice that prompts the user to choose a mood
var voice;

// Question
var question = "What is your mood?";

// Speech input
var userInput;

// Mood (selected verbally)
var mood;

function setup(){
	createCanvas(windowWidth, windowHeight);
	background(0);

	fill(74, 2, 122);
	text(question, width/2, 30); //CSS needed, size 30px, font-family?, color?
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

function draw(){}

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
window.onload = function(){
	voice.speak(question);
}
