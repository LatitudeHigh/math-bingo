//define global variables
//TASK OF THE DAY: PAUSE MUSIC WHEN ANSWER IS CORRECT/INCORRECT
var homescreen = true;
var newtext;
var rect;
var grid;
var backgroundMusic;
var musicOn = false;
var tracker = 0;
const resetBtn = document.getElementById("myBtn");
const canvas = document.getElementById("canvas");
const muteMusicBtn = document.getElementById("musicBtn");

muteMusicBtn.addEventListener("click", function() {
  if(musicOn){
    backgroundMusic.pause();
    musicOn = !musicOn;
  }else{
    backgroundMusic.play();
    musicOn = !musicOn;
  }
   if(muteMusicBtn.innerHTML == "Unmute Music"){
     muteMusicBtn.innerHTML = "Mute Music"
   }else{
     muteMusicBtn.innerHTML = "Unmute Music"
   }
});

resetBtn.addEventListener("click", function() {
  if(homescreen){
    homescreen = false;
    backgroundMusic = new Audio("https://codehs.com/uploads/321a1069f0e8542a622d5c9a314cf4f8");
    backgroundMusic.play();
    backgroundMusic.loop = true;
    musicOn = true;
    grid = new Grid(5, 5);
    canvas.style.display = "inline-block";
    resetBtn.innerHTML = "Reset";
  }
  removeAll();
  drawLines();
  drawCircles();
  grid.init(0);
  tracker= 0;
  muteMusicBtn.classlist.remove("blank");
});


function drawLines() {
  //these are the verticle lines
  for(var i = 1; i <5; i++) {
  verticleLine(getWidth()*i/5, getHeight()*5/6);
  }
  
  //these are the horizontal lines
  for(var i = 1; i < 6; i++) {
    horizontalLine(getWidth()*i/5, getHeight());
  }
}

//this function displays the fifferent difficulties: Green=Easy, Yellow=Medium, Red=Hard
function drawCircles() {
  var difficulties = [Color.red, Color.yellow, Color.green];
  for(var j = 0; j<5;j++){
    for(var i = 0; i < 5; i++){
      var c = Randomizer.nextInt(0,2);
      var color = difficulties[c];
      var circX =  50 + (100*i);
      var circY =  50 + (100*j);
      var circle = new Circle(49);
      circle.setPosition(circX, circY);

      //this adds the text in the middle(row 2,col 2 )
      if(i == 2 && j == 2){
        var txt = new Text("FREE", "20pt Permanent Marker");
        txt.setPosition((getWidth() - txt.getWidth())/2, 250);
        txt.setColor(Color.black);
        var txt2 = new Text("SPACE!", "20pt Permanent Marker");
        txt2.setPosition(205, 280);
        txt2.setColor(Color.black);
        add(txt);
        add(txt2);
      }else{
        circle.setColor(color);
        add(circle);
      }
    }
  }
}
function start() {
  var rectangle = new Rectangle(getWidth(), getHeight());
  rectangle.setPosition(0,0);
  rectangle.setColor(Color.green);
  add(rectangle);
  mouseClickMethod(boxOne);
  //this sets and plays the background music
}

//verticle lines to make the layout
function verticleLine(x, length){
   var line = new Line(x, 0, x, length);
   line.setColor(Color.white);
   add(line);
}

//horizontal lines to make the layout
function horizontalLine(y, length){
    var line = new Line(0, y, length, y);
    line.setColor(Color.white);
    add(line);
}

function getCenterElementFromClick(row, col) {
  //This represent half the box
  var halfDisplacement = getWidth()/10;
 //goes to that box horizontally and then moves a half over
  var displacementXMath = (col*2*halfDisplacement) + halfDisplacement;
   //goes to that box vertically and then moves a half over
  var displacementYMath = (row*2*halfDisplacement) + halfDisplacement;

  //gives you the actual coordinates for where the center of the box is
  return getElementAt(displacementXMath, displacementYMath);
}

//this defines the checkmark when the answer is correct
function checkMark(x, y, LL, RL, W){
  var distanceLeft = Math.sqrt((LL)*(LL)/2); 
  var leftLine = new Line(x - distanceLeft, y- 
  distanceLeft, x, y);
  leftLine.setLineWidth(W);
  var distanceRight = Math.sqrt((RL)*(RL)/2); 
  var rightLine = new Line(x - (W/5), y+ (W/2.3), x + 
  distanceRight, y - distanceRight);
  rightLine.setLineWidth(W);
  leftLine.setColor(Color.green)
  rightLine.setColor(Color.green)
  add(rightLine);
  add(leftLine);
}

//this defines the X when the answer is incorrect
function cross(x, y){
  var distance = Math.sqrt((50)*(50)/2); 
  var leftright = new Line(x- distance, y - distance, x   + distance, y + distance);
  var rightleft = new Line(x- distance, y + distance, x   + distance, y - distance);
  rightleft.setLineWidth(20);
  leftright.setLineWidth(20);
  leftright.setColor(Color.red)
  rightleft.setColor(Color.red)
  add(leftright);
  add(rightleft);
}


