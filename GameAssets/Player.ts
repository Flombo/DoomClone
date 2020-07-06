namespace doomClone {

	import f = FudgeCore;
	import fAid = FudgeAid;

	enum speedTypes {
		'WALK' = 15 / 1000,
		'ROTATION' = 150 / 1000,
		'SPRINT' = 40 / 1000
	}

	export class Player extends f.Node{

		private egoCamera : f.ComponentCamera;
		private portraitCamera : f.ComponentCamera;
		private portraitSprites : fAid.NodeSprite;
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
		private playerCollisionEvent : CustomEvent;
		private isAllowedToMove : boolean;
		private componentAudio : f.ComponentAudio;
		private emptyAmmoSound : f.Audio;
		private shotSound : f.Audio;

		constructor() {
			super("Player");
			this.isAllowedToMove = true;
			this.keyMap = new Map<string, boolean>();
			this.playerCollisionEvent = new CustomEvent<any>("playerCollision");
			this.initPlayer();
			this.initEgoCamera();
			this.initPortraitCamera();
			this.initKeyHandlers();
		}

		//inits key-handling for movement
		private initKeyHandlers() : void {
			window.addEventListener("keydown", (event : KeyboardEvent) => {
				this.keyMap.set(event.code, true);
				this.checkUserInput();
			});
			window.addEventListener("keyup", (event : KeyboardEvent) => {
				this.keyMap.delete(event.code);
				if(event.code === f.KEYBOARD_CODE.SHIFT_LEFT){
					this.walkSpeed = speedTypes.WALK;
					if(this.stamina < 100) {
						new f.Timer(f.Time.game, 100, (100 - this.stamina) / 5, () => {
							this.relax()
						});
					}
				}
			});
		}

		public setIsAllowedToMove(isAllowedToMove : boolean) : void {
			this.isAllowedToMove = isAllowedToMove;
		}

		//inits parameter, bars, audio and sprites
		private async initPlayer() : Promise<void> {
			this.currentBullets = [];
			this.health = 100;
			this.ammo = 100;
			this.armor = 100;
			this.stamina = 100;
			this.healthBar = <HTMLProgressElement>document.getElementById("healthBar");
			this.staminaBar = <HTMLProgressElement>document.getElementById("staminaBar");
			this.ammoBar = <HTMLElement>document.getElementById("ammoPanel");
			this.loadPortraitSprites();
			// this.loadSprites();
			this.shotSound = await f.Audio.load("../../DoomClone/sounds/pistol.wav");
			this.emptyAmmoSound = await f.Audio.load("../../DoomClone/sounds/wrong.mp3");
			this.componentAudio = new f.ComponentAudio(this.shotSound);
			this.addComponent(new f.ComponentAudioListener());
			this.addComponent(this.componentAudio);
			this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(0,0,0))));
		}

		//loads portraitsprites
		private loadPortraitSprites() : void{
			let portraitSpriteSheetIMG = <HTMLImageElement>document.getElementById("portrait");
			let portraitSpriteSheet = fAid.createSpriteSheet("pistol", portraitSpriteSheetIMG);
			let portraitSpriteSheetAnimation : fAid.SpriteSheetAnimation = new fAid.SpriteSheetAnimation("pistol", portraitSpriteSheet);
			let startRect : f.Rectangle = new f.Rectangle(0, 0, 24, 30, f.ORIGIN2D.TOPLEFT);
			portraitSpriteSheetAnimation.generateByGrid(startRect, 3, new f.Vector2(0,0), 72, f.ORIGIN2D.TOPLEFT);
			this.portraitSprites = new fAid.NodeSprite('portraitSprite');
			this.portraitSprites.setAnimation(portraitSpriteSheetAnimation);
			this.portraitSprites.showFrame(1);
			this.portraitSprites.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(0,0,-1))));
		}

		private loadSprites() : void {
			let pistolSpriteSheetIMG = <HTMLImageElement>document.getElementById("pistol");
			let pistolSpriteSheet = fAid.createSpriteSheet("pistol", pistolSpriteSheetIMG);
			let spriteSheetAnimation : fAid.SpriteSheetAnimation = new fAid.SpriteSheetAnimation("pistol", pistolSpriteSheet);
			let startRect : f.Rectangle = new f.Rectangle(0, 0, 80, 122, f.ORIGIN2D.TOPLEFT);
			spriteSheetAnimation.generateByGrid(startRect, 5, new f.Vector2(0,0), 64, f.ORIGIN2D.CENTER);
			let nodeSprite : fAid.NodeSprite = new fAid.NodeSprite('nodeSprite');
			nodeSprite.setAnimation(spriteSheetAnimation);
			this.appendChild(nodeSprite);
		}

		//inits portraitCamera for face HUD
		private initPortraitCamera() : void {
			this.portraitCamera = new f.ComponentCamera();
			this.portraitCamera.backgroundColor = f.Color.CSS('black');
			this.portraitCamera.pivot.rotateY(180);
			this.portraitCamera.pivot.translateZ(5);
			this.portraitCamera.pivot.translateX(-2)
			this.portraitCamera.pivot.lookAt(this.portraitSprites.mtxLocal.translation, f.Vector3.Z());
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
				this.rotate(-this.rotationSpeed * f.Loop.timeFrameGame);
			}
		}

		private checkArrowLeft() : void {
			if (this.keyMap.get(f.KEYBOARD_CODE.ARROW_LEFT)) {
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
			console.log('interact');
		}

		private shoot() : void {
			if(this.ammo > 0) {
				let bullet: Bullet = new Bullet(this.mtxLocal);
				this.currentBullets.push(bullet);
				this.getParent().appendChild(bullet);
				this.setAmmo(-1);
				// this.componentAudio.audio = this.shotSound;
				this.componentAudio.play(true);
			} else {
				// this.componentAudio.audio = this.emptyAmmoSound;
				this.componentAudio.play(true);
			}
		}

		private checkCollision() : void {
			this.getParent().broadcastEvent(this.playerCollisionEvent);
		}

		public setHealth(health : number) : void {
			this.health += health;
			this.healthBar.value = this.health;
		}

		public setArmor(armor : number) : void {
			this.armor += armor;
		}

		public setAmmo(ammo : number) : void {
			this.ammo += ammo;
			this.ammoBar.innerText = String(this.ammo);
		}

		private reload() : void {

		}

	}

}