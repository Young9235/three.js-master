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
            width / height,   
            0.1, 
            1000 
        );
        camera.position.z = 3;
        
        this._camera = camera;
    }

    // 광원, 색상 설정
    _setupLight() {
        const color = 0xffffff;
        const intensity = 2;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        
        this._scene.add(light);
    }

    // 정육면체 형상 생성 - 3차원 모델 생성
    _setupModule() {
        // const textureLoader = new THREE.TextureLoader();
        // const imgMap = textureLoader.load(
        //     "../examples/textures/land_ocean_ice_cloud_2048.jpg",
        //     (function(texture) {   // onLoad callback
        //         texture.repeat.x = 1;
        //         texture.repeat.y = 1;

        //         texture.wrapS = THREE.ClampToEdgeWrapping;   //THREE.MirroredRepeatWrapping 거울에 반사된 모양
        //         texture.wrapT = THREE.ClampToEdgeWrapping;

        //         texture.offset.x = 0;
        //         texture.offset.y = 0;

        //         texture.rotation = THREE.MathUtils.degToRad(0);

        //         texture.center.x = 0.5;
        //         texture.center.y = 0.5;

        //         texture.magFilter = THREE.LinearFilter;
        //         texture.minFilter = THREE.NearestMipMapLinearFilter;

        //     })
        // );

        // MeshLambertMaterial, MeshLambertMaterial -> 제일 많이 쓰는 재질 MeshPhysicalMaterial(코팅,유리와 같은 효과)과 MeshStandardMaterial
         // MeshBasicMaterial 지정된 색상으로 렌더링, MeshStandardMaterial
        // const material = new THREE.MeshPhongMaterial({     
        //     // map: imgMap
        //     // visible: true,
        //     // transparent: true,
        //     // opacity: 0.5,
        //     // depthWrite:true,
        //     // depthTest:true,
        //     side:THREE.DoubleSide,
            
        //     color: 0xff0000,
        //     emissive: 0x000000,
        //     specular: 0xffff00,
        //     shininess:10,
        //     flatShading: true,
        //     wireframe: false
        // });
        const material = new THREE.MeshStandardMaterial({     
            color: 0xff0000,
            emissive: 0x000000,
            roughness:0.25,
            metalness:0.2,
            flatShading: false,
            wireframe: false,
            //side:THREE.DoubleSide,
        });

        const boxGeometry = new THREE.BoxGeometry(1,1,1);
        const box = new THREE.Mesh(boxGeometry, material);
        box.position.set(-1, 0, 0);
        this._scene.add(box);

        const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        const sphere = new THREE.Mesh(sphereGeometry, material);
        sphere.position.set(1, 0, 0);
        this._scene.add(sphere);
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
        //this.update(time);
        requestAnimationFrame(this.render.bind(this));      // setInterval과 개념이 비슷.. 브라우저 창에서 이탈했을 때 멈춰줌
    }

    // 물체 애니메이팅
    update(time) {
        time *= 0.001 // 밀리세컨을 세컨드단위로
        this._scene.rotation.x = time;
        this._scene.rotation.y = time;
    }

    _setupControls() {
        new OrbitControls(this._camera, this._divContainer);
    }
}

window.onload = function() {
    new App();
}