"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    var fAid = FudgeAid;
    let speedTypes;
    (function (speedTypes) {
        speedTypes[speedTypes["WALK"] = 0.01] = "WALK";
        speedTypes[speedTypes["ROTATION"] = 0.05] = "ROTATION";
        speedTypes[speedTypes["SPRINT"] = 0.02] = "SPRINT";
    })(speedTypes || (speedTypes = {}));
    class Player extends f.Node {
        constructor() {
            super("Player");
            this.walkSpeed = speedTypes.WALK;
            this.rotationSpeed = speedTypes.ROTATION;
            this.shotCollisionRadius = 0.9;
            this.isAllowedToMove = true;
            this.keyMap = new Map();
            this.playerCollisionEvent = new CustomEvent("playerCollision");
            this.playerInteractionEvent = new CustomEvent("playerInteraction");
            this.initPlayer();
            this.initEgoCamera();
            this.initPortraitCamera();
            this.initKeyHandlers();
        }
        setIsAllowedToMove(isAllowedToMove) {
            this.isAllowedToMove = isAllowedToMove;
        }
        getPortraitSprites() {
            return this.portraitSprites;
        }
        getEgoCamera() {
            return this.egoCamera;
        }
        getPortraitCamera() {
            return this.portraitCamera;
        }
        getCurrentBullets() {
            return this.currentBullets;
        }
        //deletes bullet and removes his event-listener
        deleteCertainBullet(bullet) {
            let index = this.currentBullets.indexOf(bullet);
            this.currentBullets.splice(index, 1);
            bullet.removeEventListener();
            this.getParent().removeChild(bullet);
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
                this.setIsDeadTrue();
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
        setIsDeadTrue() {
            this.componentAudio.audio = this.playerDyingSound;
            this.componentAudio.play(true);
            this.isDead = true;
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
                            this.becomeDamaged(bullet, enemy);
                        }
                        else {
                            bullet.playExplosionAnimation();
                            enemy.deleteCertainBullet(bullet);
                        }
                    });
                });
            }
        }
        becomeDamaged(bullet, enemy) {
            if (this.calculateDistance(bullet) <= this.shotCollisionRadius) {
                bullet.playExplosionAnimation();
                enemy.deleteCertainBullet(bullet);
                this.playPlayerAttackedSound();
                this.setHealth(-bullet.getDamage());
            }
        }
        calculateDistance(node) {
            let wallTranslationCopy = this.mtxLocal.translation.copy;
            let nodeTranslationCopy = node.mtxLocal.translation.copy;
            wallTranslationCopy.subtract(nodeTranslationCopy);
            return Math.sqrt(Math.pow(wallTranslationCopy.x, 2) + Math.pow(wallTranslationCopy.y, 2));
        }
        async initSounds() {
            this.pistolSound = await f.Audio.load("../../sounds/pistol.wav");
            this.magazineEmptySound = await f.Audio.load("../../sounds/wrong.mp3");
            this.pickUpSound = await f.Audio.load("../../sounds/reload.wav");
            this.playerAttackedSound = await f.Audio.load("../../sounds/playerShot.wav");
            this.playerDyingSound = await f.Audio.load("../../sounds/playerDeath.wav");
            this.componentAudio = new f.ComponentAudio(this.pistolSound);
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
            this.pistolSprites.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(this.mtxLocal.translation.x, this.mtxLocal.translation.y + 1.8, this.mtxLocal.translation.z - 0.25))));
            this.pistolSprites.mtxLocal.rotateX(90);
            this.pistolSprites.mtxLocal.scale(f.Vector3.ONE(0.5));
            this.pistolSprites.showFrame(0);
            this.pistolSprites.setFrameDirection(0);
            this.appendChild(this.pistolSprites);
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
            this.egoCamera.pivot.rotateY(90);
            this.egoCamera.pivot.rotateZ(90);
            this.egoCamera.pivot.rotateY(90);
            this.egoCamera.pivot.translateZ(-1);
            this.egoCamera.pivot.translateY(-0.1);
            this.addComponent(this.egoCamera);
        }
        checkCollision() {
            this.getParent().broadcastEvent(this.playerCollisionEvent);
        }
        initKeyMap() {
            this.keyMap.set(f.KEYBOARD_CODE.ARROW_UP, false);
            this.keyMap.set(f.KEYBOARD_CODE.ARROW_DOWN, false);
            this.keyMap.set(f.KEYBOARD_CODE.ARROW_RIGHT, false);
            this.keyMap.set(f.KEYBOARD_CODE.ARROW_LEFT, false);
            this.keyMap.set(f.KEYBOARD_CODE.SHIFT_LEFT, false);
            this.keyMap.set(f.KEYBOARD_CODE.CTRL_LEFT, false);
        }
        //inits key-handling for movement
        initKeyHandlers() {
            this.initKeyMap();
            window.addEventListener("keydown", (event) => {
                this.keyMap.set(event.code, true);
                this.checkUserInput();
            });
            window.addEventListener("keyup", (event) => {
                this.pistolSprites.setFrameDirection(0);
                this.keyMap.set(event.code, false);
                if (event.code === f.KEYBOARD_CODE.SHIFT_LEFT) {
                    this.walkSpeed = speedTypes.WALK;
                    if (this.stamina < 100) {
                        new f.Timer(f.Time.game, 100, (100 - this.stamina) / 5, () => {
                            this.relax();
                        });
                    }
                }
            });
        }
        //checks userinput
        checkUserInput() {
            this.checkArrowUp();
            this.checkArrowLeft();
            this.checkArrowRight();
            this.checkArrowDown();
            this.checkCTRLKey();
            this.checkSpaceKey();
        }
        checkSpaceKey() {
            if (this.keyMap.get(f.KEYBOARD_CODE.SPACE)) {
                this.interact();
            }
        }
        checkCTRLKey() {
            if (this.keyMap.get(f.KEYBOARD_CODE.CTRL_LEFT)) {
                this.shoot();
            }
        }
        checkArrowRight() {
            if (this.keyMap.get(f.KEYBOARD_CODE.ARROW_RIGHT)) {
                this.portraitSprites.showFrame(2);
                this.rotate(-this.rotationSpeed * f.Loop.timeFrameGame);
            }
        }
        checkArrowLeft() {
            if (this.keyMap.get(f.KEYBOARD_CODE.ARROW_LEFT)) {
                this.portraitSprites.showFrame(0);
                this.rotate(this.rotationSpeed * f.Loop.timeFrameGame);
            }
        }
        /*
            checks if up and / or shift keys are pressed.
            if the player is colliding with a wall he will be ported backwards
        */
        checkArrowUp() {
            if (this.keyMap.get(f.KEYBOARD_CODE.ARROW_UP)) {
                this.checkCollision();
                if (this.isAllowedToMove) {
                    this.move(this.walkSpeed * f.Loop.timeFrameGame);
                    this.checkShiftKey();
                }
                else {
                    this.move(-(this.walkSpeed * 2) * f.Loop.timeFrameGame);
                    this.isAllowedToMove = true;
                }
                this.portraitSprites.showFrame(1);
                this.pistolSprites.setFrameDirection(1);
            }
        }
        checkShiftKey() {
            if (this.keyMap.get(f.KEYBOARD_CODE.SHIFT_LEFT)) {
                this.sprint();
            }
        }
        checkArrowDown() {
            if (this.keyMap.get(f.KEYBOARD_CODE.ARROW_DOWN)) {
                this.checkCollision();
                if (this.isAllowedToMove) {
                    this.move(-this.walkSpeed * f.Loop.timeFrameGame);
                }
                this.pistolSprites.setFrameDirection(1);
            }
        }
        /*
            reduces stamina and sets walKSpeed to sprintspeed.
            if stamina is 0 the stamina will be reload by relax method in certain steps.
        */
        sprint() {
            if (this.stamina > 0) {
                this.walkSpeed = speedTypes.SPRINT;
                this.stamina -= 5;
                this.staminaBar.value = this.stamina;
            }
            else if (this.stamina === 0) {
                new f.Timer(f.Time.game, 100, (100 - this.stamina) / 5, () => { this.relax(); });
            }
        }
        relax() {
            if (this.stamina < 100) {
                this.walkSpeed = speedTypes.WALK;
                this.stamina += 5;
                this.staminaBar.value = this.stamina;
            }
        }
        rotate(amount) {
            this.mtxLocal.rotateZ(amount);
        }
        move(amount) {
            this.mtxLocal.translateY(amount);
        }
        interact() {
            this.getParent().broadcastEvent(this.playerInteractionEvent);
        }
        shoot() {
            if (this.ammo > 0) {
                let bullet = new doomClone.Bullet(this.mtxLocal);
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
        reload() {
        }
    }
    doomClone.Player = Player;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Player.js.map