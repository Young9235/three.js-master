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

    // 정육면체 형상 생성 - 3차원 모델 생성
    // _setupModule() {
    //     //const geometry = new THREE.BoxGeometry( 1,1,1, 2,2,2);      // 박스만들기 - 가로, 세로, 깊이
    //     //const geometry = new THREE.CircleGeometry(0.9, 20, Math.PI/2, Math.PI);     // 원만들기 - 4개의 인자 = 서클 크기, 원의 형태, 시작각도, 연장각도
    //     //const geometry = new THREE.ConeGeometry(0.8, 1.6, 14, 9, true, 0, 3.14); // 콘모양 - 7개의 인자 = 넓이, 높이 ...
    //     const geometry = new THREE.CylinderGeometry(0.7, 0.7, 1.6, 16, 4, true, 0);  // Math.PI 수평방향으로 반
    //     //const geometry = new THREE.SphereGeometry(0.9, 32, 12, 0, Math.PI, 0, Math.PI/2);
    //     //const geometry = new THREE.RingGeometry();

    //     const fillMeterial = new THREE.MeshPhongMaterial({ color:0x515151 });
    //     const cube = new THREE.Mesh( geometry, fillMeterial );

    //     // 라인타입의 오브젝트 생성 WireframeGeometry 모든 외각선
    //     const lineMeterial = new THREE.LineBasicMaterial({ color:0xffff00 });
    //     const line = new THREE.LineSegments(
    //         new THREE.WireframeGeometry(geometry), lineMeterial
    //     );
        
    //     // 하나의 오브젝트로 묶기 위한 그룸으로 셋팅
    //     const group = new THREE.Group();
    //     group.add(cube);
    //     group.add(line);

    //     this._scene.add(group);
    //     this._cube = group;
    // }

    _setupModule() {
        
        /* 하트 모양 지오메트리 */
        const shape = new THREE.Shape();
        const x = -2.5, y = -5;
        // shape.moveTo( 1, 1 );
        // shape.lineTo( 1, -1 );
        // shape.lineTo( -1, -1 );
        // shape.lineTo( -1, 1 );
        // shape.closePath();

        shape.moveTo( x + 2.5, y + 2.5 );
        shape.bezierCurveTo( x + 2.5, y + 2.5, x + 2, y, x, y );
        shape.bezierCurveTo( x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5 );
        shape.bezierCurveTo( x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5 );
        shape.bezierCurveTo( x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5 );
        shape.bezierCurveTo( x + 8, y + 3.5, x + 8, y, x + 5, y );
        shape.bezierCurveTo( x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5 );

        const settings = {
            steps: 2,
            depth: 2,
            bevelEnabled: true,
            bevelThickness: 1.6,
            bevelSize: 1.5,
            //bevelOffset: 0,
            bevelSegments: 6
        }

        const geometry = new THREE.ExtrudeGeometry(shape, settings);
        
        //const geometry = new THREE.ShapeGeometry(shape); 
        //const points = shape.getPoints();
        //geometry.setFromPoints(points);
        //const meterial = new THREE.LineBasicMaterial({ color:0xffff00 });

        /* 커브 지오메트리 */
        // class CustomSinCurve extends THREE.Curve {
        //     constructor( scale ) {
        //         super();
        //         this.scale = scale;
        //     }
        //     getPoint( t, optionalTarget = new THREE.Vector3() ) {
        
        //         const tx = t * 3 - 1.5;
        //         const ty = Math.sin( 2 * Math.PI * t );
        //         const tz = 0;
        
        //         return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
        
        //     }
        // }

        // const path = new CustomSinCurve(4);
        // const geometry = new THREE.TubeGeometry(path, 40, 0.8, 4, true); 

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

        this._scene.add(group);
        this._cube = group;
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
        //this._cube.rotation.x = 4;
        //this._cube.rotation.y = 2;
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