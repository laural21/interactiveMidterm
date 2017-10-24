// Variables for the sound visualizer
var allShapes = [];
var happySong;
var chillSong;
var energeticSong;

// Computer voice that prompts the user to choose a mood
var voice;

// Question
var question = "What is your mood?";

// Speech input
var userInput;

// Mood (selected verbally)
var mood;
var change[]; // Waveform mapped to a change in the sizes of the shapes

function preload(){
	myFont = loadFont("Fonts/TitilliumWeb-ExtraLight.ttf");
	happySong = loadSound("Music/happy.mp3");
	chillSong = loadSound("Music/chill.mp3");
	energeticSong = loadSound("Music/energetic.mp3");
}

function setup(){
	// Create new Fast Fourier Transform object
	fft = new p5.FFT();

	// CRAIG: This will make your canvas responsive to the screen being resized
	var theCanvas = createCanvas(800, 600);
	theCanvas.style('width', '100%');
	theCanvas.style('height', '100%');

	textFont(myFont);

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

	fill(0);
	rect(0,0,800,600);

	fill(255, 255, 255);
	textSize(50);
	text(question, width/2-250, 50);

	var r, g, b;
	// Hues of pink and purple
	if (mood == "happy"){
		r = random(200, 255);
		g = random(200, 255);
		b = random(200, 255);

	// Hues of dark blue
	} else if (mood == "chill"){
		r = 0;
		g = random(50, 100);
		b = random(100, 255);

	// Hues of yellow, green
	} else if (mood == "energetic"){
		r = random(50, 150);
		g = 255;
		b = random(0, 100);
	}

	// CRAIG: 500 particles is a lot to create each time!
	for(var j = 0; j < 5; j++){
		allShapes.push(new Shape(r, g, b));
	}

	for(var i = 0; i < allShapes.length; i++){
		allShapes[i].display();
		allShapes[i].pulsate(change);
		//allShapes[i].move();
		}
	}
}

function chooseMood(){
	// Recognize if the user selected a mood
	var userWords = userInput.resultString.split(' ');
	var mostRecentWord = userWords[ userWords.length-1 ];
	
	// Select mood here; soundVisualizer plays music and does the visuals
	if(mostRecentWord == "happy"){
		// Simulate clicking of the "happy" button
		mood = "happy";
		happySong.play();

	} else if (mostRecentWord == "chill"){
		mood = "chill";
		chillSong.play();
	} else if (mostRecentWord == "energetic"){
		mood = "energetic";
		energeticSong.play();
	} else {
		return;
	}
	getWaveform();
}

function getWaveform(){
	var waveform = fft.waveform();
	for (var i = 0; i< waveform.length; i++){
    	change += map(waveform[i], -1, 1, -8, 8);
    }  
}

function Shape(r, g, b){
	// Color (color scheme based on mood)
	this.r = r;
	this.g = g;
	this.b = b;

	// Create random quadrangle at a random spot on the screen
	// First vertex at random, keep other verteces close to it
	this.vertexOneX = random(10, width-10);
	this.vertexOneY = random(10, width-10);
	this.vertexTwoX = this.vertexOneX + (random(-15, 15));
	this.vertexTwoY = this.vertexOneY + (random(-15, 15));
	this.vertexThreeX = this.vertexTwoX + (random(-15, 15));
	this.vertexThreeY = this.vertexTwoY + (random(-15, 15));
	this.vertexFourX = this.vertexThreeX + (random(-15, 15));
	this.vertexFourY = this.vertexThreeY + (random(-15, 15));


	this.display = function(){
		noStroke();
		fill(this.r, this.g, this.b);
		beginShape();
		vertex(this.vertexOneX, this.vertexOneY);
		vertex(this.vertexTwoX, this.vertexTwoY);
		vertex(this.vertexThreeX, this.vertexThreeY);
		vertex(this.vertexFourX, this.vertexFourY);
		endShape(CLOSE);
	}

	// Change size (pulsate) based on the waveform
	this.pulsate = function(){
		// Verteces move towards or away from the center of the shape based on the waveform
		for(var i = 0; i < change.length; i++){
			this.vertexOneX += change[i];
	  		this.vertexOneY += change[i];
	  		this.vertexTwoX += change[i];
	  		this.vertexTwoY += change[i];
	  		this.vertexThreeX += change[i];
	  		this.vertexThreeY += change[i];
	  		this.vertexFourX += change[i];
	  		this.vertexFourY += change[i];
		}
  		
  	}


	//this.move = function(){}
	// Move around the screen with Perlin noise

	// Expire particles
	// if((this.vertexOneX < 0) || (this.vertexOneY < 0) || (this.vertexTwoX > width)
	// || (this.vertexTwoY < 0)){
	//	return true;
	//}
}

function keyPressed(){
	voice.speak(question);
}
