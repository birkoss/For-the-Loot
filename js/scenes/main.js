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

        this.ui = this.add.group();

        this.enemy_name = this.add.bitmapText(100, 100, "font:gui", "11111", 20);
        this.enemy_name.setOrigin(0.5);
        this.enemy_name.tint = 0xd4d8e9;
        this.ui.add(this.enemy_name);

        this.enemy_health = this.add.bitmapText(100, 130, "font:gui", "111", 20);
        this.enemy_health.setOrigin(0.5);
        this.enemy_health.tint = 0xd4d8e9;
        this.ui.add(this.enemy_health);

        this.enemies = this.add.group();
        ['skeleton', 'knight', 'rogue', 'archer'].forEach(single_unit => {
            let enemy = new Unit(this, single_unit, 100);
            enemy.x = enemy.y = (48 * 3) + 24;
            enemy.animate();
            this.enemies.add(enemy);

            enemy.on("UNIT_CLICKED", this.onEnemyClicked, this);
            enemy.on("UNIT_KILLED", this.onEnemyKilled, this);
            enemy.on("UNIT_REVIVED", this.onEnemyRevived, this);

            enemy.alpha = 0;
        }, this);

        this.showEnemy();

        this.player = {
            clickDamage: 1,
            gold: 0
        };

        this.textDamagePool = this.add.group();
        for (var d=0; d<50; d++) {
            let dmgText = this.add.bitmapText(0, 0, "font:gui", d, 50);
            dmgText.poolIndex = d;
            dmgText.setActive(false);
            dmgText.setAlpha(0);
            dmgText.tween = this.tweens.add({
                targets: dmgText,
                alpha: 0,
                y: 100,
                x: Phaser.Math.Between(100, 300),
                duration: 1000,
                ease: 'Cubic',
                paused: true,
                onStart: function() {
                    console.log("onStart: " + dmgText.poolIndex);
                },
                onComplete: function() {
                    console.log("onComplete: " + dmgText.poolIndex);
                    dmgText.tween.stop();
                    dmgText.setActive(false);
                    this.textDamagePool.add(dmgText);
                },
                callbackScope: this
            });
         
            this.textDamagePool.add(dmgText);
        }

    }

    update() {
            
    }

    showEnemy() {
        let enemy_index = Phaser.Math.Between(0, this.enemies.countActive() - 1);
        let enemy = this.enemies.getChildren()[enemy_index];
        enemy.revive();
        enemy.alpha = 1;

        this.enemy_name.setText( enemy.unitData.id );
        this.enemy_health.setText( enemy.health + " HP" );
    }

    onEnemyClicked(enemy) {
        let dmgText = this.textDamagePool.get(enemy.x, enemy.y);
        this.textDamagePool.remove(dmgText);
        console.log("onEnemyClicked: " + dmgText.poolIndex + " @ " + dmgText.active + " / " + dmgText.tween.isPlaying() + "," + dmgText.tween.isPaused() + " # " + dmgText.tween.paused + " $ " + this.tweens.getAllTweens().length + " ... " + dmgText.tween.totalProgress);

        
        //dmgText.setText(this.player.clickDamage);
        dmgText.setAlpha(1);
        dmgText.setActive(true);
        //dmgText.tween.restart();
        dmgText.tween.play();

        console.log(dmgText.tween.hasStarted);
        //console.log(this.tweens.getAllTweens());

        enemy.damage(this.player.clickDamage);
        if (enemy.health > 0) {
            this.enemy_health.setText(enemy.health + ' HP');
        }
    }

    onEnemyKilled(enemy) {
        enemy.alpha = 0;

        this.showEnemy();
    }

    onEnemyRevived(enemy) {

    }

 
};