import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

// Assets
var pointer;
var crosshair;
var player;
var grenadeLauncher;
var mobs;
var stars;
var mobLauncher;
var mobGrenades;
var grenades;
var bombs;
var explosion;
var mobExplosion;
var platforms;
var walls;
var score = 0;
var totalScore = 0;
var level = 1;
var pointsCollected = 0;
var mobsKilled = 0;
var bombsKilled = 0;
var gameOver = false;
var scoreText;
var levelText;
var restartText;
var mainmenuText;

// Layers
var target = 0;
var playerTarget = 0;
var rotationSpeed = 0;
// var timedEvent;
// const layerBackground = this.add.layer();

// Controls
var aKey;
var dKey;
var wKey;

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    

    create ()
    {
        score = 0;
        pointsCollected = 0;
        mobsKilled = 0;
        bombsKilled = 0;

        level = 1;

        pointer = this.input.activePointer;

        target = 0;
        rotationSpeed = 1 * Math.PI;

        gameOver = false;

        // this.cameras.main.setBackgroundColor(0x00ff00);

        this.add.image(600, 400, 'backgroundMenu');

        platforms = this.physics.add.staticGroup();
        platforms.create(600, -10, 'ground');
        platforms.create(600, 776, 'ground');
        platforms.create(Phaser.Math.Between(461, 739), 600, 'platformLow');
        platforms.create(Phaser.Math.Between(322, 878), 424, 'platformMid');
        platforms.create(Phaser.Math.Between(183, 1017), 248, 'platformHigh');
        
        walls = this.physics.add.staticGroup();
        walls.create(0, 400, 'wall');
        walls.create(1200, 400, 'wall');

        player = this.physics.add.sprite(200, 600, 'dude');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.body.setGravityY(1000);

        grenadeLauncher = this.add.image(player.x, player.y, 'grenadeLauncher');
        grenadeLauncher.setOrigin(0.5, 0.75);

        mobLauncher = this.add.image(600, 50, 'mobLauncher')
        mobLauncher.setDepth(2);
        mobLauncher.setScale(1.5);
 
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 5
        });

        this.anims.create({
            key: 'sideleft',
            frames: [ { key: 'dude', frame: 0 } ],
            frameRate: 5
        });

        this.anims.create({
            key: 'sideright',
            frames: [ { key: 'dude', frame: 5 } ],
            frameRate: 5
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'explosion',
            frames: this.anims.generateFrameNumbers('explosion', { start: 1, end: 15 }),
            frameRate: 60,
            repeat: 0
        });

        this.anims.create({
            key: 'explosionMob',
            frames: this.anims.generateFrameNumbers('explosionMob', { start: 1, end: 15 }),
            frameRate: 60,
            repeat: 0
        });

        this.anims.create({
          key: 'mobturn',
          frames: [ { key: 'mob', frame: 4 } ],
          frameRate: 5
        });

        this.anims.create({
            key: 'mobmoveright',
            frames: this.anims.generateFrameNumbers('mob', { start: 5, end: 8 }),
            frameRate: 2,
            repeat: -1
        });

        this.anims.create({
            key: 'mobmoveleft',
            frames: this.anims.generateFrameNumbers('mob', { start: 0, end: 3 }),
            frameRate: 2,
            repeat: -1
        });

        aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        const pointerMoverHandler = function(pointer) {
            target = Phaser.Math.Angle.BetweenPoints(mobLauncher, pointer);
            playerTarget = Phaser.Math.Angle.BetweenPoints(grenadeLauncher, pointer);
        }

        this.input.on('pointermove', pointerMoverHandler, this);

        const pointerDownHandler = function(pointer) {
            if (functionEnabled) {
                shootGrenade.call(this, pointer.x, pointer.y);
                
                setTimeout(() => {
                    mobShoot.call(this, pointer.x, pointer.y);
                }, 500); 
                
                functionEnabled = false;
                
                setTimeout(() => {
                    functionEnabled = true;
                }, 1000); 
            }
        };

        this.input.on('pointerdown', pointerDownHandler, this);

        let functionEnabled = true;

        mobs = this.physics.add.group({
            key: 'mob',
            repeat: 5,
            setXY: { x: 200, y: 25, stepX: 150 }
        });

        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 600, y: 25, stepX: Phaser.Math.Between(-35, 35) }
        });

        stars.children.iterate(function (child) {
            child.setBounce(Phaser.Math.FloatBetween(0.5, 0.6));
            child.setVelocity(Phaser.Math.FloatBetween(Phaser.Math.Between(-500, 500), 0));
            child.setFrictionX(Phaser.Math.Between(0.5, 0.6));
        });

        grenades = this.physics.add.group();

        mobGrenades = this.physics.add.group();

        explosion = this.physics.add.sprite(100, 100, 'explosion')
        explosion.setScale(5);
        explosion.setVisible(false);
        explosion.disableBody(true, true);

        mobExplosion = this.physics.add.sprite(100, 100, 'explosion')
        mobExplosion.setScale(3);
        mobExplosion.setVisible(false);
        mobExplosion.disableBody(true, true);

        bombs = this.physics.add.group();

        scoreText = this.add.text(70, 30, 'Score: ' + score + '\nPoints Collected: ' + pointsCollected + '\nMobs Killed: ' + mobsKilled + '\nBombs Killed: ' + bombsKilled, { fontFamily: 'Pixelify Sans', fontSize: '32px', fill: '#fff' });

        levelText = this.add.text(600, 30, 'Level: ' + level, { fontFamily: 'Pixelify Sans', fontSize: '32px', fill: '#fff', align: 'center' });
        levelText.setDepth(2);
        levelText.setOrigin(0.5);
       

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(mobs, platforms);
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(bombs, platforms);
        this.physics.add.collider(grenades, platforms);
        this.physics.add.collider(explosion, platforms);
        this.physics.add.collider(mobGrenades, platforms);
        this.physics.add.collider(mobExplosion, platforms);

        this.physics.add.collider(player, walls);
        this.physics.add.collider(mobs, walls);
        this.physics.add.collider(stars, walls);
        this.physics.add.collider(bombs, walls);
        this.physics.add.collider(grenades, walls);
        this.physics.add.collider(explosion, walls);
        this.physics.add.collider(mobGrenades, walls);
        this.physics.add.collider(mobExplosion, walls);

        this.physics.add.overlap(player, stars, collectStar, null, this);

        this.physics.add.overlap(explosion, mobs, killMob, null, this);

        this.physics.add.overlap(explosion, bombs, killBomb, null, this);

        this.physics.add.overlap(explosion, stars, killStar, null, this);

        this.physics.add.collider(player, bombs, hitBomb, null, this);

        this.physics.add.collider(player, mobExplosion, hitBomb, null, this);

        this.physics.add.collider(player, mobs, hitBomb, null, this);

        this.physics.add.collider(mobExplosion, mobs, killMob, null, this);

        function collectStar (player, star)
        {
            star.disableBody(true, true);

            pointsCollected += 1;

            if (player.y > 600) {
              score += 3;
            } 
            else if (player.y > 248){
              score += 5;
            }
            else {
              score += 7;
            }

            scoreText.setText('Score: ' + score + '\nPoints Collected: ' + pointsCollected + '\nMobs Killed: ' + mobsKilled + '\nBombs Killed: ' + bombsKilled);

            if (stars.countActive(true) === 0)
            {
                setTimeout(() => {
                    level += 1;
                    levelText.setText('Level: ' + level);
                    stars.children.iterate(function (child) {
                        child.enableBody(true, Phaser.Math.Between(150, 1050), 150, true, true);
                        child.setVelocity(Phaser.Math.FloatBetween(Phaser.Math.Between(-500, 500), 0));
                    });
                    var x = (player.x < 0) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
                    bombs.createMultiple({key: 'bomb', frame: [0], frameQuantity: 1, repeat: level / 2 | 0 });
                    Phaser.Actions.SetXY(bombs.getChildren(), x, 0, x);
                    bombs.children.iterate(function (child) {
                        child.setBounce(1);
                        child.setCollideWorldBounds(true);
                        child.setVelocity(Phaser.Math.Between(-600, 600), 20);
                        child.allowGravity = false;
                    });
                }, 1000); 
            }
        }

        function killMob (explosion, mob)
        {
            mob.disableBody(true, true);
            mobsKilled += 1;
            score += 5;
            scoreText.setText('Score: ' + score + '\nPoints Collected: ' + pointsCollected + '\nMobs Killed: ' + mobsKilled + '\nBombs Killed: ' + bombsKilled);
            if (mobs.countActive(true) === 0)
            {
                setTimeout(() => {
                    mobs.children.iterate(function (child) {
                        child.enableBody(true, Phaser.Math.Between(50, 1150), 150, true, true);
                    });
                }, 1000); 
            }
        }

        function killBomb (explosion, bomb)
        {
            bombsKilled += 1;
            score += 7;
            scoreText.setText('Score: ' + score + '\nPoints Collected: ' + pointsCollected + '\nMobs Killed: ' + mobsKilled + '\nBombs Killed: ' + bombsKilled);
            bomb.disableBody(true, true);
        }

        function killStar (explosion, star)
        {
            star.disableBody(true, true);
            score -= 1;
            scoreText.setText('Score: ' + score + '\nPoints Collected: ' + pointsCollected + '\nMobs Killed: ' + mobsKilled + '\nBombs Killed: ' + bombsKilled);
            if (stars.countActive(true) === 0)
            {
                setTimeout(() => {
                    level += 1;
                    levelText.setText('Level: ' + level);
                    stars.children.iterate(function (child) {
                        child.enableBody(true, Phaser.Math.Between(150, 1050), 150, true, true);
                        child.setVelocity(Phaser.Math.FloatBetween(Phaser.Math.Between(-500, 500), 0));
                    });
                    var x = (player.x < 0) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
                    bombs.createMultiple({key: 'bomb', frame: [0], frameQuantity: 1, repeat: level / 2 | 0 });
                    Phaser.Actions.SetXY(bombs.getChildren(), x, 0, x);
                    bombs.children.iterate(function (child) {
                        child.setBounce(1);
                        child.setCollideWorldBounds(true);
                        child.setVelocity(Phaser.Math.Between(-600, 600), 20);
                        child.allowGravity = false;
                    });
                }, 1000); 
            }
        }

        function shootGrenade(x, y) {
            const grenade = this.physics.add.image(player.x, player.y, 'grenade');
            grenade.setOrigin(0, 0);
            grenades.add(grenade);
            this.physics.moveTo(grenade, x, y, 800);
            grenade.setBounce(Phaser.Math.FloatBetween(0.5, 0.6));
            grenade.body.setGravityY(200);
            grenade.body.setFrictionX(Phaser.Math.Between(5, 6));
            grenade.rotation += Phaser.Math.Between(0.1, 0.9);
            setTimeout(function() {
                explosion.setPosition(grenade.x, grenade.y);
                explosion.setOrigin(0.5, 0.5);
                explosion.setVisible(true);
                explosion.enableBody(true, grenade.x, grenade.y, true, true);
                explosion.anims.play('explosion');
                explosion.body.setAllowGravity(false);
                grenade.setVisible(false);
                setTimeout(function() {
                    explosion.setVisible(false);
                    explosion.disableBody(true, true);
                }, 300);
            }, 1500);
        }

        function mobShoot(x, y) {
            if (y > 600) {
              const mobgrenade = this.physics.add.image(600, 0, 'grenadeMob');
              mobgrenade.setOrigin(0, 0);
              mobGrenades.add(mobgrenade);
              this.physics.moveTo(mobgrenade, x, y, 800);
              mobgrenade.setBounce(Phaser.Math.FloatBetween(0.5, 0.6));
              mobgrenade.body.setGravityY(200);
              mobgrenade.body.setFrictionX(Phaser.Math.Between(5, 6));
              mobgrenade.rotation += Phaser.Math.Between(0.1, 0.9);
              setTimeout(function() {
                  mobExplosion.setPosition(mobgrenade.x, mobgrenade.y);
                  mobExplosion.setOrigin(0.5, 0.5);
                  mobExplosion.setVisible(true);
                  mobExplosion.enableBody(true, mobgrenade.x, mobgrenade.y, true, true);
                  mobExplosion.anims.play('explosionMob');
                  mobExplosion.body.setAllowGravity(false);
                  mobgrenade.setVisible(false);
                  setTimeout(function() {
                      mobExplosion.setVisible(false);
                      mobExplosion.disableBody(true, true);
                  }, 300);
              }, 1750);   
            } 
            else if (y > 248){
              const mobgrenade = this.physics.add.image(600, 0, 'grenadeMob');
              mobgrenade.setOrigin(0, 0);
              mobGrenades.add(mobgrenade);
              this.physics.moveTo(mobgrenade, x, y, 800);
              mobgrenade.setBounce(Phaser.Math.FloatBetween(0.5, 0.6));
              mobgrenade.body.setGravityY(200);
              mobgrenade.body.setFrictionX(Phaser.Math.Between(5, 6));
              mobgrenade.rotation += Phaser.Math.Between(0.1, 0.9);
              setTimeout(function() {
                  mobExplosion.setPosition(mobgrenade.x, mobgrenade.y);
                  mobExplosion.setOrigin(0.5, 0.5);
                  mobExplosion.setVisible(true);
                  mobExplosion.enableBody(true, mobgrenade.x, mobgrenade.y, true, true);
                  mobExplosion.anims.play('explosionMob');
                  mobExplosion.body.setAllowGravity(false);
                  mobgrenade.setVisible(false);
                  setTimeout(function() {
                      mobExplosion.setVisible(false);
                      mobExplosion.disableBody(true, true);
                  }, 300);
              }, 750);   
            }
            else {
              const mobgrenade = this.physics.add.image(600, 0, 'grenadeMob');
              mobgrenade.setOrigin(0, 0);
              mobGrenades.add(mobgrenade);
              this.physics.moveTo(mobgrenade, x, y, 800);
              mobgrenade.setBounce(Phaser.Math.FloatBetween(0.5, 0.6));
              mobgrenade.body.setGravityY(200);
              mobgrenade.body.setFrictionX(Phaser.Math.Between(5, 6));
              mobgrenade.rotation += Phaser.Math.Between(0.1, 0.9);
              setTimeout(function() {
                  mobExplosion.setPosition(mobgrenade.x, mobgrenade.y);
                  mobExplosion.setOrigin(0.5, 0.5);
                  mobExplosion.setVisible(true);
                  mobExplosion.enableBody(true, mobgrenade.x, mobgrenade.y, true, true);
                  mobExplosion.anims.play('explosionMob');
                  mobExplosion.body.setAllowGravity(false);
                  mobgrenade.setVisible(false);
                  setTimeout(function() {
                      mobExplosion.setVisible(false);
                      mobExplosion.disableBody(true, true);
                  }, 300);
              }, 350);   
            }    
        }
    
        function hitBomb (player, bomb)
        {
            totalScore = score * level / 2 + pointsCollected + mobsKilled + bombsKilled | 0 ;
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            scoreText.setVisible(false);
            levelText.setVisible(false);
            gameOver = true;
            if (gameOver === true) {
                this.add.rectangle(600, 400, 1200, 800, 0x8d83dc).setDepth(3).setBlendMode(Phaser.BlendModes.MULTIPLY);
                this.add.text(600, 75, 'Game Over', {
                  fontFamily: 'Pixelify Sans', fontSize: 56, color: '#ffffff', align: 'center'
                }).setDepth(3).setOrigin(0.5);

                this.add.text(600, 150, 'Stats', {
                  fontFamily: 'Pixelify Sans', fontSize: 48, color: '#ffffff', align: 'center'
                }).setDepth(3).setOrigin(0.5);

                this.add.text(600, 200, 'Level:\n' + level, { 
                    fontFamily: 'Pixelify Sans', fontSize: 24, color: '#ffffff', align: 'center' 
                }).setDepth(3).setOrigin(0.5);

                this.add.text(600, 260, 'Score:\n' + score, { 
                    fontFamily: 'Pixelify Sans', fontSize: 24, color: '#ffffff', align: 'center' 
                }).setDepth(3).setOrigin(0.5);

                this.add.text(600, 320, 'Points Collected:\n' + pointsCollected, { 
                  fontFamily: 'Pixelify Sans', fontSize: 24, color: '#ffffff', align: 'center' 
                }).setDepth(3).setOrigin(0.5);

                this.add.text(600, 380, 'Mobs Killed:\n' + mobsKilled, { 
                  fontFamily: 'Pixelify Sans', fontSize: 24, color: '#ffffff', align: 'center' 
                }).setDepth(3).setOrigin(0.5);

                this.add.text(600, 440, 'Bombs Killed:\n' + bombsKilled, { 
                  fontFamily: 'Pixelify Sans', fontSize: 24, color: '#ffffff', align: 'center' 
                }).setDepth(3).setOrigin(0.5);

                this.add.text(600, 520, 'Total Score:\n' + totalScore, { 
                    fontFamily: 'Pixelify Sans', fontSize: 42, color: '#ffffff', align: 'center' 
                }).setDepth(3).setOrigin(0.5);

                restartText = this.add.text(600, 625, 'Restart', {
                    fontFamily: 'Pixelify Sans', fontSize: 38, color: '#ffffff', align: 'center'
                }).setDepth(3).setOrigin(0.5);
                restartText.setInteractive();
                restartText.on('pointerover', function() {
                    var hoverStyle = { fontFamily: 'Pixelify Sans', fontSize: 52, fontWeight: 700, color: '#f2cb04', align: 'center' }; 
                    restartText.setStyle(hoverStyle);
                    crosshair.setScale(1.5);
                });
                restartText.on('pointerout', function () {
                    var defaultStyle = { fontFamily: 'Pixelify Sans', fontSize: 38, color: '#ffffff', align: 'center' }; 
                    restartText.setStyle(defaultStyle);
                    crosshair.setScale(1);
                });
                restartText.on('pointerdown', function() {
                    this.scene.restartScene();
                });
                
                mainmenuText = this.add.text(600, 675, 'Main Menu', {
                    fontFamily: 'Pixelify Sans', fontSize: 38, color: '#ffffff', align: 'center'
                }).setDepth(3).setOrigin(0.5);
                mainmenuText.setInteractive();
                mainmenuText.on('pointerover', function() {
                    var hoverStyle = { fontFamily: 'Pixelify Sans', fontSize: 52, fontWeight: 700, color: '#f2cb04', align: 'center' }; 
                    mainmenuText.setStyle(hoverStyle);
                    crosshair.setScale(1.5);
                });
                mainmenuText.on('pointerout', function () {
                    var defaultStyle = { fontFamily: 'Pixelify Sans', fontSize: 38, color: '#ffffff', align: 'center' }; 
                    mainmenuText.setStyle(defaultStyle);
                    crosshair.setScale(1);
                });
                mainmenuText.on('pointerdown', function() {
                    this.scene.changeScene();
                });
            }
        }   

        crosshair = this.add.sprite(0, 0, 'cursorGame');
        crosshair.setDepth(4);

        EventBus.emit('current-scene-ready', this);
    }

    update ()
    {
        if (aKey.isDown)
        {
            player.setVelocityX(-500);

            player.anims.play('left', true);

            if (player.body.touching.none)
            {
                player.setVelocityX(-250);

                player.anims.play('sideleft', true);
            }
        }
        else if (dKey.isDown)
        {
            player.setVelocityX(500);

            player.anims.play('right', true);

            if (player.body.touching.none)
            {
                player.setVelocityX(250);

                player.anims.play('sideright', true);
            }
        }
        else
        {
            player.setVelocityX(0);

            player.anims.play('turn');
        }
        if (Phaser.Input.Keyboard.JustDown(wKey) && player.body.touching.down)
        {
            player.setVelocityY(-900);
        }

        if (pointer.active) {
            crosshair.setPosition(pointer.x, pointer.y);
        }

        grenadeLauncher.setPosition(player.x, player.y);
        grenadeLauncher.rotation = Phaser.Math.Angle.RotateTo(grenadeLauncher.rotation, playerTarget, rotationSpeed * 0.5);

        mobLauncher.rotation = Phaser.Math.Angle.RotateTo(mobLauncher.rotation, target, rotationSpeed * 0.006);
        
        mobs.children.iterate(function (child) {
            if (player.x > child.x) {
                child.setVelocityX(Phaser.Math.Between(75, 125));
            }
            else {
                child.setVelocityX(Phaser.Math.Between(-75, -125));
            }

            if (child.body.velocity.x > 0)
            {
                child.anims.play('mobmoveright', true);
            }
            else
            {
                child.anims.play('mobmoveleft', true);
            }

            if (gameOver === true) {
                child.anims.play('mobturn', true);
            }
        });   
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }

    restartScene ()
    {
        this.scene.restart();
    }
}
