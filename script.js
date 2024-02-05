import * as THREE from "three";

let renderer, scene, camera, circle, skelet, particle;

window.onload = function () {
	init();
	animate();
};

function init() {
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio(window.devicePixelRatio || 1);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.autoClear = false;
	renderer.setClearColor(0x000000, 0.0);
	document.getElementById("canvas").appendChild(renderer.domElement);

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		1,
		1000
	);
	camera.position.z = 400;
	scene.add(camera);

	circle = new THREE.Object3D();
	skelet = new THREE.Object3D();
	particle = new THREE.Object3D();

	scene.add(circle, skelet, particle);

	const geometry = new THREE.TetrahedronGeometry(2, 0);
	const geom = new THREE.IcosahedronGeometry(7, 1);
	const geom2 = new THREE.IcosahedronGeometry(15, 1);

	const commonMaterial = {
		flatShading: true,
		uniforms: {
			time: { value: 1.0 },
			resolution: { value: new THREE.Vector2() },
		},
	};

	const material = new THREE.MeshPhongMaterial({ ...commonMaterial });
	const material2 = new THREE.MeshPhongMaterial({ ...commonMaterial });
	const material3 = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		wireframe: true,
		side: THREE.DoubleSide,
	});

	for (let i = 0; i < 1000; i++) {
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position
			.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
			.normalize();
		mesh.position.multiplyScalar(90 + Math.random() * 700);
		mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
		particle.add(mesh);
	}

	const planet = new THREE.Mesh(geom, material2);
	planet.scale.set(16, 16, 16);
	circle.add(planet);

	const planet2 = new THREE.Mesh(geom2, material3);
	planet2.scale.set(10, 10, 10);
	skelet.add(planet2);

	const ambientLight = new THREE.AmbientLight(0xf7f8fa);
	scene.add(ambientLight);

	const lights = [
		new THREE.DirectionalLight(0xffffff, 1),
		new THREE.DirectionalLight(0x7b61ff, 1),
		new THREE.DirectionalLight(0xf7f8fa, 1),
	];

	lights[0].position.set(1, 0, 0);
	lights[1].position.set(0.75, 1, 0.5);
	lights[2].position.set(-0.75, -1, 0.5);

	lights.forEach((light) => scene.add(light));

	window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);

	particle.rotation.x += 0.0;
	particle.rotation.y -= 0.004;
	circle.rotation.x -= 0.002;
	circle.rotation.y -= 0.003;
	skelet.rotation.x -= 0.001;
	skelet.rotation.y += 0.002;

	renderer.clear();
	renderer.render(scene, camera);
}
