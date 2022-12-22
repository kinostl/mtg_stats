import { GPU } from 'gpu.js'
const gpu = new GPU()
const maxTextureSize = gpu.Kernel?.features?.maxTextureSize || 256
console.log(maxTextureSize)
console.log(maxTextureSize * maxTextureSize)
