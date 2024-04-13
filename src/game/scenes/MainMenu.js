import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
export class MainMenu extends Scene
{
    // logoTween;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(600, 400, 'background');

        this.logo = this.add.image(600, 300, 'logo').setDepth(100);

        this.add.text(600, 365, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 0,
            align: 'center'
        }).setDepth(100).setOrigin(0.5);

        var playText = this.add.text(600, 500, 'Play Game', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setDepth(100).setOrigin(0.5);
        playText.setInteractive();
        playText.on('pointerdown', function() {
            this.scene.changeScene();
        });
        
        EventBus.emit('current-scene-ready', this);
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
