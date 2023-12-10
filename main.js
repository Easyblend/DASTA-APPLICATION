import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"

const canvas = document.querySelector(".canvas")
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
camera.position.z = 5


//Visual inputs values for the ranges
const XY_range = document.getElementById("xy")
const Y_range = document.getElementById("y")
const range0 = document.getElementById("0")


//Getting the input values for the check boxes
const data_rec = document.getElementById("data recording")
const zone_res = document.getElementById("zone restriction")
const position_stab = document.getElementById("position stabilization")


//Getting Buttons from DOM
const startBtn = document.getElementById("start")
const stopBtn = document.getElementById("stop")


// const xAxis = document.querySelector(".x-axis")
// const yAxis = document.querySelector(".x-axis")

const btnLeft = document.querySelector(".left")
const btnRight = document.querySelector(".right")

const loader = new GLTFLoader();
let droneModel


const renderer = new THREE.WebGLRenderer({ canvas });
renderer.shadowMap.enabled = true
renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);


const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

// const hdri = new RGBELoader()
// hdri.load("scen hdri.hdr", (texture) => {
//   scene.environment = texture
//   texture.mapping = THREE.EquirectangularReflectionMapping
//   // scene.background = texture
// })
loader.load('drone.glb', function (gltf) {

  droneModel = gltf.scene

  droneModel.position.y = 0.07
  droneModel.castShadow = true

  scene.add(droneModel);

}, undefined, function (error) {

  console.error(error);

});
// scene.add(cube);



const control = new OrbitControls(camera, canvas)


//Create a material for the line 
// const linematerial = new THREE.LineBasicMaterial({ color: 0x0000ff });

// define the vertices of the line

// const plight = new THREE.PointLight(0xfffff, 10, 8)

// plight.position.set(0, 1, 0)

// scene.add(plight)
// plight.castShadow = true
//create the line object
// const line = new THREE.Line(geometry, material)


// const donut = new THREE.RingGeometry(0.5, 2, 3)

// const donutmaterial = new THREE.MeshBasicMaterial({ color: "#0066ff" })

// const donutObject = new THREE.Mesh(donut, donutmaterial)

// scene.add(donutObject)

// line.rotateX(23)
// scene.add(line, linematerial)


// line.position.set(1, 0, 0)


// const ambient = new THREE.AmbientLight(0x404040)

// scene.add(ambient)

const directionLight = new THREE.DirectionalLight(0xffffff, 3)
directionLight.position.z = 5
directionLight.castShadow = true
scene.add(directionLight)



// btnLeft.addEventListener("click", function () {
//   if (droneModel) {
//     droneModel.position.x -= 0.067; // Adjust the value for the left movement
//     xAxis.innerHTML = `X: ${droneModel.position.x}`
//   }
// });

// btnRight.addEventListener("click", function () {
//   if (droneModel) {
//     droneModel.position.x += 0.028; // Adjust the value for the right movement
//     xAxis.innerHTML = `X: ${droneModel.position.x}`
//   }
// });

//creating a plane floor
const floor = new THREE.BoxGeometry(8, 8, 0.4);
const floorMaterial = new THREE.MeshBasicMaterial({ color: "#e6ebff", side: THREE.DoubleSide });
const plane = new THREE.Mesh(floor, floorMaterial);
plane.receiveShadow = true
plane.rotation.x = Math.PI / 2;
plane.position.y = -0.22
scene.add(plane);

control.enableDamping = true

let isMoving;
startBtn.addEventListener("click", () => {
  isMoving = true; // Set the flag when the button is clicked
});
stopBtn.addEventListener("click", () => {
  isMoving = false; // Set the flag when the button is clicked
});

let hoverDirection = 0.01; // 1 for up, -1 for down
const hoverAmplitude = 0.01; // Adjust the amplitude for intensity
const hoverSpeed = 0.03; // Adjust the speed for frequency

const ctx = document.getElementById('myChart');

var X_axisData = {
  label: "X axis",
  data: [],
  lineTension: true,
  fill: false,
  borderColor: 'red'
};

var Y_axisData = {
  label: "Y axis",
  data: [],
  lineTension: true,
  fill: false,
  borderColor: 'blue'
};
var Z_axisData = {
  label: "Z axis",
  data: [],
  lineTension: true,
  fill: false,
  borderColor: 'yellow'
};


var speedData = {
  labels: [],
  datasets: [X_axisData, Y_axisData, Z_axisData]
};

var chartOptions = {
  legend: {
    display: true,
    position: 'top',
    labels: {
      boxWidth: 100,
      fontColor: 'black'
    }
  }
};



var lineChart = new Chart(ctx, {
  type: 'line',
  data: speedData,
  options: chartOptions
});

let j = 0.01

function animate() {

  requestAnimationFrame(animate);
  if (droneModel) {




    if (isMoving && droneModel.position.y < 2) {
      // Example: Simulate up-down hovering effect along the Y-axis using sine function


      droneModel.position.y += 0.02

      Y_axisData.data.push(droneModel.position.y)
      j = j + 0.01
      speedData.labels.push(`${j.toFixed(2)}s`)

      lineChart.update();
      Y_range.value += 1;

      // Trigger the input event
      const inputEvent = new Event('input', { bubbles: true });
      Y_range.dispatchEvent(inputEvent);
    }
    else {
      if (droneModel.position.y > 0.07) {
        droneModel.position.y -= 0.03
        Y_axisData.data.push(droneModel.position.y)
        j = j + 0.01
        speedData.labels.push(`${j.toFixed(2)}s`)
        Y_range.value -= 2;
        // Trigger the input event
        const inputEvent = new Event('input', { bubbles: true });
        Y_range.dispatchEvent(inputEvent);
        lineChart.update();


      }
      // Change hover direction when reaching the amplitude limits
      // droneModel.position.y +=
      //   hoverDirection * hoverAmplitude * Math.sin(performance.now() * hoverSpeed / 10000);
      // if (droneModel.position.y > hoverAmplitude || droneModel.position.y < -hoverAmplitude) {
      //   hoverDirection *= -1;
      // }

    }

  }

  control.update()
  // if (droneModel) {
  //   // Example: Rotate around the Y-axis


  //   // Example: Simulate up-down hovering effect along the Y-axis using sine function
  //   droneModel.position.y += hoverDirection * hoverAmplitude * Math.sin(performance.now() * hoverSpeed / 10000);

  //   // Change hover direction when reaching the amplitude limits
  //   if (droneModel.position.y > hoverAmplitude || droneModel.position.y < -hoverAmplitude) {
  //     hoverDirection *= -1;
  //   }
  // }
  // Render the scene
  renderer.render(scene, camera);

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  // cube.translateX(+0.002)
  // line.rotateX(+0.02)



  renderer.render(scene, camera);
  // if (droneModel) {
  //   droneModel.position.y += 0.01 * droneModel.position.y
  // }
}

animate();



///chart here
