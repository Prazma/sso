        		var camera, scene, renderer, controls, floor, saber;
			var centerLayer, oneLayer, twoLayer, threeLayer;
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
				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000 );
				camera.position.z = 3;
				camera.position.y = 10;
				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xffffff );
				scene.fog = new THREE.Fog( 0xF0FBFF, 0, 2000 );
                var saberGeo = new THREE.BoxGeometry( 0.6, 10, 0.6 );
                var saberMat = new THREE.MeshBasicMaterial( { color: 0xffffff } );
                saber = new THREE.Mesh( saberGeo, saberMat );
                saber.position.z = 990;
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
		    		geometry = new THREE.ConeGeometry( 0.05, 2 );
				centerLayer = new THREE.MeshBasicMaterial( { color: 0xffffff } );
				oneLayer = new THREE.MeshBasicMaterial( { color: 0x03A9F4, transparent: true, opacity: 0.3 } );
				twoLayer = new THREE.MeshBasicMaterial( { color: 0x03A9F4, transparent: true, opacity: 0.2 } );
				threeLayer = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.18 } );

				mesh = new THREE.Mesh( geometry, centerLayer );
				scene.add( mesh );
				
				geometry = new THREE.ConeGeometry( 0.08, 2.01 );
				meshL1 = new THREE.Mesh( geometry, oneLayer );
				scene.add( meshL1 );

				
				geometry = new THREE.ConeGeometry( 0.1, 2.02 );
				meshL2 = new THREE.Mesh( geometry, twoLayer );
				scene.add( meshL2 );
				
				
				geometry = new THREE.ConeGeometry( 0.12, 2.03 );
				meshL3 = new THREE.Mesh( geometry, threeLayer );
				scene.add( meshL3 );
				
				mesh.position.y = 10;
				meshL1.position.y = 10;
				meshL2.position.y = 10;
				meshL3.position.y = 10;
			}
			function animate() {
				renderer.render( scene, camera );
				requestAnimationFrame( animate );
			}