function boxOne(e){
  if(tracker == 0){
  if(homescreen == false){
    //gets x and y of the mouse
    var x = e.getX();
    var y = e.getY();
  
    //calculating row and column that the mouse is in
    //how many square width/heights fit into the x or y
    var col = Math.floor(x / (getWidth()/5));
    var row = Math.floor(y / (getHeight()/6));
    var box = row * 5 + col;
    var there = getCenterElementFromClick(row, col);
    var colorOfShape = there.getColor();
    var difficulty;
    if(colorOfShape == Color.GREEN){
      difficulty = "easy";
    }else if(colorOfShape == Color.YELLOW){
       difficulty = "medium"; 
    }else{
    difficulty = "hard";
  }
  //calculates the center of the square
  var halfDisplacement = getWidth()/10;
  var displacementXMath = (col*2*halfDisplacement) + halfDisplacement;
  var displacementYMath = (row*2*halfDisplacement) + halfDisplacement;

  var gridElem = grid.get(row, col);
  //if there is something and hasn't been clicked, and isn't the center square. Get rid of the circle
  if(there != null && gridElem == 0 && !(row == 2 && col == 2)){
    remove(there);
    grid.set(row, col, 1);
    rect = new Rectangle(100, 100);
    rect.setPosition(col*100, row*100);
    var mathProblem = randomEquations(difficulty);
    if(mathProblem){
      checkMark(32.5 + col*100, 75 + row*100, 30, 80, 20);
      var won = scan(row, col);

      if(won){
        var bingo = new Text("BINGO", "120pt Arial");
bingo.setPosition(getWidth()/2-bingo.getWidth()/2, getHeight()/2);
bingo.setColor(Color.grey);
        add(bingo);
        var bingo2 = new Text("BINGO", "120pt Arial");
bingo2.setPosition(getWidth()/2-bingo2.getWidth()/2, getHeight()/2+10);
bingo2.setColor(Color.blue);
        add(bingo2);
        var bingoSound = new Audio("https://codehs.com/uploads/26d35ee4e718df62afab74836d19a4f5");
  bingoSound.play();
        tracker++
      }
    }else{
      cross(50 + col*100, 50 + row*100);
    }
  }
  }
}
}
//this generates the math problems, sent out randomly between different type of math: multiplication, subtraction, and addition
function randomEquations(difficulty){

  var operations = ["multiply", "add", "subtract", "division"];

    var operation = operations[Randomizer.nextInt(0, 2)];

    if(difficulty == "easy"){
      var firstnum = Randomizer.nextInt(1, 30);
      var secondnum = Randomizer.nextInt(1, 30);
    }else if(difficulty == "medium"){
      var firstnum = Randomizer.nextInt(30, 60);
      var secondnum = Randomizer.nextInt(30, 60);
    }else{
      var firstnum = Randomizer.nextInt(60, 100);
      var secondnum = Randomizer.nextInt(60, 100);
    }

    if(operation == "multiply"){
      var answer = firstnum * secondnum;
      var guess = prompt("What is " + firstnum + " x " +      secondnum + "? ");
      }else if(operation == "division"){
      var beforeRounding = firstnum/secondnum;
      var answer = Math.round(10*beforeRounding)/10;;
      var guess = prompt("What is " + firstnum + " / " +      secondnum + "? ");
    }else if(operation == "add"){
      var answer = firstnum + secondnum;
      var guess = prompt("What is " + firstnum + " + " +      secondnum + "? ");
    }else if(operation == "subtract"){
      var answer = firstnum - secondnum;
      if(answer < 0){
        answer = secondnum - firstnum;
        var guess = prompt("What is " + secondnum + " - " +      firstnum + "? ");
      }else{
        var guess = prompt("What is " + firstnum + " - " +      secondnum + "? ");
      }
    }
    if(guess != answer){

      //this sound will play when the answer is incorrect
        
    var incorrectAnswerSound = new Audio("https://codehs.com/uploads/afc1ced2627c2bfc3a0f20e2eed6b677");
  incorrectAnswerSound.play();
    return false;

  }else{
    //this sound will play when the answer is correct

      var correctAnswerSound = new 
    Audio("https://codehs.com/uploads/4320575578513382665002c487bb80f9");
    correctAnswerSound.play();
    return true;

  }
}

//
function getObjectAtRowCol(row, col) {
  return getElementAt(50 + row * 100, 50 + col * 100);
}

//this checks if the box that is either to the left, right, above, or below the previous box is correct then moves on// 
function scan(row, col){
  var vertical = 0;
  var horizontal = 0;
  var diagonol1 = 0;
  var diagonol2 = 0;
  for(var i = 0; i<5;i++){
    var elem = getObjectAtRowCol(i, row);
    if(((elem.getColor() == Color.GREEN)&&(elem.getType() == "Line"))||(elem.getType() == "Text")){
      horizontal += 1;
    }
  }
  for(var i = 0; i<5;i++){
    var elem = getObjectAtRowCol(col, i);
  if(((elem.getColor() == Color.GREEN)&&(elem.getType() == "Line"))||(elem.getType() == "Text")){
      vertical += 1;
    }
  }
  if(row == col){
    for(var i = 0; i<5;i++){
      var elem = getObjectAtRowCol(i, i);
      if(((elem.getColor() == Color.GREEN)&&(elem.getType() == "Line"))||(elem.getType() == "Text"))      {
        diagonol1 += 1;
      }
    }
  }
  if((row + col) == 4){
    for(var i = 0; i<5;i++){
      var elem = getObjectAtRowCol(4 - i, i);
      if(((elem.getColor() == Color.GREEN)&&(elem.getType() == "Line"))||(elem.getType() == "Text"))      {
        diagonol2 += 1;
      }
    }
  }
  if((vertical == 5) || (horizontal == 5) || (diagonol1 == 5) || (diagonol2 == 5)){
    return true;
  }else{
    return false;
  }
}