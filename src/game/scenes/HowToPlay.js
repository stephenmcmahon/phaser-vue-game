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
        this.add.image(600, 400, 'backgroundMenu').setAlpha(0.25);

        this.add.text(600, 50, 'How To Play', {
            fontFamily: 'Tiny5', fontSize: 38, color: '#ffffff', align: 'center'
        }).setDepth(1).setOrigin(0.5);

        this.add.text(600, 125, 'Welcome to Grenade-0, (Grenade Zero).\n Control your player to collect points, and shoot grenades at the monsters and flying bombs to get a high score.', {
            fontFamily: 'Tiny5', fontSize: 18, color: '#ffffff', align: 'center'
        }).setDepth(1).setOrigin(0.5);

        menuText = this.add.text(600, 750, 'Back to Main Menu', {
            fontFamily: 'Tiny5', fontSize: 24, color: '#ffffff', align: 'center'
        }).setDepth(1).setOrigin(0.5);
        menuText.setInteractive();
        menuText.on('pointerover', function() {
            var hoverStyle = { fontFamily: 'Tiny5', fontSize: 38, fontWeight: 700, color: '#f2cb04', align: 'center' }; 
            menuText.setStyle(hoverStyle);
            finger.setScale(1.5);
        });
        menuText.on('pointerout', function () {
            var defaultStyle = { fontFamily: 'Tiny5', fontSize: 24, color: '#ffffff', align: 'center' }; 
            menuText.setStyle(defaultStyle);
            finger.setScale(1);
        });
        menuText.on('pointerdown', function() {
            this.scene.changeScene();
        });

        finger = this.add.sprite(0, 0, 'cursorGame');
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
