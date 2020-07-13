namespace doomClone {

	import f = FudgeCore;
	import fAid = FudgeAid;

	enum speedTypes {
		'WALK' = 10 / 1000,
		'ROTATION' = 50 / 1000,
		'SPRINT' = 20 / 1000
	}

	export class Player extends f.Node{

		private isDead : boolean;
		private egoCamera : f.ComponentCamera;
		private portraitCamera : f.ComponentCamera;
		private portraitSprites : fAid.NodeSprite;
		private pistolSprites : fAid.NodeSprite;
		private health : number;
		private ammo : number;
		private armor : number;
		private currentBullets : Bullet[];
		private stamina : number;
		private walkSpeed : number = speedTypes.WALK;
		private rotationSpeed : number = speedTypes.ROTATION;
		private keyMap : Map<string, boolean>;
		private healthBar : HTMLProgressElement;
		private staminaBar : HTMLProgressElement;
		private ammoBar : HTMLElement;
		private armorBar : HTMLElement;
		private readonly playerCollisionEvent : CustomEvent;
		private readonly playerInteractionEvent : CustomEvent;
		private isAllowedToMove : boolean;
		private componentAudio : f.ComponentAudio;
		private magazineEmptySound : f.Audio;
		private pickUpSound : f.Audio;
		private playerAttackedSound : f.Audio;
		private pistolSound : f.Audio;
		private playerDyingSound : f.Audio;
		private shotCollisionRadius : number = 0.9;

		constructor() {
			super("Player");
			this.isAllowedToMove = true;
			this.keyMap = new Map<string, boolean>();
			this.playerCollisionEvent = new CustomEvent<any>("playerCollision");
			this.playerInteractionEvent = new CustomEvent<any>("playerInteraction");
			this.initPlayer();
			this.initEgoCamera();
			this.initPortraitCamera();
			this.initKeyHandlers();
		}

		public setIsAllowedToMove(isAllowedToMove : boolean) : void {
			this.isAllowedToMove = isAllowedToMove;
		}

		public getPortraitSprites() : fAid.NodeSprite {
			return this.portraitSprites;
		}

		public getEgoCamera() : f.ComponentCamera {
			return this.egoCamera;
		}

		public getPortraitCamera() : f.ComponentCamera {
			return this.portraitCamera;
		}

		public getCurrentBullets() : Bullet[] {
			return this.currentBullets;
		}

		//deletes bullet and removes his event-listener
		public deleteCertainBullet(bullet : Bullet) : void {
			let index : number = this.currentBullets.indexOf(bullet);
			this.currentBullets.splice(index, 1);
			bullet.removeEventListener();
			this.getParent().removeChild(bullet);
		}

		public setHealth(health : number) : void {
			if(this.health + health > 0) {
				if (health > 0) {
					this.health += health;
					this.componentAudio.audio = this.pickUpSound;
					this.componentAudio.play(true);
				} else {
					this.health += (health / (this.armor / 100));
				}
			} else {
				this.setIsDeadTrue();
			}
			this.healthBar.value = this.health;
		}

		public getIsDead() : boolean {
			return this.isDead;
		}

		public playPlayerAttackedSound() : void {
			this.componentAudio.audio = this.playerAttackedSound;
			this.componentAudio.play(true);
		}

		public getHealth() : number {
			return this.health;
		}

		public setArmor(armor : number) : void {
			this.armor += armor;
			this.armorBar.innerText = String(this.armor) + "%";
			this.componentAudio.audio = this.pickUpSound;
			this.componentAudio.play(true);
		}

		public setAmmo(ammo : number) : void {
			this.ammo += ammo;
			this.ammoBar.innerText = String(this.ammo);
			this.componentAudio.audio = this.pickUpSound;
			this.componentAudio.play(true);
		}

		private setIsDeadTrue() : void {
			this.componentAudio.audio = this.playerDyingSound;
			this.componentAudio.play(true);
			this.isDead = true;
		}

		//inits parameter, bars, audio and sprites
		private initPlayer() : void {
			this.currentBullets = [];
			this.health = 100;
			this.ammo = 100;
			this.armor = 100;
			this.stamina = 100;
			this.isDead = false;
			this.healthBar = <HTMLProgressElement>document.getElementById("healthBar");
			this.staminaBar = <HTMLProgressElement>document.getElementById("staminaBar");
			this.ammoBar = <HTMLElement>document.getElementById("ammoPanel");
			this.armorBar = <HTMLElement>document.getElementById("armorPanel");
			this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(0,0,0))));
			this.loadPortraitSprites();
			this.loadSprites();
			this.initSounds();
			this.addEventListener("enemyShotCollision", () => { this.checkEnemyBulletCollision() }, true);
		}

		private checkEnemyBulletCollision() : void {
			let enemies : Enemy[] = <Enemy[]>this.getParent().getChildrenByName("Enemy");
			if(enemies[0] !== undefined) {
				enemies.forEach(enemy => {
					let projectiles: EnemyBullet[] = enemy.getBullets();
					projectiles.forEach(bullet => {
						if (bullet.getRange() > 0) {
							this.becomeDamaged(bullet, enemy);
						} else {
							bullet.playExplosionAnimation();
							enemy.deleteCertainBullet(bullet);
						}
					});
				});
			}
		}

		private becomeDamaged(bullet : EnemyBullet, enemy : Enemy) : void {
			if (this.calculateDistance(bullet) <= this.shotCollisionRadius) {
				bullet.playExplosionAnimation();
				enemy.deleteCertainBullet(bullet);
				this.playPlayerAttackedSound();
				this.setHealth(-bullet.getDamage());
			}
		}

		private calculateDistance(node : f.Node) : number {
			let wallTranslationCopy = this.mtxLocal.translation.copy;
			let nodeTranslationCopy = node.mtxLocal.translation.copy;
			wallTranslationCopy.subtract(nodeTranslationCopy);
			return Math.sqrt(Math.pow(wallTranslationCopy.x, 2) + Math.pow(wallTranslationCopy.y, 2));
		}

		private async initSounds() : Promise<void> {
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
		private loadPortraitSprites() : void{
			let coat: ƒ.CoatTextured = new ƒ.CoatTextured();
			coat.texture = new ƒ.TextureImage();
			coat.texture.image = <HTMLImageElement>document.getElementById("portrait");
			let portraitSpriteSheetAnimation : fAid.SpriteSheetAnimation = new fAid.SpriteSheetAnimation("portrait", coat);
			let startRect : f.Rectangle = new f.Rectangle(0, 0, 25, 30, f.ORIGIN2D.TOPLEFT);
			portraitSpriteSheetAnimation.generateByGrid(startRect, 3, new f.Vector2(0,0), 72, f.ORIGIN2D.CENTER);
			this.portraitSprites = new fAid.NodeSprite('portraitSprite');
			this.portraitSprites.setAnimation(portraitSpriteSheetAnimation);
			this.portraitSprites.framerate = 1;
			this.portraitSprites.showFrame(1);
			this.portraitSprites.setFrameDirection(0);
		}

		private loadSprites() : void {
			let coat: ƒ.CoatTextured = new ƒ.CoatTextured();
			coat.texture = new ƒ.TextureImage();
			coat.texture.image = <HTMLImageElement>document.getElementById("pistol");
			let spriteSheetAnimation : fAid.SpriteSheetAnimation = new fAid.SpriteSheetAnimation("pistol", coat);
			let startRect : f.Rectangle = new f.Rectangle(0, 0, 80, 122, f.ORIGIN2D.TOPLEFT);
			spriteSheetAnimation.generateByGrid(startRect, 5, new f.Vector2(0,0), 64, f.ORIGIN2D.CENTER);
			this.pistolSprites = new fAid.NodeSprite('pistolSprite');
			this.pistolSprites.setAnimation(spriteSheetAnimation);
			this.pistolSprites.framerate = 5;
			this.pistolSprites.showFrame(1);
			this.pistolSprites.setFrameDirection(0);
			this.pistolSprites.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(
				this.mtxLocal.translation.x,
				this.mtxLocal.translation.y + 1.8,
				this.mtxLocal.translation.z - 0.25
				)
			)));
			this.pistolSprites.mtxLocal.rotateX(90);
			this.pistolSprites.mtxLocal.scale(f.Vector3.ONE(0.5));
			this.pistolSprites.showFrame(0);
			this.pistolSprites.setFrameDirection(0);
			this.appendChild(this.pistolSprites);
		}

		//inits portraitCamera for face HUD
		private initPortraitCamera() : void {
			this.portraitCamera = new f.ComponentCamera();
			this.portraitCamera.pivot.translateZ(-1);
		}

		//inits egoCamera and rotate it to player pov
		private initEgoCamera() : void {
			this.egoCamera = new f.ComponentCamera();
			this.egoCamera.backgroundColor = f.Color.CSS('salmon');
			this.egoCamera.pivot.rotateY(90);
			this.egoCamera.pivot.rotateZ(90);
			this.egoCamera.pivot.rotateY(90);
			this.egoCamera.pivot.translateZ(-1);
			this.egoCamera.pivot.translateY(-0.1);
			this.addComponent(this.egoCamera);
		}

		private checkCollision() : void {
			this.getParent().broadcastEvent(this.playerCollisionEvent);
		}

		private initKeyMap() : void {
			this.keyMap.set(f.KEYBOARD_CODE.ARROW_UP, false);
			this.keyMap.set(f.KEYBOARD_CODE.ARROW_DOWN, false);
			this.keyMap.set(f.KEYBOARD_CODE.ARROW_RIGHT, false);
			this.keyMap.set(f.KEYBOARD_CODE.ARROW_LEFT, false);
			this.keyMap.set(f.KEYBOARD_CODE.SHIFT_LEFT, false);
			this.keyMap.set(f.KEYBOARD_CODE.CTRL_LEFT, false);
		}

		//inits key-handling for movement
		private initKeyHandlers() : void {
			this.initKeyMap();
			window.addEventListener("keydown", (event : KeyboardEvent) => {
				this.keyMap.set(event.code, true);
				this.checkUserInput();
			});
			window.addEventListener("keyup", (event : KeyboardEvent) => {
				this.pistolSprites.setFrameDirection(0);
				this.keyMap.set(event.code, false);
				if(event.code === f.KEYBOARD_CODE.SHIFT_LEFT){
					this.walkSpeed = speedTypes.WALK;
					if(this.stamina < 100) {
						new f.Timer(f.Time.game, 100, (100 - this.stamina) / 5, () => {
							this.relax();
						});
					}
				}
			});
		}

		//checks userinput
		private checkUserInput() : void {
			this.checkArrowUp();
			this.checkArrowLeft();
			this.checkArrowRight();
			this.checkArrowDown();
			this.checkCTRLKey();
			this.checkSpaceKey();
		}

		private checkSpaceKey() : void {
			if (this.keyMap.get(f.KEYBOARD_CODE.SPACE)) {
				this.interact();
			}
		}

		private checkCTRLKey() : void {
			if (this.keyMap.get(f.KEYBOARD_CODE.CTRL_LEFT)) {
				this.shoot();
			}
		}

		private checkArrowRight() : void {
			if (this.keyMap.get(f.KEYBOARD_CODE.ARROW_RIGHT)) {
				this.portraitSprites.showFrame(2);
				this.rotate(-this.rotationSpeed * f.Loop.timeFrameGame);
			}
		}

		private checkArrowLeft() : void {
			if (this.keyMap.get(f.KEYBOARD_CODE.ARROW_LEFT)) {
				this.portraitSprites.showFrame(0);
				this.rotate(this.rotationSpeed * f.Loop.timeFrameGame);
			}
		}

		/*
			checks if up and / or shift keys are pressed.
			if the player is colliding with a wall he will be ported backwards
		*/
		private checkArrowUp() : void {
			if (this.keyMap.get(f.KEYBOARD_CODE.ARROW_UP)) {
				this.checkCollision();
				if(this.isAllowedToMove) {
					this.move(this.walkSpeed * f.Loop.timeFrameGame);
					this.checkShiftKey();
				} else {
					this.move(-(this.walkSpeed * 2) * f.Loop.timeFrameGame);
					this.isAllowedToMove = true;
				}
				this.portraitSprites.showFrame(1);
				this.pistolSprites.setFrameDirection(1);
			}
		}

		private checkShiftKey() : void {
			if (this.keyMap.get(f.KEYBOARD_CODE.SHIFT_LEFT)) {
				this.sprint();
			}
		}

		private checkArrowDown() : void {
			if (this.keyMap.get(f.KEYBOARD_CODE.ARROW_DOWN)) {
				this.checkCollision();
				if(this.isAllowedToMove) {
					this.move(-this.walkSpeed * f.Loop.timeFrameGame);
				}
				this.pistolSprites.setFrameDirection(1);
			}
		}

		/*
			reduces stamina and sets walKSpeed to sprintspeed.
			if stamina is 0 the stamina will be reload by relax method in certain steps.
		*/
		private sprint() : void {
			if(this.stamina > 0) {
				this.walkSpeed = speedTypes.SPRINT;
				this.stamina -= 5;
				this.staminaBar.value = this.stamina;
			} else if(this.stamina === 0){
				new f.Timer(f.Time.game, 100, ( 100 - this.stamina ) / 5, () => { this.relax()});
			}
		}

		private relax() :  void{
			if(this.stamina < 100) {
				this.walkSpeed = speedTypes.WALK;
				this.stamina += 5;
				this.staminaBar.value = this.stamina;
			}
		}

		private rotate(amount : number) : void {
			this.mtxLocal.rotateZ(amount);
		}

		private move(amount : number) : void {
			this.mtxLocal.translateY(amount);
		}

		private interact() : void {
			this.getParent().broadcastEvent(this.playerInteractionEvent);
		}

		private shoot() : void {
			if(this.ammo > 0) {
				let bullet: Bullet = new Bullet(this.mtxLocal);
				this.getParent().appendChild(bullet);
				this.currentBullets.push(bullet);
				this.setAmmo(-1);
				this.componentAudio.audio = this.pistolSound;
				new f.Timer(f.Time.game, 100, 1, () => {
					this.pistolSprites.setFrameDirection(1);
				});
			} else {
				this.componentAudio.audio = this.magazineEmptySound;
			}
			this.componentAudio.play(true);
			this.pistolSprites.setFrameDirection(0);
		}

		private reload() : void {

		}

	}

}