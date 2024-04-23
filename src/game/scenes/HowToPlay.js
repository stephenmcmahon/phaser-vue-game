import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class HowToPlay extends Scene
{
    constructor ()
    {
        super('HowToPlay');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0xff0000);

        this.add.image(512, 384, 'background').setAlpha(0.5);

        this.add.text(512, 384, 'How To Play', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }

    // changeScene ()
    // {
    //     this.scene.start('MainMenu');
    // }
}