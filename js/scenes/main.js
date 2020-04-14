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

        this.player_gold = this.add.bitmapText(100, 200, "font:gui", "0 GOLD", 20);
        this.player_gold.setOrigin(0.5);
        this.player_gold.tint = 0xd4d8e9;
        this.ui.add(this.player_gold);

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
            clickDamage: 9,
            gold: 0
        };

        /* Generate the text damages sprites and tweens */
        this.textDamagePool = this.add.group();
        var radius = 120;
        for (var d=0; d<50; d++) {
            let dmgText = this.add.bitmapText(0, 0, "font:gui", d, 50);
            dmgText.setOrigin(0.5);
            dmgText.poolIndex = d;
            dmgText.setActive(false);
            dmgText.setAlpha(0);
            var angle = Math.random()*Math.PI*2;
            dmgText.tween = this.tweens.add({
                targets: dmgText,
                alpha: 0,
                y: (Math.sin(angle)*radius),
                x: (Math.cos(angle)*radius),
                duration: 1000,
                ease: 'Cubic',
                paused: true,
                onComplete: function() {
                    dmgText.setActive(false);
                    this.textDamagePool.add(dmgText);
                },
                callbackScope: this
            });
         
            this.textDamagePool.add(dmgText);
        }

        this.coins = this.add.group();
        for (var i=0; i<50; i++) {
            let coin = new Coin(this);
            coin.x = 0;
            coin.y = 0;
            coin.on("COIN_CLICKED", this.onCoinSelected, this);
            coin.alpha = 0;
            coin.setActive(false);

            this.coins.add(coin);
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
        let dmgText = this.textDamagePool.get(0, 0);
        this.textDamagePool.remove(dmgText);

        enemy.add(dmgText);
        
        dmgText.setText(this.player.clickDamage);
        dmgText.setAlpha(1);
        dmgText.setActive(true);
        dmgText.tween.play();

        enemy.damage(this.player.clickDamage);
        if (enemy.health > 0) {
            this.enemy_health.setText(enemy.health + ' HP');
        }
    }

    onEnemyKilled(enemy) {
        enemy.alpha = 0;

        let coin = this.coins.get(enemy.x + Phaser.Math.Between(-100, 100), enemy.y);
        this.coins.remove(coin);
        coin.alpha = 1;
        coin.setActive(true);
        this.time.addEvent({
            delay: 3000,
            callback: this.onCoinSelected,
            callbackScope: this,
            args: [coin]
        });

        this.showEnemy();
    }

    onEnemyRevived(enemy) {

    }

    onCoinSelected(coin) {
        if (!coin.active) {
            return;
        }

        this.player.gold += coin.goldValue;

        this.player_gold.setText(this.player.gold + " GOLD");
        
        coin.setAlpha(0);
        coin.setActive(false);
        this.coins.add(coin);
    }

 
};