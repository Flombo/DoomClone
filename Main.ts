namespace doomClone {

	import f = FudgeCore;

	window.addEventListener("load", (event) => {
		hndLoad(event);
	});

	function hndLoad(_event: Event): void {
		let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("game");
		let portraitCanvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("portraitCanvas");

		let root : f.Node = new f.Node("root");

		let groundNode : Ground = new Ground();
		root.appendChild(groundNode);

		let roofNode : Roof = new Roof();
		root.appendChild(roofNode);

		let player : Player = new Player();
		root.appendChild(player);

		let enemies : Enemy[] = [];

		let enemy : Enemy = new Enemy(player, 12, 12);
		root.appendChild(enemy);
		enemies.push(enemy);

		let enemy1 : Enemy = new Enemy(player, -10, -10);
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

		for(let y = 16; y >= 16; y--) {
			for(let x = 17; x > -17; x--) {
				let wallLeft : Wall = new Wall(player, enemies, x, y);
				root.appendChild(wallLeft);
			}
		}

		for(let y = -16; y <= -16; y++) {
			for(let x = 17; x > -17; x--) {
				let wallRight : Wall = new Wall(player, enemies, x, y);
				root.appendChild(wallRight);
			}
		}

		for(let x = 17; x >= 17; x--) {
			for(let y = 16; y > -16; y--) {
				let wallTop : Wall = new Wall(player, enemies, x, y);
				root.appendChild(wallTop);
			}
		}

		for(let x = -13; x <= -13; x++) {
			for(let y = 16; y > -16; y--) {
				let wallBottom : Wall = new Wall(player, enemies, x, y);
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

		// let light : f.LightAmbient = new f.LightAmbient(new f.Color(1, 1, 0.5, 0.1));
		// let directionalLight : f.LightDirectional = new f.LightDirectional(f.Color.CSS('white'));
		// let directionalLightComp : f.ComponentLight = new f.ComponentLight(directionalLight);
		// directionalLightComp.pivot.translateZ(10);
		// directionalLightComp.pivot.lookAt(player.mtxLocal.translation);
		// let lightComponent : f.ComponentLight = new f.ComponentLight(light);
		// let lightNode : f.Node = new f.Node("light");
		// lightNode.addComponent(lightComponent);
		// lightNode.addComponent(directionalLightComp);
		// root.appendChild(lightNode);

		let gameMenuManager : GameMenuManager = new GameMenuManager(canvas);
		gameMenuManager.initGameMenuHandling();

		let viewport : f.Viewport = new f.Viewport();
		viewport.initialize("Game", root, player.getEgoCamera(), canvas);

		let viewportPortrait : f.Viewport = new f.Viewport();
		viewportPortrait.initialize("Portrait", player.getPortraitSprites(), player.getPortraitCamera(), portraitCanvas);

		f.AudioManager.default.listenTo(root);
		f.AudioManager.default.listen(player.getComponent(f.ComponentAudioListener));
		f.Loop.addEventListener("loopFrame", renderLoop);
		f.Loop.start(f.LOOP_MODE.TIME_GAME, 30);

		function renderLoop () {
			if(!gameMenuManager.getIsPaused()) {
				if(!player.getIsDead()) {
					f.AudioManager.default.update();
					viewportPortrait.draw();
					viewport.draw();
					console.log(f.Loop.getFpsRealAverage());
				} else {
					gameMenuManager.showDeadMenu();
				}
			}
		}

	}

}