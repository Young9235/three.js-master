import * as THREE from '../build/three.module.js';

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
            width / height,   
            0.1, 
            1000 
        );
        camera.position.z = 20;
        
        this._camera = camera;
    }

    // 광원, 색상 설정
    _setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        
        this._scene.add(light);
    }

    
    _setupModule() {
        const solarSystem = new THREE.Object3D();
        this._scene.add(solarSystem);
        
        const radius = 1;
        const widthSegments = 12;
        const heightSegments = 12;

        // 구모양의 지오메트리 생성 -> Geometry는 모양 생성, MeshPhongMaterial는 재질 생성
        const SphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

        // 태양의 재질을 생성
        const sunMeterial = new THREE.MeshPhongMaterial({
            emissive: 0xffff00, // 광원색(빛색)
            flatShading: true   // 평평한 음영?
        });
        
        const sunMesh = new THREE.Mesh(SphereGeometry, sunMeterial);
        sunMesh.scale.set(3,3,3);   // 크기의 3배
        solarSystem.add(sunMesh);   // 태양 오브젝트 생성

        const earthOrbit = new THREE.Object3D();
        earthOrbit.position.x = 10;      // x축으로 태양을 기준으로 10만큼 떨어진 위치
        solarSystem.add(earthOrbit);

        const earthMeterial = new THREE.MeshPhongMaterial({
            color: 0x2233ff,
            emissive: 0x112244, 
            flatShading: true 
        });

        const earthMesh = new THREE.Mesh(SphereGeometry, earthMeterial);
        earthOrbit.add(earthMesh);      // 지구 오브젝트 생성

        const moonOrbit = new THREE.Object3D();
        moonOrbit.position.x = 2;   // 태양을 기준으로 12만큼 떨어진 위치(지구의 자식으로 들어가 있기 때문)
        earthOrbit.add(moonOrbit);  // earthOrbit의 자식으로 생성

        const moonMeterial = new THREE.MeshPhongMaterial({
            color: 0x888888,
            emissive: 0x222222, 
            flatShading: true  
        });

        const moonMesh = new THREE.Mesh(SphereGeometry, moonMeterial);   
        moonMesh.scale.set(0.5, 0.5, 0.5);
        moonOrbit.add(moonMesh);      
        
        this._solarSystem = solarSystem;
        this._earthOrbit = earthOrbit;
        this._moonOrbit = moonOrbit;
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
        //this._cube.rotation.x = time;
        this._solarSystem.rotation.y = time / 2;        // 태양의 회전에 영향을 받음 태양의 자식은 지구 -> 지구와 달이 태양을 중심으로 회전
        this._earthOrbit.rotation.y = time * 2;
        this._moonOrbit.rotation.y = time * 5;
    }
}

window.onload = function() {
    new App();
}