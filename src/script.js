import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import GLTFMultiLoader from './GLTFMultiLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
// scene.background = new THREE.Color(0xffffff)


// Objects
// const geometry = new THREE.TorusGeometry(.7, .2, 16, 100);

// Materials

const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color(0xff0000)

//Spherical Panorama 球形全景圖
// const textureLoader = new THREE.TextureLoader().load('./road/road.jpg', (texture) => {
//     const mesh = new THREE.Mesh(new THREE.SphereGeometry(1.6, 60, 40), new THREE.MeshBasicMaterial({ map: texture }))
//     //貼在圓形內側
//     mesh.material.side = THREE.BackSide
//     scene.add(mesh)
//     renderer.render(scene, camera)
// });

// Mesh
// const sphere = new THREE.Mesh(geometry, material)
// scene.add(sphere)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 2)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Models
 */
// const gltfLoader = new GLTFLoader()

const gLTFMultiLoader = new GLTFMultiLoader()

gLTFMultiLoader.load(
    setGltf, tickGltf,
    './car/car.glb', './car/wheel_fl.glb', './car/wheel_fr.glb', './car/wheel_bl.glb', './car/wheel_br.glb')

// gltfLoader.load('/car/car.glb',
//     (gltf) => {
//         setGltf(gltf)
//     },
//     (progress) => {
//         console.log('progress')
//         console.log(progress)
//     },
//     (error) => {
//         console.log('error')
//         console.log(error)
//     }
// )

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true //反鋸齒
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//gamma色彩空間
//https://cloud.tencent.com/developer/article/1543647?fbclid=IwAR2Yniao8dyBsRip4XQxyord3hyBSHGkGliVfnONF5mHuZJGCN_5xa2bJHs
renderer.gammaOutput = true
renderer.gammaFactor = 2.2

/**
 * Animate
 */

// const clock = new THREE.Clock()

// const tick = () => {

//     const elapsedTime = clock.getElapsedTime()

//     // Update objects
//     sphere.rotation.y = .5 * elapsedTime

//     // Update Orbital Controls
//     // controls.update()

//     // Render
//     renderer.render(scene, camera)

//     // Call tick again on the next frame
//     window.requestAnimationFrame(tick)
// }

// tick()

function setGltf(gltf) {
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            //模型陰影
            child.castShadow = true
            //模型自發光
            child.material.emissive = child.material.color
            child.material.emissiveMap = child.material.map
        }
    })
    gltf.scene.scale.set(0.4, 0.4, 0.4)

    scene.add(gltf.scene)
    // renderer.render(scene, camera)
}


function tickGltf(allGltf) {

    const clock = new THREE.Clock()

    const tick = () => {

        const elapsedTime = clock.getElapsedTime()

        // Update objects
        allGltf.forEach(gltf => {
            gltf.scene.rotation.y = .5 * elapsedTime
        });

        // Update Orbital Controls
        // controls.update()

        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }

    tick()
}

// renderer.render(scene, camera)