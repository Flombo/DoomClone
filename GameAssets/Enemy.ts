namespace doomClone {

    import f =  FudgeCore;

    export class Enemy extends f.Node{

        private aggroRadius : number = 10;
        private shotCollisionRadius : number = 0.9;
        private playerColisionRadius : number = 0.9;
        private speed : number = 15 / 1000;
        private player : Player;
        private health : number = 20;
        private damage : number = 5;
        private componentAudioAttack : f.ComponentAudio;
        private componentAudioDead : f.ComponentAudio;
        private componentAudioShot : f.ComponentAudio;

        constructor(player : Player, x : number, y : number) {
            super("Enemy");
            this.player = player;
            this.initEnemy(x,y);
            this.initSounds();
        }

        private async initSounds() : Promise<void> {
            let attackSound : f.Audio = await f.Audio.load("../../DoomClone/sounds/decademonAttack.wav");
            let deadSound : f.Audio = await f.Audio.load("../../DoomClone/sounds/decademonDead.wav");
            let shotSound : f.Audio = await f.Audio.load("../../DoomClone/sounds/decademonShot.wav");
            this.componentAudioAttack = new f.ComponentAudio(attackSound);
            this.componentAudioDead = new f.ComponentAudio(deadSound);
            this.componentAudioShot = new f.ComponentAudio(shotSound);
        }

        private initEnemy(x : number, y : number) : void {
            let enemyMeshComp: f.ComponentMesh = new f.ComponentMesh(new f.MeshSphere());
            let enemyMaterial: f.Material = new f.Material("Wall", f.ShaderUniColor, new f.CoatColored(f.Color.CSS('red')));
            let enemyComponentMat: f.ComponentMaterial = new f.ComponentMaterial(enemyMaterial);
            let enemyComponentTransform: f.ComponentTransform = new f.ComponentTransform(
                f.Matrix4x4.TRANSLATION(new f.Vector3(x, y, 0)))
            this.addComponent(enemyComponentTransform);
            this.addComponent(enemyMeshComp);
            this.addComponent(enemyComponentMat);
            this.addEventListener("playerCollision", () => { this.checkPlayerCollision() }, true);
            this.addEventListener("shotCollision", () => { this.checkShotCollision() }, true);
        }

        private setHealth(damage : number) : void {
            if(this.health - damage <= 0) {
                this.componentAudioDead.play(true);
                this.die();
            } else {
                this.componentAudioShot.play(true);
                this.health -= damage;
            }
        }

        private die() : void {
            this.removeEventListener("playerCollision", this.checkPlayerCollision);
            this.removeEventListener("shotCollision", this.checkShotCollision);
            // f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.checkPlayerDistanceToAggroRadius);
            this.getParent().removeChild(this);
        }

        private checkPlayerDistanceToAggroRadius = () => {
            let distance = this.calculateDistance(this.player);
            if(distance <= this.aggroRadius) {
                this.mtxLocal.lookAtRotate(this.player.mtxLocal.translation, f.Vector3.X());
                this.mtxLocal.translateZ(this.speed * f.Loop.timeFrameGame);
            }
        }

        private checkShotCollision = () => {
            let projectiles : Bullet[] = this.player.getCurrentBullets();
            projectiles.forEach(bullet => {
                if(bullet.getRange() > 0) {
                    if (this.calculateDistance(bullet) <=  this.shotCollisionRadius) {
                        this.player.deleteCertainBullet(bullet);
                        this.setHealth(bullet.getDamage());
                    }
                } else {
                    this.player.deleteCertainBullet(bullet);
                }
            });
        }

        private calculateDistance(node : f.Node) : number {
            let enemyTranslationCopy = this.mtxLocal.translation.copy;
            let nodeTranslationCopy = node.mtxLocal.translation.copy;
            enemyTranslationCopy.subtract(nodeTranslationCopy);
            return Math.sqrt(Math.pow(enemyTranslationCopy.x, 2) + Math.pow(enemyTranslationCopy.y, 2));
        }

        private checkPlayerCollision = () => {
            this.checkPlayerDistanceToAggroRadius();
            let distance = this.calculateDistance(this.player);
            if(distance <= this.playerColisionRadius){
                this.mtxLocal.translateZ(-(this.speed * 5) * f.Loop.timeFrameGame);
                this.componentAudioAttack.play(true);
                this.player.playPlayerAttackedSound();
                this.player.setHealth(-this.damage);
            }
        }
    }

}