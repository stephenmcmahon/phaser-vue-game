import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

// Assets
var finger;
var playText;
var howToPlayText;
export class MainMenu extends Scene
{
    // logoTween;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(600, 400, 'backgroundMenu');

        this.logo = this.add.image(600, 300, 'logo').setDepth(1);

        this.add.text(600, 355, '(Grenade Zero)', {
            fontFamily: 'Pixelify Sans', fontSize: 16, color: '#f2e206', align: 'center'
        }).setDepth(1).setOrigin(0.5);

        this.add.text(600, 495, 'Main Menu', {
            fontFamily: 'Pixelify Sans', fontSize: 24, color: '#f28b05', align: 'center'
        }).setDepth(1).setOrigin(0.5);

        playText = this.add.text(600, 600, 'Play Game', {
            fontFamily: 'Pixelify Sans', fontSize: 38, color: '#ffffff', align: 'center'
        }).setDepth(1).setOrigin(0.5);
        playText.setInteractive();
        playText.on('pointerover', function() {
            var hoverStyle = { fontFamily: 'Pixelify Sans', fontSize: 52, fontWeight: 700, color: '#f2cb04', align: 'center' }; 
            playText.setStyle(hoverStyle);
            finger.setScale(1.5);
        });
        playText.on('pointerout', function () {
            var defaultStyle = { fontFamily: 'Pixelify Sans', fontSize: 38, color: '#ffffff', align: 'center' }; 
            playText.setStyle(defaultStyle);
            finger.setScale(1);
        });
        playText.on('pointerdown', function() {
            this.scene.changeScene();
        });

        howToPlayText = this.add.text(600, 655, 'How to Play', {
            fontFamily: 'Pixelify Sans', fontSize: 38, color: '#ffffff', align: 'center'
        }).setDepth(1).setOrigin(0.5);
        howToPlayText.setInteractive();
        howToPlayText.on('pointerover', function() {
            var hoverStyle = { fontFamily: 'Pixelify Sans', fontSize: 52, color: '#f2cb04', align: 'center' }; 
            howToPlayText.setStyle(hoverStyle);
            finger.setScale(1.5);
        });
        howToPlayText.on('pointerout', function () {
            var defaultStyle = { fontFamily: 'Pixelify Sans', fontSize: 38, color: '#ffffff', align: 'center' }; 
            howToPlayText.setStyle(defaultStyle);
            finger.setScale(1);
        });
        howToPlayText.on('pointerdown', function() {
            this.scene.changeHowTo();
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
        // if (this.logoTween)
        // {
        //     this.logoTween.stop();
        //     this.logoTween = null;
        // }

        this.scene.start('Game');
    }

    changeHowTo ()
    {
        this.scene.start('HowToPlay');
    }

    // moveLogo (vueCallback)
    // {
    //     if (this.logoTween)
    //     {
    //         if (this.logoTween.isPlaying())
    //         {
    //             this.logoTween.pause();
    //         }
    //         else
    //         {
    //             this.logoTween.play();
    //         }
    //     }
    //     else
    //     {
    //         this.logoTween = this.tweens.add({
    //             targets: this.logo,
    //             x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
    //             y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
    //             yoyo: true,
    //             repeat: -1,
    //             onUpdate: () => {
    //                 vueCallback({
    //                     x: Math.floor(this.logo.x),
    //                     y: Math.floor(this.logo.y)
    //                 });
    //             }
    //         });
    //     }
    // }
}
