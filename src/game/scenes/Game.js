import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

// Assets
var pointer;
var crosshair;
var player;
var mobs;
var stars;
var grenades;
var bombs;
var explosion;
var platforms;
var walls;
var score = 0;
var gameOver = false;
var scoreText;
var restartText;
var mainmenuText;

// Layers
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

        pointer = this.input.activePointer;

        // this.cameras.main.setBackgroundColor(0x00ff00);

        this.add.image(600, 400, 'backgroundGame');

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

        aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

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

        explosion = this.physics.add.sprite(100, 100, 'explosion')
        explosion.setScale(5);
        explosion.setVisible(false);

        bombs = this.physics.add.group();

        scoreText = this.add.text(70, 30, 'Score: ' + score, { fontSize: '32px', fill: '#fff' });

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(mobs, platforms);
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(bombs, platforms);
        this.physics.add.collider(grenades, platforms);
        this.physics.add.collider(explosion, platforms);

        this.physics.add.collider(player, walls);
        this.physics.add.collider(mobs, walls);
        this.physics.add.collider(stars, walls);
        this.physics.add.collider(bombs, walls);
        this.physics.add.collider(grenades, walls);
        this.physics.add.collider(explosion, walls);

        this.physics.add.overlap(player, stars, collectStar, null, this);

        this.physics.add.overlap(explosion, mobs, killMob, null, this);

        let functionEnabled = true;

        const pointerDownHandler = function(pointer) {
            if (functionEnabled) {
                shootGrenade.call(this, pointer.x, pointer.y);
                
                functionEnabled = false;
                
                setTimeout(() => {
                    functionEnabled = true;
                }, 1000); 
            }
        };

        this.input.on('pointerdown', pointerDownHandler, this);

        this.physics.add.collider(player, bombs, hitBomb, null, this);

        function collectStar (player, star)
        {
            star.disableBody(true, true);
            if (player.y > 600) {
              score += 3;
            } 
            else if (player.y > 248){
              score += 5;
            }
            else {
              score += 7;
            }

            scoreText.setText('Score: ' + score);
            if (stars.countActive(true) === 0)
            {
                stars.children.iterate(function (child) {
                    child.enableBody(true, 600, 150, true, true);
                    child.setVelocity(Phaser.Math.FloatBetween(Phaser.Math.Between(-500, 500), 0));
                });
                var x = (player.x < 0) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
                var bomb = bombs.create(x, 16, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
                bomb.allowGravity = false;
            }
        }

        function killMob (explosion, mob)
        {
            mob.disableBody(true, true);
            if (mobs.countActive(true) === 0)
            {
                mobs.children.iterate(function (child) {
                    child.enableBody(true, 600, 150, true, true);
                    child.setVelocity(Phaser.Math.FloatBetween(Phaser.Math.Between(-500, 500), 0));
                });
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
            setTimeout(function() {
                explosion.setPosition(grenade.x, grenade.y);
                explosion.setOrigin(0.8, 0.8);
                explosion.setVisible(true);
                explosion.anims.play('explosion');
                explosion.body.setAllowGravity(false);
                grenade.setVisible(false);
                setTimeout(function() {
                    explosion.setVisible(false);
                }, 300);
            }, 1500);
        }

        function hitBomb (player, bomb)
        {
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            gameOver = true;
            if (gameOver === true) {
                this.add.text(600, 200, 'Score:', { 
                    fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
                    stroke: '#000000',astrokeThickness: 8,
                    align: 'center' 
                }).setDepth(1).setOrigin(0.5);

                this.add.text(600, 300, score, { 
                    fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 8,
                    align: 'center' 
                }).setDepth(1).setOrigin(0.5);

                this.add.text(600, 400, 'Game Over', {
                    fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 8,
                    align: 'center'
                }).setDepth(1).setOrigin(0.5);

                restartText = this.add.text(600, 450, 'Restart', {
                    fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 8,
                    align: 'center'
                }).setDepth(1).setOrigin(0.5);
                restartText.setInteractive();
                restartText.on('pointerdown', function() {
                    this.scene.restartScene();
                });
                
                mainmenuText = this.add.text(600, 500, 'Main Menu', {
                    fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 8,
                    align: 'center'
                }).setDepth(1).setOrigin(0.5);
                mainmenuText.setInteractive();
                mainmenuText.on('pointerdown', function() {
                    this.scene.changeScene();
                });
            }
        }   

        crosshair = this.add.sprite(0, 0, 'cursorGame');
        crosshair.setDepth(2);

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
        if (wKey.isDown && player.body.touching.down)
        {
            player.setVelocityY(-900);
        }

        if (pointer.active) {
            crosshair.setPosition(pointer.x, pointer.y);
        }
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
