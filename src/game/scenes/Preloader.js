import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        // this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');
        this.load.image('backgroundGame', 'bg-game.png');
        this.load.image('backgroundMenu', 'bg-menu.png');
        this.load.image('cursorMain', 'cursor-main.png');
        this.load.image('cursorGame', 'cursor-game.png');
        this.load.image('ground', 'platform.png');
        this.load.image('platformLow', 'platform-low.png');
        this.load.image('platformMid', 'platform-mid.png');
        this.load.image('platformHigh', 'platform-high.png');
        this.load.image('wall', 'wall.png');
        this.load.image('star', 'star.png');
        this.load.image('bomb', 'bomb.png');
        this.load.image('grenade', 'grenade.png');
        this.load.image('grenadeMob', 'grenade-mob.png');
        this.load.image('grenadeLauncher', 'grenade-launcher.png');
        this.load.image('mobLauncher', 'mob-launcher.png');
        this.load.image('dudeDuck', 'dude-duck.png');
        this.load.spritesheet('dude',
            'dude.png',
            { frameWidth: 48, frameHeight: 96 }
        );
        this.load.spritesheet('mob',
            'mob.png',
            { frameWidth: 48, frameHeight: 96 }
        );
        this.load.spritesheet('explosion',
            'explosion.png',
            { frameWidth: 50, frameHeight: 50 }
        );
        this.load.spritesheet('explosionMob',
            'explosion-mob.png',
            { frameWidth: 50, frameHeight: 50 }
        );
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
