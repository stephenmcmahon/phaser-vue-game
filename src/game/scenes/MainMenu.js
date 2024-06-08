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
        this.add.image(600, 400, 'background').setAlpha(0.75);

        this.logo = this.add.image(600, 300, 'logo').setDepth(1);

        this.add.text(600, 365, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 0,
            align: 'center'
        }).setDepth(1).setOrigin(0.5);

        playText = this.add.text(600, 500, 'Play Game', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setDepth(1).setOrigin(0.5);
        playText.setInteractive();
        playText.on('pointerover', function() {
            var hoverStyle = { fontFamily: 'Arial Black', fontSize: 52, color: '#2deeee',
            stroke: '#000000', strokeThickness: 8,
            align: 'center' }; 
            playText.setStyle(hoverStyle);
        });
        playText.on('pointerout', function () {
            var defaultStyle = { fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center' }; 
            playText.setStyle(defaultStyle);
        });
        playText.on('pointerdown', function() {
            this.scene.changeScene();
        });

        howToPlayText = this.add.text(600, 575, 'How To Play', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setDepth(1).setOrigin(0.5);
        howToPlayText.setInteractive();
        howToPlayText.on('pointerover', function() {
            var hoverStyle = { fontFamily: 'Arial Black', fontSize: 52, color: '#2deeee',
            stroke: '#000000', strokeThickness: 8,
            align: 'center' }; 
            howToPlayText.setStyle(hoverStyle);
        });
        howToPlayText.on('pointerout', function () {
            var defaultStyle = { fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center' }; 
            howToPlayText.setStyle(defaultStyle);
        });
        howToPlayText.on('pointerdown', function() {
            this.scene.changeHowTo();
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
