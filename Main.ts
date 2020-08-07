namespace doomClone {

	import f = FudgeCore;

	window.addEventListener("load", (event) => {
		hndLoad(event);
	});

	async function hndLoad(_event: Event): Promise<void> {
		let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("game");
		let portraitCanvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("portraitCanvas");
		let pistolCanvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("playerPistolCanvas");

		let root : f.Node = new f.Node("root");

		let groundNode : Ground = new Ground();
		root.appendChild(groundNode);

		let roofNode : Roof = new Roof();
		root.appendChild(roofNode);

		let player : Player = new Player();
		root.appendChild(player);

		let enemies : Enemy[] = [];

		let enemy : Enemy = new Enemy(player, 7, 7);
		root.appendChild(enemy);
		enemies.push(enemy);

		let enemy1 : Enemy = new Enemy(player, 10, 10);
		root.appendChild(enemy1);
		enemies.push(enemy1);

		let wall : Wall = new Wall(player, enemies,2, 4);
		let wall1 : Wall = new Wall(player, enemies, 2, 1);
		let wall2 : Wall = new Wall(player, enemies, 3, 1);
		let wall3 : Wall = new Wall(player, enemies, 4, 1);
		let wall4 : Wall = new Wall(player, enemies, 5, 1);
		let wall5 : Wall = new Wall(player, enemies, 6, 1);
		let wall6 : Wall = new Wall(player, enemies, 3, 4);
		let wall7 : Wall = new Wall(player, enemies, 4, 4);
		let wall8 : Wall = new Wall(player, enemies, 5, 4);
		let wall9 : Wall = new Wall(player, enemies, 6, 4);
		let wall10 : Wall = new Wall(player, enemies, 6, 3);
		let wall11 : Wall = new Wall(player, enemies, 6, 2);
		root.appendChild(wall);
		root.appendChild(wall1);
		root.appendChild(wall2);
		root.appendChild(wall3);
		root.appendChild(wall4);
		root.appendChild(wall5);
		root.appendChild(wall6);
		root.appendChild(wall7);
		root.appendChild(wall8);
		root.appendChild(wall9);
		root.appendChild(wall10);
		root.appendChild(wall11);

		for(let z = 16; z >= 16; z--) {
			for(let x = 17; x > -17; x--) {
				let wallLeft : Wall = new Wall(player, enemies, x, z);
				root.appendChild(wallLeft);
			}
		}

		for(let z = -16; z <= -16; z++) {
			for(let x = 17; x > -17; x--) {
				let wallRight : Wall = new Wall(player, enemies, x, z);
				root.appendChild(wallRight);
			}
		}

		for(let x = 17; x >= 17; x--) {
			for(let z = 16; z > -16; z--) {
				let wallTop : Wall = new Wall(player, enemies, x, z);
				root.appendChild(wallTop);
			}
		}

		for(let x = -13; x <= -13; x++) {
			for(let z = 16; z > -16; z--) {
				let wallBottom : Wall = new Wall(player, enemies, x, z);
				root.appendChild(wallBottom);
			}
		}

		let healthKit : HealthKit = new HealthKit(player, -8, 4);
		root.appendChild(healthKit);

		let armorKit : ArmorKit = new ArmorKit(player, -4, -4);
		root.appendChild(armorKit);

		let ammoKit : AmmoKit = new AmmoKit(player, 4, 2);
		root.appendChild(ammoKit);

		let door : Door = new Door(player, enemies,2, 2.5);
		root.appendChild(door);

		let gameMenuManager : GameMenuManager = new GameMenuManager(canvas, enemies, player);
		gameMenuManager.initGameMenuHandling();

		let viewport : f.Viewport = new f.Viewport();
		viewport.initialize("Game", root, player.getEgoCamera(), canvas);

		let viewportPortrait : f.Viewport = new f.Viewport();
		viewportPortrait.initialize("Portrait", player.getPortraitSprites(), player.getPortraitCamera(), portraitCanvas);

		let viewportPistol : f.Viewport = new f.Viewport();
		viewportPistol.initialize("Pistol", player.getPistolSprites(), player.getPistolCamera(), pistolCanvas);

		f.AudioManager.default.listenTo(root);
		f.AudioManager.default.listen(player.getComponent(f.ComponentAudioListener));
		f.Loop.addEventListener("loopFrame", renderLoop);
		f.Loop.start(f.LOOP_MODE.TIME_GAME, 24);

		let doomTheme : HTMLAudioElement = new Audio("../../sounds/doomTheme.mp3");
		doomTheme.volume = 0.25;
		doomTheme.loop = true;
		await doomTheme.play();

		function renderLoop () {
			if(!gameMenuManager.getIsPaused()) {
				if(!player.getIsDead()) {
					f.AudioManager.default.update();
					viewportPortrait.draw();
					viewportPistol.draw();
					viewport.draw();
				} else {
					gameMenuManager.showDeadMenu();
				}
			}
		}

	}

}