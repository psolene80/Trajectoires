// =======================
// TRAJECTOIRES 
// =======================


// =======================
// VARIABLES GLOBALES
// =======================

let gameState = "MENU"; // état de l'app

let canvasSize; // taille du canvas carré
let cnv; // référence canvas

let characters = []; // liste des bonhommes
let points = []; // 4 points colorés

let waitStart; // timer attente
let startTime; // chrono début
let endTime; // chrono fin

let traceLayer; // calque traces permanentes
let screenshotImg; // image finale


// =======================
// SETUP
// =======================

function setup() {

  canvasSize = windowHeight; // carré = hauteur écran
  cnv = createCanvas(canvasSize, canvasSize);

  traceLayer = createGraphics(canvasSize, canvasSize); // calque traces

  textFont("Lato"); // police lisible
  textStyle(NORMAL);

  initPoints(); // crée points
  centerCanvas(); // centre écran
  
  traceLayer.strokeCap(ROUND);

}


// =======================
// CENTRAGE CANVAS
// =======================

function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  cnv.position(x, y);
}


// =======================
// REDIMENSION
// =======================

function windowResized() {

  let s = windowHeight;

  resizeCanvas(s, s);

  traceLayer = createGraphics(s, s);

  initPoints();
  centerCanvas();
}


// =======================
// DRAW LOOP
// =======================

function draw() {

  background(240);

  if (gameState === "MENU") drawMenu();
  if (gameState === "JEU_WAIT") drawGame(false);
  if (gameState === "JEU_RUN") drawGame(true);
  if (gameState === "JEU_FIN") drawGameEnd();
  if (gameState === "GALERIE") drawGalerie();
  if (gameState === "CREDITS") drawCredits();
}


// =======================
// MENU
// =======================

function drawMenu() {

  background(255);

  fill(0);
  textAlign(CENTER, CENTER);
  textSize(42);

  text("TRAJECTOIRES", width/2, height*0.2);

  drawButton("JEU", height*0.4);
  drawButton("GALERIE", height*0.55);
  drawButton("CRÉDITS & EXPLICATION", height*0.7);
}


// =======================
// BOUTON GENERIQUE
// =======================

function drawButton(label, y) {

  let w = 360;
  let h = 60;
  let x = width/2;

  let hover =
    mouseX > x-w/2 &&
    mouseX < x+w/2 &&
    mouseY > y-h/2 &&
    mouseY < y+h/2;

  fill(hover ? 180 : 255);
  stroke(0);

  rectMode(CENTER);
  rect(x, y, w, h, 12);

  noStroke();
  fill(0);
  textSize(22);
  text(label, x, y);
}


function overButton(y) {
  return mouseX > width/2-180 &&
         mouseX < width/2+180 &&
         mouseY > y-30 &&
         mouseY < y+30;
}


// =======================
// LANCER PARTIE
// =======================

function startGame() {

  characters = [];
  traceLayer.clear();

  for (let i=0; i<100; i++) {
    characters.push(new Character());
  }

  waitStart = millis();
  gameState = "JEU_WAIT";
}


// =======================
// JEU
// =======================

function drawGame(active) {

  image(traceLayer,0,0);

  // points colorés
  for (let p of points) {
    fill(p.color);
    ellipse(p.x,p.y,40);
  }

  // attente 1s
  if (!active && millis()-waitStart > 1000) {
    startTime = millis();
    gameState = "JEU_RUN";
  }

  let alive = false;

  for (let c of characters) {
    c.update(active);
    c.display();
    if (c.visible) alive = true;
  }

  // fin
  if (active && !alive) {
    endTime = millis();
    screenshotImg = get();
    gameState = "JEU_FIN";
  }
}


// =======================
// FIN
// =======================

function drawGameEnd() {

  // ======================
  // 1 — fond figé plein écran
  // ======================
  image(screenshotImg, 0, 0, width, height);


  // ======================
  // 2 — voile noir 50% opacité
  // ======================
  rectMode(CORNER);//defini que le coin du voile est au coin du canva
  fill(0, 130); // noir + alpha
  noStroke();
  rect(0, 0, windowWidth, windowHeight);//(coordoné x point de depart, coordone en y du debut du rectangle, largeur, hauteur)


  // ======================
  // 3 — screenshot plus petit (50%)
  // ======================
  let scale = 0.50; // taille 50%

  let w = width * scale;
  let h = height * scale;

  let x = (width - w) / 2; // centrage
  let y = (height - h) / 2;

  image(screenshotImg, x, y, w, h);


  // ======================
  // 4 — texte temps
  // ======================
  fill(255);
  textAlign(CENTER);

  textSize(28);

  let t = ((endTime - startTime) / 1000).toFixed(2);

  text("Temps : " + t + " s", width/2, y - 25); // au-dessus de l'image


  // ======================
  // 5 — boutons fixes
  // ======================
  drawButton("REJOUER", height*0.1);
  drawButton("MENU", height*0.9);
}



