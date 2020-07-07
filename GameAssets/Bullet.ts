namespace doomClone {

    import f = FudgeCore;

    export class Bullet extends f.Node{

        private speed : number = 100 / 1000;
        private static cubeMesh : f.MeshCube = new f.MeshCube();
        private static bulletMaterial = new f.Material(
            "Orange", f.ShaderFlat, new f.CoatColored(f.Color.CSS("orange"))
        );
        private range : number;
        private damage : number;
        private readonly shotCollisionEvent : CustomEvent;

        constructor(startMatrix : f.Matrix4x4) {
            super("Ammo");
            this.range = 30;
            this.damage = 5;
            this.shotCollisionEvent = new CustomEvent<any>("shotCollision")
            this.initBullet(startMatrix);
        }

        private initBullet(startMatrix : f.Matrix4x4) : void {
            let componentMesh = new f.ComponentMesh(Bullet.cubeMesh);
            componentMesh.pivot.scaleY(0.4);
            componentMesh.pivot.scaleX(0.1);
            componentMesh.pivot.scaleZ(0.1);
            this.addComponent(componentMesh);
            let ammoCMPMaterial : f.ComponentMaterial = new f.ComponentMaterial(Bullet.bulletMaterial);
            this.addComponent(ammoCMPMaterial);
            this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(startMatrix.translation)));
            this.mtxLocal.translateZ(-0.75);
            this.mtxLocal.rotation = startMatrix.rotation;
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
        }

        private update = () =>  {
            let distanceToTravel: number = this.speed * f.Loop.timeFrameGame;
            this.mtxLocal.translateY(distanceToTravel);
            this.getParent().broadcastEvent(this.shotCollisionEvent);
            this.range--;
        }

        public getRange() : number {
            return this.range;
        }

        public getDamage() : number {
            return this.damage;
        }

        public removeEventListener() : void {
            f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.update);
        }

    }

}