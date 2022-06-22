import * as THREE from '../build/three.module.js';
import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js';

class App {
    constructor() {
        const divContainer = document.querySelector('#webgl-container');
        this._divContainer = divContainer;      // 다른 메소드에서 참조하기 위함 -> _밑줄의 의미 : private

        const renderer = new THREE.WebGLRenderer({ antialias : true });     //WebGLRenderer로 랜더링 할 수 있음 -> 옵션 설정 가능 antialias
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);    // 캔버스 타입의 dom객체
        this._renderer = renderer;    // 다른 메소드에서 참조하기 위함

        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamara();
        this._setupLight();
        this._setupModule();
        this._setupControls();      // 마우스로 카메라 방향 조정 OrbitControls

        window.onresize = this.resize.bind(this);  
        this.resize();      // 창크기가 변경되었을 때 resize, 창 크기에 맞게 속성값 재정의
        
        requestAnimationFrame(this.render.bind(this));  // 랜더 메소드 호출 this는 App 클래스의 객체를 정의??
    }

    // 카메라 설정
    _setupCamara() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const camera = new THREE.PerspectiveCamera( 
            75, 
            window.innerWidth / window.innerHeight,   
            0.1, 
            100 
        );
        //camera.position.z = 4;
        camera.position.set(7,7,0); // 카메라의 위치 설정
        camera.lookAt(0,0,0);       // 카메라가 원점을 바라보게 하도록 설정
        
        this._camera = camera;
    }

    // 광원, 색상 설정
    _setupLight() {
        const light = new THREE.AmbientLight(0xffffff, 5);

        this._scene.add(light);
        this._light = light;
    }

    _setupModule() {
        // 그라운드(바닥)에 대한 코드
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: '#2c3e50',
            roughness: 0.5,
            metalness: 0.5,
            side: THREE.DoubleSide
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = THREE.MathUtils.degToRad(-90);
        this._scene.add(ground);
        
        // 빅스피어에 대한 코드
        const bigSphereGeometry = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI);
        const bigSphereMaterial = new THREE.MeshStandardMaterial({
            color: '#ffffff',
            roughness: 0.1,
            metalness: 0.2
        });
        const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
        bigSphere.rotation.x = THREE.MathUtils.degToRad(-90);
        this._scene.add(bigSphere);

        // 토러스, 토러스피봇에 대한 코드
        const torusGeometry = new THREE.TorusGeometry(0.4, 0.1, 32, 32);
        const torusMaterial = new THREE.MeshStandardMaterial({
            color: '#9b59b6',
            roughness: 0.5,
            metalness: 0.9
        });

        for (let i = 0; i < 9; i++) {
            const torusPivot = new THREE.Object3D();
            const torus = new THREE.Mesh(torusGeometry, torusMaterial);
            torusPivot.rotation.y = THREE.MathUtils.degToRad(45 * i);
            torus.position.set(3, 0.5, 0);
            torusPivot.add(torus);
            this._scene.add(torusPivot);
        }

        // 스몰스피어, 스몰스피어피봇에 대한 코드
        // 토러스, 토러스피봇에 대한 코드
        const smallSphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const smallSphereMaterial = new THREE.MeshStandardMaterial({
            color: '#e74c3c',
            roughness: 0.2,
            metalness: 0.5
        });
        const smallSpherePivot = new THREE.Object3D();
        const smallSphere = new THREE.Mesh(smallSphereGeometry, smallSphereMaterial);
        smallSpherePivot.add(smallSphere);
        smallSpherePivot.name = "smallSpherePivot";
        smallSphere.position.set(3, 0.5, 0);
        this._scene.add(smallSpherePivot);
    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    render(time) {  // 랜더링이 시작했을 때.. time 장면의 애니메이션에 이용
        this._renderer.render(this._scene, this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));      // setInterval과 개념이 비슷.. 브라우저 창에서 이탈했을 때 멈춰줌
    }

    // 물체 애니메이팅
    update(time) {
        time *= 0.001 // 밀리세컨을 세컨드단위로
        
        const smallSpherePivot = this._scene.getObjectByName("smallSpherePivot");
        if(smallSpherePivot) {
            smallSpherePivot.rotation.y = THREE.MathUtils.degToRad(time*50);
        }
    }

    _setupControls() {
        new OrbitControls(this._camera, this._divContainer);
    }
}

window.onload = function() {
    new App();
}