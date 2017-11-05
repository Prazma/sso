var camera, scene, renderer, controls, floor, saberPointer;
			var centerLayer, oneLayer, twoLayer, threeLayer, shooterMach;
            var saberOriginX, saberOriginY;
			var geometry, mesh, meshL1, meshL2, meshL3;
			var objects = [];
			var raycaster;
			var blocker = document.getElementById( 'blocker' );
			var instructions = document.getElementById( 'instructions' );
			// http://www.html5rocks.com/en/tutorials/pointerlock/intro/
			init();
			animate();
			var controlsEnabled = false;
			var moveForward = false;
			var moveBackward = false;
			var moveLeft = false;
			var moveRight = false;
			var canJump = false;
			var prevTime = performance.now();
			var velocity = new THREE.Vector3();
			var direction = new THREE.Vector3();
			function init() {
                saberOriginX = 0;
                saberOriginY = 0;
				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000 );
				camera.position.z = 3;
				camera.position.y = 10;
				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0x000000 );
				scene.fog = new THREE.Fog( 0xF0FBFF, 0, 2000 );
                
                var pointerG = new THREE.BoxGeometry( 10, 10, 10 );
                var pointerM = new THREE.MeshBasicMaterial( { color: 0x000000 } );
                saberPointer = new THREE.Mesh( pointerG, pointerM );
                scene.add( saberPointer );
                
                var shooterMachG = new THREE.BoxGeometry( 3, 10, 3 );
                var shooterMachM = new THREE.MeshBasicMaterial( { color: 0xbfbfbf } );
                shooterMach = new THREE.Mesh( shooterMachG, shooterMachM );
                scene.add( shooterMach );
                shooterMach.position.z = -50;
                shooterMach.position.y = 10;
                
                var ambient = new THREE.AmbientLight( 0x444444 );
				scene.add( ambient );
				var directionalLight = new THREE.DirectionalLight( 0xffeedd );
				directionalLight.position.set( 0, 0, 1 ).normalize();
				scene.add( directionalLight );
                var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
				light.position.set( 0.5, 1, 0.75 );
				scene.add( light );
				raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
				// floor
				var floorGeometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
				var floorMaterial = new THREE.MeshBasicMaterial( { color: 0x8CD144 } );
				floor = new THREE.Mesh( floorGeometry, floorMaterial );
				scene.add( floor );
                floor.rotation.x = Math.PI / -2;
                
                	geometry = new THREE.ConeGeometry( 0.25, 15 );
                geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, 7, 0) );
				centerLayer = new THREE.MeshBasicMaterial( { color: 0xffffff } );
				oneLayer = new THREE.MeshBasicMaterial( { color: 0x03A9F4, transparent: true, opacity: 0.3 } );
				twoLayer = new THREE.MeshBasicMaterial( { color: 0x03A9F4, transparent: true, opacity: 0.2 } );
				threeLayer = new THREE.MeshBasicMaterial( { color: 0x03A9F4, transparent: true, opacity: 0.18 } );

				mesh = new THREE.Mesh( geometry, centerLayer );
				scene.add( mesh );
				
				geometry = new THREE.ConeGeometry( 0.35, 15.1 );
                geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, 7, 0) );
				meshL1 = new THREE.Mesh( geometry, oneLayer );
				scene.add( meshL1 );

				
				geometry = new THREE.ConeGeometry( 0.45, 15.2 );
                geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, 7, 0) );
				meshL2 = new THREE.Mesh( geometry, twoLayer );
				scene.add( meshL2 );
				
				
				geometry = new THREE.ConeGeometry( 0.55, 15.3 );
                geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, 7, 0) );
				meshL3 = new THREE.Mesh( geometry, threeLayer );
				scene.add( meshL3 );
                
				mesh.position.y = 5;
				meshL1.position.y = 5;
				meshL2.position.y = 5;
				meshL3.position.y = 5;
				mesh.position.z = 7;
				meshL1.position.z = 7;
				meshL2.position.z = 7;
				meshL3.position.z = 7;
                
				// objects
                scene.add( makeSkybox( [
				    'https://raw.githubusercontent.com/Prazma/xfinity/master/map/right.png', // right
				    'https://raw.githubusercontent.com/Prazma/xfinity/master/map/left.png', // left
				    'https://raw.githubusercontent.com/Prazma/xfinity/master/map/top.png', // top
				    'https://raw.githubusercontent.com/Prazma/xfinity/master/map/bottom.png', // bottom
				    'https://raw.githubusercontent.com/Prazma/xfinity/master/map/front.png', // back
                    'https://raw.githubusercontent.com/Prazma/xfinity/master/map/back.png'  // front
                ], 20000 ));
				//
				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );
				//
				window.addEventListener( 'resize', onWindowResize, false );
			}
			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}
            function makeSkybox( urls, size ) {
				var skyboxCubemap = new THREE.CubeTextureLoader().load( urls );
				skyboxCubemap.format = THREE.RGBFormat;
				var skyboxShader = THREE.ShaderLib['cube'];
				skyboxShader.uniforms['tCube'].value = skyboxCubemap;
				return new THREE.Mesh(
					new THREE.BoxGeometry( size, size, size ),
					new THREE.ShaderMaterial({
						fragmentShader : skyboxShader.fragmentShader, vertexShader : skyboxShader.vertexShader,
						uniforms : skyboxShader.uniforms, depthWrite : false, side : THREE.BackSide
					})
				);
                document.canvas.requestPointerLock();
			}
			function animate() {
                saberPointer.position.z = -40;
                saberPointer.position.x = saberOriginX;
                saberPointer.position.y = saberOriginY;
                camera.position.z = 20;
				renderer.render( scene, camera );
				requestAnimationFrame( animate );
			}
            function saberOrigin(e) {
                saberOriginX = e.clientX;
                saberOriginY = e.clientY;
            }
