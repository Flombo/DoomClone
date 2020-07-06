"use strict";
var doomClone;
(function (doomClone) {
    var f = FudgeCore;
    class Bullet extends f.Node {
        constructor(startMatrix) {
            super("Ammo");
            this.speed = 100 / 1000;
            this.update = () => {
                let distanceToTravel = this.speed * f.Loop.timeFrameGame;
                this.mtxLocal.translateY(distanceToTravel);
                this.getParent().broadcastEvent(this.shotCollisionEvent);
            };
            this.range = 30;
            this.shotCollisionEvent = new CustomEvent("shotCollision");
            this.initBullet(startMatrix);
        }
        initBullet(startMatrix) {
            let componentMesh = new f.ComponentMesh(Bullet.cubeMesh);
            componentMesh.pivot.scaleY(0.4);
            componentMesh.pivot.scaleX(0.1);
            componentMesh.pivot.scaleZ(0.1);
            this.addComponent(componentMesh);
            let ammoCMPMaterial = new f.ComponentMaterial(Bullet.bulletMaterial);
            this.addComponent(ammoCMPMaterial);
            this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(startMatrix.translation)));
            this.mtxLocal.translateZ(-0.75);
            this.mtxLocal.rotation = startMatrix.rotation;
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        getRange() {
            return this.range;
        }
        decrementRange() {
            this.range--;
        }
        removeEventListener() {
            f.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
    }
    Bullet.cubeMesh = new f.MeshCube();
    Bullet.bulletMaterial = new f.Material("Orange", f.ShaderFlat, new f.CoatColored(f.Color.CSS("orange")));
    doomClone.Bullet = Bullet;
})(doomClone || (doomClone = {}));
//# sourceMappingURL=Bullet.js.map