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
        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#489848");

        this.background = this.add.group();

        this.enemies = this.add.group();
        ['skeleton', 'knight', 'rogue', 'archer'].forEach(single_unit => {
            let enemy = new Unit(this, single_unit, 100);
            enemy.x = enemy.y = (48 * 3) + 24;
            enemy.animate();
            this.enemies.add(enemy);

            enemy.on("UNIT_CLICKED", this.onEnemyClicked, this);
            enemy.on("UNIT_KILLED", this.onEnemyKilled, this);

            enemy.alpha = 0;
        }, this);

        this.showEnemy();

        this.player = {
            clickDamage: 1,
            gold: 0
        };
    }

    update() {
        
    }

    showEnemy() {
        let enemy_index = Phaser.Math.Between(0, this.enemies.countActive() - 1);
        let enemy = this.enemies.getChildren()[enemy_index];
        enemy.revive();
        enemy.alpha = 1;
    }

    onEnemyClicked(enemy) {
        enemy.damage(this.player.clickDamage);
    }

    onEnemyKilled(enemy) {
        enemy.alpha = 0;

        this.showEnemy();
    }

 
};