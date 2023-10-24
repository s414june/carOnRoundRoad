import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class{
    constructor() {
        this.loader = new GLTFLoader()
    }
    load(eachLoaded,allLoaded,...arg) {
        let allGltf = []
        for (let i = 0; i < arg.length; i++) {
            this.loader.load(arg[i],
                (gltf) => {
                    eachLoaded(gltf)
                    allGltf.push(gltf)
                    if(i+1===arg.length)
                        allLoaded(allGltf)
                },
                (progress) => {
                    console.log('progress')
                    console.log(progress)
                },
                (error) => {
                    console.log('error')
                    console.log(error)
                }
            )
        }
    }
}