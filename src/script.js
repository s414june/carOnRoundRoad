import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
// import GLTFMultiLoader from './GLTFMultiLoader'
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
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 0
camera.position.y = 3
camera.position.z = 10
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Models
 */
const gltfLoader = new GLTFLoader()

// const gLTFMultiLoader = new GLTFMultiLoader()

// gLTFMultiLoader.load(
//     setGltf, tickGltf,
//     './car/car.glb', './car/wheel_fl.glb', './car/wheel_fr.glb', './car/wheel_bl.glb', './car/wheel_br.glb')

async function gLTFMultiLoad() {
    const result = await multiAsyncLoader(gltfLoader,
        './car/car.glb', './car/wheel_fl.glb', './car/wheel_fr.glb', './car/wheel_bl.glb', './car/wheel_br.glb'
    )
    return result;
}
async function multiAsyncLoader(loader, ...urls) {
    let loadAsyncArr = []
    urls.forEach(url => {
        loadAsyncArr.push(loader.loadAsync(url))
    })
    return Promise.all(loadAsyncArr)
}

gLTFMultiLoad().then(gltfs => {
    gltfs.forEach(gltf => {
        setGltf(gltf)
    })
    tickGltf(gltfs)
})

const road = new THREE.RingGeometry(4, 5, 100)
const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x646464, side: THREE.DoubleSide })
const roadMesh = new THREE.Mesh(road, roadMaterial)

roadMesh.rotation.x = (Math.PI / 2)
scene.add(roadMesh)


function addLines() {
    let lineRotation = 0
    while (lineRotation < Math.PI * 2) {
        addLine()
    }
    function addLine() {
        const line = new THREE.RingGeometry(4.45, 4.55, 100, 1, 0, Math.PI * 2 / 33)
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
        const lineMesh = new THREE.Mesh(line, lineMaterial)

        lineMesh.rotation.x = (Math.PI / 2)
        lineMesh.position.y = 0.001
        lineMesh.rotation.z = lineRotation
        scene.add(lineMesh)
        lineRotation += Math.PI * 2 / 33 * 1.5
    }
}

addLines()

// gltfLoader.load('./car/car.glb',
//     (gltf) => {
//         console.log(gltf)
//         // setGltf(gltf)
//         // tickGltf()
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

const clock = new THREE.Clock()

function tick(gltf) {

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    gltf.scene.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

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
    gltf.scene.position.x += 4.5
    // gltf.scene.position.x -= Math.sin(0.5)*4.5
    // gltf.scene.position.z -= Math.cos(0.5)*4.5
    // gltf.scene.position.z -= 4.5*Math.PI/4
    gltf.scene.scale.set(0.4, 0.4, 0.4)
    scene.add(gltf.scene)
    // renderer.render(scene, camera)
}


function tickGltf(allGltf) {

    const clock = new THREE.Clock()

    const tick = () => {

        const elapsedTime = clock.getElapsedTime()
        console.log(elapsedTime)
        // Update objects
        allGltf.forEach(gltf => {
            gltf.scene.rotation.y = .5 * elapsedTime - Math.PI/2
            gltf.scene.position.x = 0 - Math.sin(.5 * elapsedTime) * 4.5
            gltf.scene.position.z = 0 - Math.cos(.5 * elapsedTime) * 4.5
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