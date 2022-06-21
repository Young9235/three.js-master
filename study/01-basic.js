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
        camera.position.z = 4;
        
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

    // 정육면체 형상 생성 - 3차원 모델 생성
    _setupModule() {
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );      // 박스만들기 - 가로, 세로, 깊이
        const material = new THREE.MeshBasicMaterial({ color: 0x44a88 });      // 파랑색 계열의 박스
        //const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
        const points = [];
        // points.push( new THREE.Vector3( -10, 0, 0 ) );
        // points.push( new THREE.Vector3( 0, 10, 0 ) );
        // points.push( new THREE.Vector3( 10, 0, 0 ) );
        // points.push( new THREE.Vector3( 0, 0, 10 ) );
        
        //const geometry = new THREE.BufferGeometry().setFromPoints( points );


        const line = new THREE.Mesh( geometry, material );

        this._scene.add(line);
        this._cube = line;
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
        this._cube.rotation.x = time;
        this._cube.rotation.y = time;
    }
}

window.onload = function() {
    new App();
}