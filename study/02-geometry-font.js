import * as THREE from '../build/three.module.js';
import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js';
import { FontLoader } from '../examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from '../examples/jsm/geometries/TextGeometry.js';

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
        camera.position.z = 15;
        
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
        const fontLoader = new FontLoader();
        async function loadFont(that) { // 비동기 함수
            const url = "..	/examples/fonts/droid/droid_serif_bold.typeface.json";
            const font = await new Promise((resolve, reject) => {
                fontLoader.load(url, resolve, undefined, reject);
            });

            const geometry = new TextGeometry( 'Hello three.js!', {
                font: font,
                size: 8,
                height: 1.5,
                curveSegments: 1,
                bevelEnabled: true,
                bevelThickness: 0.7,
                bevelSize: .7,
                bevelOffset: 0,
                bevelSegments: 2
            });
            
            const fillMeterial = new THREE.MeshPhongMaterial({ color:0x515151 });
            const cube = new THREE.Mesh( geometry, fillMeterial );
    
            // 라인타입의 오브젝트 생성 WireframeGeometry 모든 외각선
            const lineMeterial = new THREE.LineBasicMaterial({ color:0xffff00 });
            const line = new THREE.LineSegments(
                new THREE.WireframeGeometry(geometry), lineMeterial
            );
            
            // 하나의 오브젝트로 묶기 위한 그룸으로 셋팅
            const group = new THREE.Group();
            group.add(cube);
            group.add(line);
    
            that._scene.add(group);
            that._cube = group;
        }

        loadFont(this);
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
        this._cube.rotation.x = time;
        this._cube.rotation.y = time;
    }

    _setupControls() {
        new OrbitControls(this._camera, this._divContainer);
    }
}

window.onload = function() {
    new App();
}