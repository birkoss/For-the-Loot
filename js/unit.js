class Unit extends Phaser.GameObjects.Container {

    constructor(scene, unitId, health) {
        super(scene, 0, 0);
        scene.add.existing(this);

        this.pixelScale = 3;
        this.unitId = unitId;

        this.health = this.maxHealth = health;

        this.create();
    }

    create() {
        this.unitData = {};

        let unitsData = this.scene.cache.json.get('data:units');
        unitsData.forEach(single_data => {
            if (single_data.id == this.unitId) {
                this.unitData = single_data;
            }
        }, this);

        this.background = this.scene.add.sprite(0, 0, "tileset:units", this.unitData.frames[0]);
        this.background.setScale(this.pixelScale);
        this.add(this.background);

        this.x += this.background.width / 2;
        this.y += this.background.height / 2;

        this.direction = -1;
    }

    damage(amount) {
        this.health = Math.max(0, this.health - amount);
    }

    animate() {
        this.background.anims.play(this.unitId);
    }

    move(gridX, gridY) {
        if (gridX < this.gridX) {
            this.face(-1);
        } else if (gridX > this.gridX) {
            this.face(1);
        }

        this.gridX = gridX;
        this.gridY = gridY;
        this.x = gridX * (this.background.width * this.pixelScale);
        this.y = gridY * (this.background.height * this.pixelScale);
    }

    face(newDirection) {
        if (newDirection == this.direction) {
            return;
        }

        this.direction = newDirection;
        this.scaleX = (this.direction == -1 ? 1 : -1);
    }

    deactivate() {
        this.background.anims.stop();
    }
};