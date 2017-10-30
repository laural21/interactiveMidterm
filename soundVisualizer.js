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

var change = 0; // Waveform mapped to a change in the sizes of the shapes
var fft;

function preload(){
	myFont = loadFont("Fonts/TitilliumWeb-ExtraLight.ttf");
	happySong = loadSound("Music/happy.mp3");
	chillSong = loadSound("Music/chill.mp3");
	energeticSong = loadSound("Music/energetic.mp3");
}

function setup(){
	// Create new Fast Fourier Transform object
	fft = new p5.FFT();
	noiseDetail(24);

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

	// When page loads, ask user what their mood is
	voice.speak(question);
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
		getWaveform();
		for(var j = 0; j < 2; j++){
			allShapes.push(new Shape(random(50, 150), 255, random(0, 100)));
		}

	// Hues of dark blue
	} else if (mood == "chill"){
		getWaveform();
		for(var j = 0; j < 2; j++){
			allShapes.push(new Shape(0, random(50, 100), random(100, 255)));
		}

	// Hues of yellow, green
	} else if (mood == "energetic"){
		getWaveform();
		for(var j = 0; j < 2; j++){
			allShapes.push(new Shape(random(90, 255), random(0, 30), random(0, 50)));
		}

	}

	for(var i = 0; i < allShapes.length; i++){
		allShapes[i].displayAndMove();
		var expired;
		if (allShapes.length > 100){
			var j = 0;
			while(j < 2){
				expired = random(0, allShapes.length-1);
				if(expired == i){
					allShapes.splice(i, 1);
					i -= 1;
				} else {
					allShapes[i].pulsate();
				}
				j++;
			}
		} else {
			expired = random(0, allShapes.length-1);
			if(expired == i){
				allShapes.splice(i, 1);
				i -= 1;
			} else {
				allShapes[i].pulsate();
			}
		}
		
	}
}


// Moods controlled by buttons now
function goHappy(){
	allShapes = [];
	if(chillSong.isPlaying()){
		chillSong.stop();
	}
	if(energeticSong.isPlaying()){
		energeticSong.stop();
	}
	mood = "happy";
	happySong.play();
}

function goChill(){
	allShapes = [];
	if(happySong.isPlaying()){
		happySong.stop();
	}
	if(energeticSong.isPlaying()){
		energeticSong.stop();
	}
	mood = "chill";
	chillSong.play();
	}

function goEnergetic(){
	allShapes = [];
	if(chillSong.isPlaying()){
		chillSong.stop();
	}
	if(happySong.isPlaying()){
		happySong.stop();
	}
	mood = "energetic";
	energeticSong.play();
}

function chooseMood(){
	// Recognize if the user selected a mood
	var userWords = userInput.resultString.split(' ');
	var mostRecentWord = userWords[ userWords.length-1 ];
	
	// Select mood here; soundVisualizer plays music and does the visuals

	if(mostRecentWord == "happy"){
		allShapes = [];
		mood = "happy";
		if(chillSong.isPlaying()){
		chillSong.stop();
	}
	if(energeticSong.isPlaying()){
		energeticSong.stop();
	}
		happySong.play();

	} else if (mostRecentWord == "chill"){
		allShapes = [];
		mood = "chill";
		if(happySong.isPlaying()){
		happySong.stop();
	}
	if(energeticSong.isPlaying()){
		energeticSong.stop();
	}
		chillSong.play();

	} else if (mostRecentWord == "energetic"){
		allShapes = [];
		mood = "energetic";
		if(chillSong.isPlaying()){
		chillSong.stop();
	}
	if(happySong.isPlaying()){
		happySong.stop();
	}
		energeticSong.play();

	} else {
		return;
	}
}

function getWaveform(){
	var waveform = fft.waveform();
	change = 0;
	for (var i = 0; i< waveform.length; i++){
    	change += waveform[i];
    }
    change = map(change, -1024, 1024, -20, 20);
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
	this.vertexTwoX = this.vertexOneX + (random(-40, 40));
	this.vertexTwoY = this.vertexOneY + (random(-40, 40));
	this.vertexThreeX = this.vertexTwoX + (random(-40, 40));
	this.vertexThreeY = this.vertexTwoY + (random(-40, 40));
	this.vertexFourX = this.vertexThreeX + (random(-40, 40));
	this.vertexFourY = this.vertexThreeY + (random(-40, 40));

	// Create different noise offsets for the x and y coordinates of the verteces
	this.xNoiseOffset = random(0,1000);
  	this.yNoiseOffset = random(10000,20000);


	this.displayAndMove = function(){
		
		noStroke();
		fill(this.r, this.g, this.b);

		// Calculate movement
		var xMovement = map(noise(this.xNoiseOffset), 0, 1, -20, 20);
    	var yMovement = map(noise(this.yNoiseOffset), 0, 1, -20, 20);

    	// Display and move around the screen with Perlin noise
		beginShape();
		vertex(this.vertexOneX + xMovement, this.vertexOneY + yMovement);
		vertex(this.vertexTwoX + xMovement, this.vertexTwoY + yMovement);
		vertex(this.vertexThreeX + xMovement, this.vertexThreeY + yMovement);
		vertex(this.vertexFourX + xMovement, this.vertexFourY + yMovement);
		endShape(CLOSE);

		this.xNoiseOffset += 0.01;
    	this.yNoiseOffset += 0.01;
	}

	// Change size (pulsate) based on the waveform
	this.pulsate = function(){
		// Verteces move towards or away from the center of the shape based on the waveform
		this.vertexOneX -= change;
  		this.vertexOneY -= change;
  		this.vertexTwoX += change;
  		this.vertexTwoY -= change;
  		this.vertexThreeX -= change;
  		this.vertexThreeY += change;
  		this.vertexFourX += change;
  		this.vertexFourY += change;
  		
  	}
}
