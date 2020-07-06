"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    var fAid = FudgeAid;
    let speedTypes;
    (function (speedTypes) {
        speedTypes[speedTypes["WALK"] = 0.015] = "WALK";
        speedTypes[speedTypes["ROTATION"] = 0.15] = "ROTATION";
        speedTypes[speedTypes["SPRINT"] = 0.04] = "SPRINT";
    })(speedTypes || (speedTypes = {}));
    class Player extends f.Node {
        constructor() {
            super("Player");
            this.walkSpeed = speedTypes.WALK;
            this.rotationSpeed = speedTypes.ROTATION;
            this.isAllowedToMove = true;
            this.keyMap = new Map();
            this.playerCollisionEvent = new CustomEvent("playerCollision");
            this.initPlayer();
            this.initEgoCamera();
            this.initPortraitCamera();
            this.initKeyHandlers();
        }
        //inits key-handling for movement
        initKeyHandlers() {
            window.addEventListener("keydown", (event) => {
                this.keyMap.set(event.code, true);
                this.checkUserInput();
            });
            window.addEventListener("keyup", (event) => {
                this.keyMap.delete(event.code);
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
        setIsAllowedToMove(isAllowedToMove) {
            this.isAllowedToMove = isAllowedToMove;
        }
        //inits parameter, bars, audio and sprites
        async initPlayer() {
            this.currentBullets = [];
            this.health = 100;
            this.ammo = 100;
            this.armor = 100;
            this.stamina = 100;
            this.healthBar = document.getElementById("healthBar");
            this.staminaBar = document.getElementById("staminaBar");
            this.ammoBar = document.getElementById("ammoPanel");
            this.loadPortraitSprites();
            // this.loadSprites();
            this.shotSound = await f.Audio.load("../../DoomClone/sounds/pistol.wav");
            this.emptyAmmoSound = await f.Audio.load("../../DoomClone/sounds/wrong.mp3");
            this.componentAudio = new f.ComponentAudio(this.shotSound);
            this.addComponent(new f.ComponentAudioListener());
            this.addComponent(this.componentAudio);
            this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(0, 0, 0))));
        }
        //loads portraitsprites
        loadPortraitSprites() {
            let portraitSpriteSheetIMG = document.getElementById("portrait");
            let portraitSpriteSheet = fAid.createSpriteSheet("pistol", portraitSpriteSheetIMG);
            let portraitSpriteSheetAnimation = new fAid.SpriteSheetAnimation("pistol", portraitSpriteSheet);
            let startRect = new f.Rectangle(0, 0, 24, 30, f.ORIGIN2D.TOPLEFT);
            portraitSpriteSheetAnimation.generateByGrid(startRect, 3, new f.Vector2(0, 0), 72, f.ORIGIN2D.TOPLEFT);
            this.portraitSprites = new fAid.NodeSprite('portraitSprite');
            this.portraitSprites.setAnimation(portraitSpriteSheetAnimation);
            this.portraitSprites.showFrame(1);
            this.portraitSprites.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(0, 0, -1))));
        }
        loadSprites() {
            let pistolSpriteSheetIMG = document.getElementById("pistol");
            let pistolSpriteSheet = fAid.createSpriteSheet("pistol", pistolSpriteSheetIMG);
            let spriteSheetAnimation = new fAid.SpriteSheetAnimation("pistol", pistolSpriteSheet);
            let startRect = new f.Rectangle(0, 0, 80, 122, f.ORIGIN2D.TOPLEFT);
            spriteSheetAnimation.generateByGrid(startRect, 5, new f.Vector2(0, 0), 64, f.ORIGIN2D.CENTER);
            let nodeSprite = new fAid.NodeSprite('nodeSprite');
            nodeSprite.setAnimation(spriteSheetAnimation);
            this.appendChild(nodeSprite);
        }
        //inits portraitCamera for face HUD
        initPortraitCamera() {
            this.portraitCamera = new f.ComponentCamera();
            this.portraitCamera.backgroundColor = f.Color.CSS('black');
            this.portraitCamera.pivot.rotateY(180);
            this.portraitCamera.pivot.translateZ(5);
            this.portraitCamera.pivot.translateX(-2);
            this.portraitCamera.pivot.lookAt(this.portraitSprites.mtxLocal.translation, f.Vector3.Z());
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
                this.rotate(-this.rotationSpeed * f.Loop.timeFrameGame);
            }
        }
        checkArrowLeft() {
            if (this.keyMap.get(f.KEYBOARD_CODE.ARROW_LEFT)) {
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
            console.log('interact');
        }
        shoot() {
            if (this.ammo > 0) {
                let bullet = new doomClone.Bullet(this.mtxLocal);
                this.currentBullets.push(bullet);
                this.getParent().appendChild(bullet);
                this.setAmmo(-1);
                // this.componentAudio.audio = this.shotSound;
                this.componentAudio.play(true);
            }
            else {
                // this.componentAudio.audio = this.emptyAmmoSound;
                this.componentAudio.play(true);
            }
        }
        checkCollision() {
            this.getParent().broadcastEvent(this.playerCollisionEvent);
        }
        setHealth(health) {
            this.health += health;
            this.healthBar.value = this.health;
        }
        setArmor(armor) {
            this.armor += armor;
        }
        setAmmo(ammo) {
            this.ammo += ammo;
            this.ammoBar.innerText = String(this.ammo);
        }
        reload() {
        }
    }
    doomClone.Player = Player;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Player.js.map