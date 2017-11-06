var camera, scene, renderer, controls, floor, saberPointer, cameraIntroAnimation, prevline;
			var centerLayer, oneLayer, twoLayer, threeLayer, shooterMach;
            var saberOriginX, saberOriginY;
			var geometry, mesh, meshL1, meshL2, meshL3, handle, hand;
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
                cameraIntroAnimation = 0.96;
                saberOriginX = 0;
                saberOriginY = 0;
				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000 );
				camera.position.z = 3;
				camera.position.y = 10;
                camera.position.z = -80;
				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0x000000 );
				scene.fog = new THREE.Fog( 0xF0FBFF, 0, 2000 );
                
                var prevlineG = new THREE.BoxGeometry( 0.5, 0.5, 90 );
                prevlineG.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, -45) );
                var prevlineM = new THREE.MeshBasicMaterial( { color: 0xff0000, transparent: true, opacity: 0.5 } );
                prevline = new THREE.Mesh( prevlineG, prevlineM );
                scene.add( prevline );
                prevline.position.y = 11;
                prevline.position.x = 4;
                prevline.position.z = 10;
                
                var pointerG = new THREE.BoxGeometry( 10, 10, 10 );
                var pointerM = new THREE.MeshBasicMaterial( { color: 0x000000, transparent: true, opacity: 0 } );
                saberPointer = new THREE.Mesh( pointerG, pointerM );
                scene.add( saberPointer );
                
                var objectLoader = new THREE.ObjectLoader();
				
                objectLoader.load("https://prazma.github.io/sso/sceneModel/turretShooter.json", function ( obj ) {
                    scene.add( obj );
                    obj.position.y = 0;
                    obj.position.z = -80;
                    obj.scale.set( 0.3, 0.3, 0.3);
                } );
                
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
                
                	geometry = new THREE.BoxGeometry( 0.25, 0.25, 12 );
                geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, 7) );
				centerLayer = new THREE.MeshBasicMaterial( { color: 0xffffff } );
				oneLayer = new THREE.MeshBasicMaterial( { color: 0x03A9F4, transparent: true, opacity: 0.3 } );
				twoLayer = new THREE.MeshBasicMaterial( { color: 0x03A9F4, transparent: true, opacity: 0.2 } );
				threeLayer = new THREE.MeshBasicMaterial( { color: 0x03A9F4, transparent: true, opacity: 0.18 } );

				mesh = new THREE.Mesh( geometry, centerLayer );
				scene.add( mesh );
				
				geometry = new THREE.BoxGeometry( 0.35, 0.35, 10.3 );
                geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, 7.8) );
				meshL1 = new THREE.Mesh( geometry, oneLayer );
				scene.add( meshL1 );

				
				geometry = new THREE.BoxGeometry( 0.45, 0.45, 10.4 );
                geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, 7.8) );
				meshL2 = new THREE.Mesh( geometry, twoLayer );
				scene.add( meshL2 );
                
				geometry = new THREE.BoxGeometry( 0.251, 0.251, 2.7 );
                geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, 1.5) );
				twoLayer = new THREE.MeshBasicMaterial( { color: 0x5d5d5d } );
				meshL3 = new THREE.Mesh( geometry, twoLayer );
				scene.add( meshL3 );
                
				mesh.position.y = 10;
				meshL1.position.y = 10;
				meshL2.position.y = 10;
				meshL3.position.y = 10;
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
                var geometry = new THREE.Geometry();
                geometry.vertices.push(new THREE.Vector3(-10, 10, 0));
                geometry.vertices.push(new THREE.Vector3(0, 20, 0));
                geometry.vertices.push(new THREE.Vector3(10, 10, 0));
                camera.position.z += cameraIntroAnimation;
                cameraIntroAnimation = cameraIntroAnimation / 1.0105;
                saberPointer.position.z = -50;
                saberPointer.position.x = saberOriginX - window.innerWidth / 2;
                saberPointer.position.y = saberOriginY * -1 + window.innerHeight / 2;
                mesh.lookAt( saberPointer.position );
                meshL1.lookAt( saberPointer.position );
                meshL2.lookAt( saberPointer.position );
                meshL3.lookAt( saberPointer.position );
                mesh.position.y = saberOriginY * -0.01 + window.innerHeight / 2 * 0.01 + 5;
                meshL1.position.y = saberOriginY * -0.01 + window.innerHeight / 2 * 0.01 + 5;
                meshL2.position.y = saberOriginY * -0.01 + window.innerHeight / 2 * 0.01 + 5;
                meshL3.position.y = saberOriginY * -0.01 + window.innerHeight / 2 * 0.01 + 5;
                mesh.position.x = saberOriginX * 0.02 - window.innerWidth / 2 * 0.02;
                meshL1.position.x = saberOriginX * 0.02 - window.innerWidth / 2 * 0.02;
                meshL2.position.x = saberOriginX * 0.02 - window.innerWidth / 2 * 0.02;
                meshL3.position.x = saberOriginX * 0.02 - window.innerWidth / 2 * 0.02;
                camera.rotation.y = saberOriginX * -0.0002 + window.innerWidth / 2 * 0.0002;
                camera.rotation.x = saberOriginY * -0.0002 - window.innerHeight / 2 * -0.0002;
				renderer.render( scene, camera );
				requestAnimationFrame( animate );
			}
            function saberOrigin(e) { 
                saberOriginX = e.clientX;
                saberOriginY = e.clientY;
            }

            var sphereMaterial = new t.MeshBasicMaterial({color: 0x333333});
            var sphereGeo = new t.SphereGeometry(2, 6, 6);
            var bulletPoint;
                
            function createBullet() {
                bulletPoint = new THREE.Mesh( sphereGeo, sphereMaterial );
                scene.add( bulletPoint );
                
            }
