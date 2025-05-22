import { initialize_sbox } from "/generator/sbox/output/sbox.js"
import { initialize_isbox } from "/generator/sbox/output/isbox.js"

export {
    size,
    sub,
    addRoundKey,
    subBytes,
    inverseSubBytes,
    shiftRows,
    inverseShiftRows,
    mixColumns,
    inverseMixColumns
}

const sbox = initialize_sbox()
const isbox = initialize_isbox()

const size = 16

function ij(i, j, offset) { return j * 4 + i + offset * size }

function xtime(x) {
    const h = x >>> 7
    return ((x << 1) & 0xFF) ^ (h * 0x1B)
}

function sub(byte) { return sbox[byte] }

function addRoundKey(state, roundKeys, offset, keyOffset) {
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
            state[ij(i, j, offset)] ^= roundKeys[ij(i, j, keyOffset)]
        }
    }
}

function subBytes(state, offset) {
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
            state[ij(i, j, offset)] = sbox[state[ij(i, j, offset)]]
        }
    }
}

function inverseSubBytes(state, offset) {
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
            state[ij(i, j, offset)] = isbox[state[ij(i, j, offset)]]
        }
    }
}

function shiftRows(state, offset) {
    const buffer = new Array(4).fill(0)
    // row 0 can be skipped
    for (let i = 1; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            buffer[j] = state[ij(i, (j + i) % 4, offset)]
        }
        for (let j = 0; j < 4; j++) {
            state[ij(i, j, offset)] = buffer[j]
        }
    }
}

function inverseShiftRows(state, offset) {
    const buffer = new Array(4).fill(0)
    // row 0 can be skipped
    for (let i = 1; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            buffer[j] = state[ij(i, (j + 4 - i) % 4, offset)]
        }
        for (let j = 0; j < 4; j++) {
            state[ij(i, j, offset)] = buffer[j]
        }
    }
}

function mixColumns(state, offset) {
    for (let j = 0; j < 4; ++j) {
        const u = state[ij(0, j, offset)]
        const t = u ^
            state[ij(1, j, offset)] ^
            state[ij(2, j, offset)] ^
            state[ij(3, j, offset)]

        state[ij(0, j, offset)] ^= t ^ xtime(state[ij(0, j, offset)] ^ state[ij(1, j, offset)])
        state[ij(1, j, offset)] ^= t ^ xtime(state[ij(1, j, offset)] ^ state[ij(2, j, offset)])
        state[ij(2, j, offset)] ^= t ^ xtime(state[ij(2, j, offset)] ^ state[ij(3, j, offset)])
        state[ij(3, j, offset)] ^= t ^ xtime(state[ij(3, j, offset)] ^ u)
    }
}

function inverseMixColumns(state, offset) {
    for (let j = 0; j < 4; j++) {
        const u = xtime(xtime(state[ij(0, j, offset)] ^ state[ij(2, j, offset)]))
        const v = xtime(xtime(state[ij(1, j, offset)] ^ state[ij(3, j, offset)]))
        state[ij(0, j, offset)] ^= u
        state[ij(1, j, offset)] ^= v
        state[ij(2, j, offset)] ^= u
        state[ij(3, j, offset)] ^= v
    }

    mixColumns(state, offset)
}