// =======================
// GALERIE (placeholder)
// =======================

function drawGalerie() {

  background(100);

  fill(255);
  textAlign(CENTER);
  textSize(30);

  text("GALERIE (à connecter à Supabase)", width/2, height/2);

  drawButton("MENU", height-60);
}


// =======================
// CREDITS
// =======================

function drawCredits() {

  background(255); // fond blanc

  fill(20); // couleur texte sombre

  textAlign(CENTER, TOP); // centrage horizontal
  textSize(28);

  // ----- Titre -----
  text("Crédits & Explications", width/2, 40);


  // ----- Texte principal -----
  textSize(16);

  let margin = 80; // marge gauche/droite
  let boxWidth = width - margin*2; // largeur du bloc texte

  text(
    "Trajectoires est une œuvre interactive générative où des entités colorées suivent une destination imposée tandis que le joueur peut perturber leurs parcours.\n\n" +
    "Chaque déplacement laisse une trace permanente, transformant l’espace en mémoire visuelle des interactions.\n\n" +
    "Chaque partie produit ainsi une composition unique, entre contrôle, hasard et empreinte du geste humain.\n\n" +
    "Outils : JavaScript, p5.js, Vercel, Github, ChatGPT\n" +
    "Auteur : Pernet solène et GPT\n" +
    "Année : 2026",

    width/2,   // centré
    120,       // hauteur départ
    boxWidth   // largeur max (wrap auto)
  );


  // ----- Bouton -----
  drawButton("MENU", height-60);
}

// =======================
// POINTS
// =======================

function initPoints() {

  points = [
    {x:width/2,y:40,color:color(255,0,0)},
    {x:width/2,y:height-40,color:color(0,0,255)},
    {x:40,y:height/2,color:color(0,255,0)},
    {x:width-40,y:height/2,color:color(255,255,0)}
  ];
}


// =======================
// CLASSE PERSONNAGE
// =======================

class Character {

  constructor(){

    this.x=random(width);
    this.y=random(height);

    this.point=random(points); // destination

    const palette=[points[0].color,points[1].color,points[2].color,points[3].color];

    this.color=random(palette); // couleur indépendante

    this.visible=true;
    this.isDragged=false;

    this.speed=0.5;
  }

  update(active){

    if(!this.visible) return;

    // drag
    if(this.isDragged){
     traceLayer.stroke(0);
     traceLayer.strokeWeight(2); // épaisseur noire
     traceLayer.line(this.x,this.y,mouseX,mouseY);
      this.x=mouseX;
      this.y=mouseY;
      return;
    }

    if(!active) return;

    // trace colorée
    traceLayer.stroke(this.color);
    traceLayer.strokeWeight(2); // épaisseur couleur
    traceLayer.point(this.x,this.y);

    let dx=this.point.x-this.x;
    let dy=this.point.y-this.y;

    let d=sqrt(dx*dx+dy*dy);

    if(d>this.speed){
      this.x+=dx/d*this.speed;
      this.y+=dy/d*this.speed;
    }else{
      this.visible=false;
    }
  }

  display(){
    if(!this.visible) return;
    noStroke();
    fill(this.color);
    ellipse(this.x,this.y,14);
  }
}

// =======================
// INTERACTIONS SOURIS
// =======================

function mousePressed(){

  if(gameState==="MENU"){
    if(overButton(height*0.4)) startGame();
    if(overButton(height*0.55)) gameState="GALERIE";
    if(overButton(height*0.7)) gameState="CREDITS";
  }

  if(gameState==="JEU_RUN"||gameState==="JEU_WAIT"){
    for(let c of characters){
      if(c.visible && dist(mouseX,mouseY,c.x,c.y)<16){
        c.isDragged=true;
      }
    }
  }

  if(gameState==="JEU_FIN"){
    if(overButton(height*0.1)) startGame();
    if(overButton(height*0.9)) gameState="MENU";
  }

  if(gameState==="CREDITS" && overButton(height-60)) gameState="MENU";
  if(gameState==="GALERIE" && overButton(height-60)) gameState="MENU";
}


function mouseReleased(){
  for(let c of characters) c.isDragged=false;
}

// =======================
// INTERACTIONS TACTILES
// =======================

function touchStarted(){
  mousePressed();   // réutilise EXACTEMENT ton code souris
  return false;     // bloque scroll iPad
}

function touchEnded(){
  mouseReleased();  // réutilise EXACTEMENT ton code souris
  return false;
}
