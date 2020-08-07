"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    var fAid = FudgeAid;
    let SpeedTypes;
    (function (SpeedTypes) {
        SpeedTypes[SpeedTypes["WALK"] = 0.05] = "WALK";
        SpeedTypes[SpeedTypes["ROTATION"] = 0.15000000000000002] = "ROTATION";
        SpeedTypes[SpeedTypes["SPRINT"] = 0.1] = "SPRINT";
    })(SpeedTypes || (SpeedTypes = {}));
    class Player extends f.Node {
        constructor() {
            super("Player");
            this.walkSpeed = SpeedTypes.WALK;
            this.rotationSpeed = SpeedTypes.ROTATION;
            this.isGamePaused = false;
            this.controlsLoader = new doomClone.ControlsLoader();
            this.keyMap = new Map();
            this.playerCollisionEvent = new CustomEvent("playerCollision");
            this.playerInteractionEvent = new CustomEvent("playerInteraction");
            this.initPlayer();
            this.initEgoCamera();
            this.initPistolCamera();
            this.initPortraitCamera();
            this.initKeyHandlers();
        }
        setIsGamePaused(isGamePaused) {
            this.isGamePaused = isGamePaused;
        }
        getPortraitSprites() {
            return this.portraitSprites;
        }
        getEgoCamera() {
            return this.egoCamera;
        }
        getPistolCamera() {
            return this.pistolCamera;
        }
        getPortraitCamera() {
            return this.portraitCamera;
        }
        getCurrentBullets() {
            return this.currentBullets;
        }
        getPistolSprites() {
            return this.pistolSprites;
        }
        getMoveAmount() {
            return this.moveAmount;
        }
        //deletes bullet and removes his event-listener
        deleteCertainBullet(bullet) {
            let index = this.currentBullets.indexOf(bullet);
            this.currentBullets.splice(index, 1);
            bullet.removeEventListener();
            new f.Timer(f.Time.game, 500, 1, () => {
                if (this.getParent() !== null) {
                    this.getParent().removeChild(bullet);
                }
            });
        }
        setHealth(health) {
            if (this.health + health > 0) {
                if (health > 0) {
                    this.health += health;
                    this.componentAudio.audio = this.pickUpSound;
                    this.componentAudio.play(true);
                }
                else {
                    this.health += (health / (this.armor / 100));
                }
            }
            else {
                this.health = 0;
                this.isDead = true;
            }
            this.healthBar.value = this.health;
        }
        getIsDead() {
            return this.isDead;
        }
        playPlayerAttackedSound() {
            this.componentAudio.audio = this.playerAttackedSound;
            this.componentAudio.play(true);
        }
        getHealth() {
            return this.health;
        }
        setArmor(armor) {
            this.armor += armor;
            this.armorBar.innerText = String(this.armor) + "%";
            this.componentAudio.audio = this.pickUpSound;
            this.componentAudio.play(true);
        }
        setAmmo(ammo) {
            this.ammo += ammo;
            this.ammoBar.innerText = String(this.ammo);
            this.componentAudio.audio = this.pickUpSound;
            this.componentAudio.play(true);
        }
        //inits parameter, bars, audio and sprites
        initPlayer() {
            this.currentBullets = [];
            this.health = 100;
            this.ammo = 100;
            this.armor = 100;
            this.stamina = 100;
            this.isDead = false;
            this.healthBar = document.getElementById("healthBar");
            this.staminaBar = document.getElementById("staminaBar");
            this.ammoBar = document.getElementById("ammoPanel");
            this.armorBar = document.getElementById("armorPanel");
            this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(0, 0, 0))));
            this.mtxLocal.rotateY(-90);
            this.mtxLocal.rotateZ(-90);
            this.loadPortraitSprites();
            this.loadSprites();
            this.initSounds();
            this.addEventListener("enemyShotCollision", () => { this.checkEnemyBulletCollision(); }, true);
        }
        checkEnemyBulletCollision() {
            let enemies = this.getParent().getChildrenByName("Enemy");
            if (enemies[0] !== undefined) {
                enemies.forEach(enemy => {
                    let projectiles = enemy.getBullets();
                    projectiles.forEach(bullet => {
                        if (bullet.getRange() > 0) {
                            this.takeDamage(bullet, enemy);
                        }
                        else {
                            bullet.playExplosionAnimation();
                            enemy.deleteCertainBullet(bullet);
                        }
                    });
                });
            }
        }
        takeDamage(bullet, enemy) {
            if (bullet.mtxLocal.translation.isInsideSphere(this.mtxLocal.translation, 1)) {
                bullet.playExplosionAnimation();
                enemy.deleteCertainBullet(bullet);
                this.playPlayerAttackedSound();
                this.setHealth(-bullet.getDamage());
            }
        }
        async initSounds() {
            this.pistolSound = await f.Audio.load("../../sounds/pistol.wav");
            this.magazineEmptySound = await f.Audio.load("../../sounds/wrong.mp3");
            this.pickUpSound = await f.Audio.load("../../sounds/reload.wav");
            this.playerAttackedSound = await f.Audio.load("../../sounds/playerShot.wav");
            this.componentAudio = new f.ComponentAudio(this.pistolSound);
            this.componentAudio.volume = 1;
            this.addComponent(new f.ComponentAudioListener());
            this.addComponent(this.componentAudio);
        }
        //loads portraitsprites
        loadPortraitSprites() {
            let coat = new ƒ.CoatTextured();
            coat.texture = new ƒ.TextureImage();
            coat.texture.image = document.getElementById("portrait");
            let portraitSpriteSheetAnimation = new fAid.SpriteSheetAnimation("portrait", coat);
            let startRect = new f.Rectangle(0, 0, 25, 30, f.ORIGIN2D.TOPLEFT);
            portraitSpriteSheetAnimation.generateByGrid(startRect, 3, new f.Vector2(0, 0), 72, f.ORIGIN2D.CENTER);
            this.portraitSprites = new fAid.NodeSprite('portraitSprite');
            this.portraitSprites.setAnimation(portraitSpriteSheetAnimation);
            this.portraitSprites.framerate = 1;
            this.portraitSprites.showFrame(1);
            this.portraitSprites.setFrameDirection(0);
        }
        loadSprites() {
            let coat = new ƒ.CoatTextured();
            coat.texture = new ƒ.TextureImage();
            coat.texture.image = document.getElementById("pistol");
            let spriteSheetAnimation = new fAid.SpriteSheetAnimation("pistol", coat);
            let startRect = new f.Rectangle(0, 0, 80, 122, f.ORIGIN2D.TOPLEFT);
            spriteSheetAnimation.generateByGrid(startRect, 5, new f.Vector2(0, 0), 64, f.ORIGIN2D.CENTER);
            this.pistolSprites = new fAid.NodeSprite('pistolSprite');
            this.pistolSprites.setAnimation(spriteSheetAnimation);
            this.pistolSprites.framerate = 5;
            this.pistolSprites.showFrame(1);
            this.pistolSprites.setFrameDirection(0);
            this.pistolSprites.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(this.mtxLocal.translation.x, this.mtxLocal.translation.y - 0.25, this.mtxLocal.translation.z + 1.8))));
            this.pistolSprites.mtxLocal.scale(f.Vector3.ONE(0.5));
            this.pistolSprites.showFrame(0);
            this.pistolSprites.setFrameDirection(0);
        }
        //inits portraitCamera for face HUD
        initPortraitCamera() {
            this.portraitCamera = new f.ComponentCamera();
            this.portraitCamera.pivot.translateZ(-1);
        }
        //inits egoCamera and rotate it to player pov
        initEgoCamera() {
            this.egoCamera = new f.ComponentCamera();
            this.egoCamera.backgroundColor = f.Color.CSS('salmon');
            this.egoCamera.pivot.translateZ(-1);
            this.egoCamera.pivot.translateY(-0.1);
            this.addComponent(this.egoCamera);
        }
        initPistolCamera() {
            this.pistolCamera = new f.ComponentCamera();
            this.pistolCamera.backgroundColor = f.Color.CSS('none', 0);
            this.pistolCamera.pivot.translateZ(-1);
            this.pistolCamera.pivot.translateY(-0.1);
        }
        checkCollision() {
            this.getParent().broadcastEvent(this.playerCollisionEvent);
        }
        initKeyMap() {
            this.keyMap.set(this.controlsLoader.getUpKey(), false);
            this.keyMap.set(this.controlsLoader.getDownKey(), false);
            this.keyMap.set(this.controlsLoader.getLeftKey(), false);
            this.keyMap.set(this.controlsLoader.getRightKey(), false);
            this.keyMap.set(this.controlsLoader.getInteractKey(), false);
            this.keyMap.set(this.controlsLoader.getShootKey(), false);
            this.keyMap.set(this.controlsLoader.getSprintKey(), false);
        }
        //inits key-handling for movement
        initKeyHandlers() {
            this.initKeyMap();
            window.addEventListener("keydown", (event) => {
                if (!this.isGamePaused) {
                    this.keyMap.set(event.code, true);
                    this.checkUserInput();
                }
            });
            window.addEventListener("keyup", (event) => {
                if (!this.isGamePaused) {
                    this.pistolSprites.setFrameDirection(0);
                    this.keyMap.set(event.code, false);
                    if (event.code === f.KEYBOARD_CODE.SHIFT_LEFT) {
                        this.walkSpeed = SpeedTypes.WALK;
                        if (this.stamina < 100) {
                            new f.Timer(f.Time.game, 100, (100 - this.stamina) / 5, () => {
                                this.relax();
                            });
                        }
                    }
                }
            });
        }
        //checks userinput
        checkUserInput() {
            this.checkUpKey();
            this.checkLeftKey();
            this.checkRightKey();
            this.checkDownKey();
            this.checkShootKey();
            this.checkInteractKey();
        }
        checkInteractKey() {
            if (this.keyMap.get(this.controlsLoader.getInteractKey())) {
                this.interact();
            }
        }
        checkShootKey() {
            if (this.keyMap.get(this.controlsLoader.getShootKey())) {
                this.shoot();
            }
        }
        checkRightKey() {
            if (this.keyMap.get(this.controlsLoader.getRightKey())) {
                this.checkCollision();
                this.portraitSprites.showFrame(2);
                this.rotate(-this.rotationSpeed * f.Loop.timeFrameGame);
            }
        }
        checkLeftKey() {
            if (this.keyMap.get(this.controlsLoader.getLeftKey())) {
                this.checkCollision();
                this.portraitSprites.showFrame(0);
                this.rotate(this.rotationSpeed * f.Loop.timeFrameGame);
            }
        }
        /*
            checks if up and / or shift keys are pressed.
            if the player is colliding with a wall he will be ported backwards
        */
        checkUpKey() {
            if (this.keyMap.get(this.controlsLoader.getUpKey())) {
                this.checkCollision();
                this.moveAmount = this.walkSpeed * f.Loop.timeFrameGame;
                this.move(this.moveAmount);
                this.checkSprintKey();
                this.checkLeftKey();
                this.checkRightKey();
                this.portraitSprites.showFrame(1);
                this.pistolSprites.setFrameDirection(1);
            }
        }
        checkSprintKey() {
            if (this.keyMap.get(this.controlsLoader.getSprintKey())) {
                this.sprint();
            }
        }
        checkDownKey() {
            if (this.keyMap.get(this.controlsLoader.getDownKey())) {
                this.checkCollision();
                this.moveAmount = -this.walkSpeed * f.Loop.timeFrameGame;
                this.move(this.moveAmount);
                this.checkLeftKey();
                this.checkRightKey();
                this.portraitSprites.showFrame(1);
                this.pistolSprites.setFrameDirection(1);
            }
        }
        /*
            reduces stamina and sets walKSpeed to sprintspeed.
            if stamina is 0 the stamina will be reload by relax method in certain steps.
        */
        sprint() {
            if (this.stamina > 0) {
                this.walkSpeed = SpeedTypes.SPRINT;
                this.stamina -= 5;
                this.staminaBar.value = this.stamina;
            }
            else if (this.stamina === 0) {
                new f.Timer(f.Time.game, 100, (100 - this.stamina) / 5, () => { this.relax(); });
            }
        }
        relax() {
            if (this.stamina < 100) {
                this.walkSpeed = SpeedTypes.WALK;
                this.stamina += 5;
                this.staminaBar.value = this.stamina;
            }
        }
        rotate(amount) {
            this.mtxLocal.rotateY(amount);
        }
        move(amount) {
            this.mtxLocal.translateZ(amount);
        }
        interact() {
            this.getParent().broadcastEvent(this.playerInteractionEvent);
        }
        shoot() {
            if (this.ammo > 0) {
                let bullet = new doomClone.PlayerBullet(this.mtxLocal);
                this.getParent().appendChild(bullet);
                this.currentBullets.push(bullet);
                this.setAmmo(-1);
                this.componentAudio.audio = this.pistolSound;
                new f.Timer(f.Time.game, 100, 1, () => {
                    this.pistolSprites.setFrameDirection(1);
                });
            }
            else {
                this.componentAudio.audio = this.magazineEmptySound;
            }
            this.componentAudio.play(true);
            this.pistolSprites.setFrameDirection(0);
        }
    }
    doomClone.Player = Player;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Player.js.map