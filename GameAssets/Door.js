"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    class Door extends f.Node {
        constructor(player, x, y) {
            super("Door");
            this.playerCollisionRadius = 0.9;
            this.playerInteractionRadius = 1.1;
            this.shotCollisionRadius = 0.5;
            this.isClosed = true;
            this.player = player;
            this.initDoor(x, y);
            this.initDoorSounds();
        }
        async initDoorSounds() {
            let doorOpeningSound = await f.Audio.load("../../DoomClone/sounds/doorOpened.wav");
            let doorClosingSound = await f.Audio.load("../../DoomClone/sounds/doorClosed.wav");
            this.componentAudioOpening = new f.ComponentAudio(doorOpeningSound);
            this.componentAudioClosing = new f.ComponentAudio(doorClosingSound);
            this.addComponent(this.componentAudioClosing);
            this.addComponent(this.componentAudioOpening);
        }
        initDoor(x, y) {
            let doorIMG = document.getElementById("door");
            let doorMeshComp = new f.ComponentMesh(new f.MeshCube());
            doorMeshComp.pivot.scaleZ(3);
            let doorTextureIMG = new f.TextureImage();
            doorTextureIMG.image = doorIMG;
            let doorTextureCoat = new f.CoatTextured();
            doorTextureCoat.texture = doorTextureIMG;
            let doorMaterial = new f.Material("Door", f.ShaderTexture, doorTextureCoat);
            let doorComponentMat = new f.ComponentMaterial(doorMaterial);
            let doorComponentTransform = new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(x, y, 0)));
            this.addComponent(doorComponentTransform);
            this.addComponent(doorMeshComp);
            this.addComponent(doorComponentMat);
            this.addEventListener("playerCollision", () => { this.checkPlayerCollision(); }, true);
            this.addEventListener("shotCollision", () => { this.checkShotCollision(); }, true);
            this.addEventListener("playerInteraction", () => { this.checkPlayerInteraction(); }, true);
        }
        checkShotCollision() {
            let projectiles = this.player.getCurrentBullets();
            projectiles.forEach(bullet => {
                if (bullet.getRange() > 0) {
                    if (this.isClosed && this.calculateDistance(bullet) <= this.shotCollisionRadius) {
                        this.player.deleteCertainBullet(bullet);
                    }
                }
                else {
                    this.player.deleteCertainBullet(bullet);
                }
            });
        }
        calculateDistance(node) {
            let doorTranslationCopy = this.mtxLocal.translation.copy;
            let nodeTranslationCopy = node.mtxLocal.translation.copy;
            doorTranslationCopy.subtract(nodeTranslationCopy);
            return Math.sqrt(Math.pow(doorTranslationCopy.x, 2) + Math.pow(doorTranslationCopy.y, 2));
        }
        checkPlayerInteraction() {
            let distance = this.calculateDistance(this.player);
            if (distance <= this.playerInteractionRadius) {
                this.closeOrOpenDoor();
            }
        }
        closeOrOpenDoor() {
            if (this.isClosed) {
                this.isClosed = false;
                new f.Timer(f.Time.game, 100, 6, () => {
                    this.mtxLocal.translateZ(0.5);
                });
                this.componentAudioOpening.play(true);
            }
            else {
                this.isClosed = true;
                new f.Timer(f.Time.game, 100, 6, () => {
                    this.mtxLocal.translateZ(-0.5);
                });
                this.componentAudioClosing.play(true);
            }
        }
        checkPlayerCollision() {
            if (this.isClosed) {
                if (this.calculateDistance(this.player) <= this.playerCollisionRadius) {
                    this.player.setIsAllowedToMove(false);
                }
            }
        }
    }
    doomClone.Door = Door;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Door.js.map