class Coin extends Phaser.GameObjects.Container {

    constructor(scene) {
        super(scene, 0, 0);
        scene.add.existing(this);

        this.goldValue = 1;

        this.create();
    }

    create() {
        this.background = this.scene.add.sprite(0, 0, "tileset:items", 10);
        this.background.setScale(this.pixelScale);
        this.add(this.background);

        this.background.setInteractive();
        this.background.on("pointerdown", this.onPointerDown, this);
    }

    onPointerDown() {
        this.emit("COIN_CLICKED", this);
    }
};