import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

var platforms;
var player;
var cursors;
export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x00ff00);

        this.add.image(960, 540, 'background').setAlpha(0.5);

        
        platforms = this.physics.add.staticGroup();
        platforms.create(960, 950, 'ground').setScale(2).refreshBody();
        platforms.create(960, 400, 'ground');
        platforms.create(960, 250, 'ground');
        platforms.create(960, 600, 'ground');

        
        player = this.physics.add.sprite(100, 450, 'dude');

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        player.body.setGravityY(700);

        
        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(player, platforms);

        EventBus.emit('current-scene-ready', this);
    }

    update ()
    {
        if (cursors.left.isDown)
        {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-330);
        }
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
