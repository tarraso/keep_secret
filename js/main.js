var MOVEMENT_SPEED = 200;
var WIDTH  = 480;
var HEIGHT = 270;
;
var game = new Phaser.Game(WIDTH, HEIGHT, 
        Phaser.AUTO, 'gamesatate', 
        { init: init, preload: preload, create: create, update: update, render: render },
        false,
        false);

function init(){
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignVertically = true;
    this.scale.setScreenSize( true );
}

function preload() {
    game.load.image('hero', 'assets/sprites/hero.png');
    game.load.tilemap('level_0', 'assets/maps/level_0.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.image('tiles', 'assets/sprites/tiles.png');
}

var player;
var fireEmitter;
var buttons = {};
var map;
var mainLayer;
var k;

function create(){

    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;


    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);

    buttons.W = game.input.keyboard.addKey(Phaser.Keyboard.W);
    buttons.A = game.input.keyboard.addKey(Phaser.Keyboard.A);
    buttons.S = game.input.keyboard.addKey(Phaser.Keyboard.S);
    buttons.D = game.input.keyboard.addKey(Phaser.Keyboard.D);
    map = game.add.tilemap("level_0");
    map.addTilesetImage('tiles');
    mainLayer = map.createLayer('main');
    mainLayer.resizeWorld();
    map.setCollisionBetween(1, 40);
    game.physics.p2.convertTilemap(map, mainLayer);


    player = game.add.sprite(game.world.centerX, game.world.centerY, 'hero');
    game.physics.p2.enable(player);
       
    game.camera.follow(player);
    k = 1000;

}

function update(){
    player.body.setZeroVelocity();
    if(buttons.W.isDown){
        player.body.moveUp(MOVEMENT_SPEED);
    }
    if(buttons.A.isDown){
        player.body.moveLeft(MOVEMENT_SPEED);
    }
    if(buttons.S.isDown){
        player.body.moveDown(MOVEMENT_SPEED);
    }
    if(buttons.D.isDown){
        player.body.moveRight(MOVEMENT_SPEED);
    }

    deltaMouseRad = player.rotation - game.physics.arcade.angleToPointer(player) - Math.PI/2
  
    //don't be confused. I want the P of 'Phaser' to point to the mouse so rotate it again by -90deg

    mod = Math.PI * 2
    //modulo on float, works in js, means: clamp value to [-Math.PI*2,Math.PI*2]
    deltaMouseRad = deltaMouseRad % mod; 

    //lets call it phase shift, angle would jump, lets fix it
    if (deltaMouseRad != deltaMouseRad % (mod/2) ) { 
    deltaMouseRad = (deltaMouseRad < 0) ? deltaMouseRad + mod : deltaMouseRad - mod;
    }
    //speed is some factor to get the object faster to the target rotation.
    //remember we are wotking with the angle velocity and let the engine
    //rotate the body
    speed = 350;
    player.body.rotateLeft(speed * deltaMouseRad);

    if(game.input.mousePointer.isDown){
        if(Math.random()*20<1){
        }
    }
    if(Math.random()*k<1){
        x = Math.floor(Math.random()*map.width);
        y = Math.floor(Math.random()*map.height);
        if(map.getTile(x,y, mainLayer)){
            map.removeTile(x,y, mainLayer);
            //map.setCollisionBetween(1, 40); 
        }
        k-=100;
    }

}

function gameOver(x, y){
    game.state.start("default");
}

function getTileCount(){
    var count = 0;
     for(var i=0; i< map.width; i++){
        for(var j=0; j< map.height; j++){
            if(map.getTile(i, j, mainLayer)){
                ++count;
            }
        }
    }
    return count
}


function getFiringPosition(){
    return {
        x: player.body.x - Math.cos(player.angle/180*Math.PI+Math.PI/2)*20 + Math.sin(player.angle/180*Math.PI+Math.PI/2)*3,
        y: player.body.y - Math.sin(player.angle/180*Math.PI+Math.PI/2)*20 + Math.cos(player.angle/180*Math.PI+Math.PI/2)*3,
    }
}

function render(){
    

}