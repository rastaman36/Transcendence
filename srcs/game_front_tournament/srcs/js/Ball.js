import * as THREE from 'three';

export default class Ball{

    velocity = new THREE.Vector3(2, 0, 1);
    constructor(scene, boundaries, paddles){
        this.speed = 10.5
        this.scene = scene;
        this.boundaries = boundaries;
        this.paddles = paddles;
        this.radius = 0.5;
        this.geometry = new THREE.SphereGeometry(this.radius);
        this.material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        
        // console.log(this.velocity);
        this.velocity.normalize().multiplyScalar(this.speed);
        this.raycaster = new THREE.Raycaster();
        this.raycaster.near = 0;
		this.raycaster.far = this.boundaries.y * 2.5;

        this.scene.add(this.mesh);
        // console.log(this.velocity);

    }

    update(dtime, ball) {
        // console.log(this.speed);

        const dir = ball.clone().normalize()
        // this.raycaster.set(this.mesh.position, dir);


        const sp = ball.clone().multiplyScalar( dtime );
        const fpos = this.mesh.position.clone().add(sp);

        // this.checkBoundaryCollision(fpos);
        // this.checkPaddleCollision(sp, fpos);

        this.mesh.position.copy(fpos);
    }

    // checkBoundaryCollision(fpos){
    //     const dx = this.boundaries.x - this.radius -  Math.abs(this.mesh.position.x);
    //     const dz = this.boundaries.y - this.radius - Math.abs(this.mesh.position.z); 

    //     if (dx <= 0){
    //         fpos.x = (this.boundaries.x - this.radius + dx) * Math.sign(this.mesh.position.x);
    //         this.velocity.x *= -1;
    //         // this.dispatchEvent({ type: 'collide' });
    //     }
    //     if (dz < 0) {
    //         const z = this.mesh.position.z;
    //         // const message = z > 0 ? 'pc' : 'player';
    //         // this.dispatchEvent({ type: 'ongoal', message: message });?

    //         fpos.set(0, 0, 0);
    //         this.resetVelocity();
    //     }
    // }

    // checkPaddleCollision(sp , fpos){
    //     const paddle = this.paddles.find((paddle) => {
    //         return Math.sign(paddle.mesh.position.z) === Math.sign(this.velocity.z);
    //     });
    //     const [intersection] = this.raycaster.intersectObjects(paddle.mesh.children);

    //     if (intersection && intersection.distance < sp.length()) {
            
    //         fpos.copy(intersection.point);

    //         // Reflect velocity based on paddle's normal
    //         const normal = intersection.face.normal.clone().setY(0).normalize();
    //         this.velocity.reflect(normal);

    //         // Adjust the ball's new position based on the remaining distance
    //         const remainingDistance = sp.length() - intersection.distance;
    //         const newDirection = this.velocity.clone().normalize().multiplyScalar(remainingDistance);
    //         fpos.add(newDirection);

    //         this.speed *= 1.07;
    //         this.velocity.normalize().multiplyScalar(this.speed);

    //         // this.dispatchEvent({ type: 'collide' });
    //     }
    // }
    // resetVelocity() {
    //     this.speed = 10
	// 	this.velocity.z *= -1
	// 	this.velocity.normalize().multiplyScalar(this.speed)
    //    // this.velocity.set(0.2 * Math.sign(this.velocity.x), 0.2, 0);
    //     //     this.velocity.z *= -1;

    //     // this.speed = this.velocity.length();
    // }
}