"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    class Wall extends f.Node {
        constructor(player, x, y) {
            super("Wall");
            this.playerCollisionRadius = 0.9;
            this.shotCollisionRadius = 0.9;
            this.player = player;
            this.initWall(x, y);
            this.initSound();
        }
        async initSound() {
            let explosionSound = await f.Audio.load("../../DoomClone/sounds/barrelExploded.wav");
            this.componentAudioExplosion = new f.ComponentAudio(explosionSound);
        }
        initWall(x, y) {
            let wallIMG = document.getElementById("wall");
            let wallMeshComp = new f.ComponentMesh(new f.MeshCube());
            wallMeshComp.pivot.scaleZ(3);
            let wallTextureIMG = new f.TextureImage();
            wallTextureIMG.image = wallIMG;
            let wallTextureCoat = new f.CoatTextured();
            wallTextureCoat.texture = wallTextureIMG;
            let wallMaterial = new f.Material("Wall", f.ShaderTexture, wallTextureCoat);
            let wallComponentMat = new f.ComponentMaterial(wallMaterial);
            let wallComponentTransform = new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(x, y, 0)));
            this.addComponent(wallComponentTransform);
            this.addComponent(wallMeshComp);
            this.addComponent(wallComponentMat);
            this.addEventListener("playerCollision", () => { this.checkPlayerCollision(); }, true);
            this.addEventListener("shotCollision", () => { this.checkShotCollision(); }, true);
        }
        checkShotCollision() {
            let projectiles = this.player.getCurrentBullets();
            projectiles.forEach(bullet => {
                if (bullet.getRange() > 0) {
                    if (this.calculateDistance(bullet) <= this.shotCollisionRadius) {
                        this.player.deleteCertainBullet(bullet);
                        this.componentAudioExplosion.play(true);
                    }
                }
                else {
                    this.player.deleteCertainBullet(bullet);
                }
            });
        }
        calculateDistance(node) {
            let wallTranslationCopy = this.mtxLocal.translation.copy;
            let nodeTranslationCopy = node.mtxLocal.translation.copy;
            wallTranslationCopy.subtract(nodeTranslationCopy);
            return Math.sqrt(Math.pow(wallTranslationCopy.x, 2) + Math.pow(wallTranslationCopy.y, 2));
        }
        checkPlayerCollision() {
            let distance = this.calculateDistance(this.player);
            if (distance <= this.playerCollisionRadius) {
                this.player.setIsAllowedToMove(false);
            }
        }
    }
    doomClone.Wall = Wall;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Wall.js.map