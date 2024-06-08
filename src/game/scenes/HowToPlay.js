import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

var finger;
var menuText;
export class HowToPlay extends Scene
{
    constructor ()
    {
        super('HowToPlay');
    }

    create ()
    {
        this.add.image(600, 400, 'background').setAlpha(0.5);

        this.add.text(512, 384, 'How To Play', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        menuText = this.add.text(600, 450, 'Back to Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setDepth(1).setOrigin(0.5);
        menuText.setInteractive();
        menuText.on('pointerdown', function() {
            this.scene.changeScene();
        });

        finger = this.add.sprite(0, 0, 'cursorMain');
        finger.setDepth(2);

        EventBus.emit('current-scene-ready', this);
    }

    update ()
    {
        var pointer = this.input.activePointer;

        if (pointer.active) {
            finger.setPosition(pointer.x, pointer.y);
        }
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}
