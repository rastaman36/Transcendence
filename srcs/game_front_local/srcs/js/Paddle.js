import * as THREE from 'three';

const GEOMETRY = new THREE.CapsuleGeometry(0.5, 5, 20, 20)
const HELPER_GEOMETRY = new THREE.CapsuleGeometry(0.5 + 0.5, 5, 20, 8)
HELPER_GEOMETRY.rotateZ(Math.PI * 0.5)
HELPER_GEOMETRY.rotateX(Math.PI / 8)
GEOMETRY.rotateZ(Math.PI * 0.5)
const MATERIAL = new THREE.MeshNormalMaterial()

export default class Paddle {
	constructor(scene, boundaries, position) {
		this.scene = scene
		this.boundaries = boundaries

		this.geometry = GEOMETRY
		this.material = MATERIAL
		this.mesh = new THREE.Mesh(GEOMETRY, MATERIAL)
		this.mesh.castShadow = true
		this.mesh.receiveShadow = true

		this.collisionHelper = new THREE.Mesh(
			HELPER_GEOMETRY,
			new THREE.MeshNormalMaterial({
                // wireframe: true,
				transparent: true,
				opacity: 0.5,
				visible: false,
			})
		)
		this.mesh.add(this.collisionHelper)

		this.mesh.position.copy(position)
		this.scene.add(this.mesh)
	}

	setX(x) {
		if (x > this.boundaries.x - 3) {
			x = this.boundaries.x - 3
		} else if (x < -this.boundaries.x + 3) {
			x = -this.boundaries.x + 3
		}

		this.mesh.position.x = x
	}
}
