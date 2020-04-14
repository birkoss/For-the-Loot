class MainScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainScene'
        });
    }

    init(config) {
        this.levelConfig = config;
    }

    create() {
        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#3f7cb6");



        this.user = new Unit(this, "knight", 100);
        this.user.x = this.user.y = (48 * 3) + 24;
        this.user.animate();
        this.add.existing(this.user);
    }
};