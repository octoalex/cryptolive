import { size } from "./core.js"

export const ecb = { input: ecbInput, output: ecbOutput }

export function* ecbInput(bytes, iv) {
    for (let i = 0; i < bytes.length / size; i++) {
        yield
    }
}

export function* ecbOutput(bytes, iv) {
    yield
    for (let i = 0; i < bytes.length / size; i++) {
        yield
    }
}
