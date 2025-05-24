/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { sha256 } from "/js/lib/sha/sha256.js";
import {
    size,
    sub,
    addRoundKey,
    subBytes,
    inverseSubBytes,
    shiftRows,
    inverseShiftRows,
    mixColumns,
    inverseMixColumns,
} from "./core.js"
import { cbc } from "./cbc.js"

export class Aes {

    #encoder = new TextEncoder()
    #decoder = new TextDecoder()

    #mode

    #addRoundKey
    #subBytes
    #inverseSubBytes
    #shiftRows
    #inverseShiftRows
    #mixColumns
    #inverseMixColumns

    constructor(
        mode = cbc
    ) {
        this.#mode = mode

        this._protectedSetSteps(
            this,
            addRoundKey,
            subBytes,
            inverseSubBytes,
            shiftRows,
            inverseShiftRows,
            mixColumns,
            inverseMixColumns,
        )
    }

    async encrypt(message, key, iv) {
        const hashedKey = await sha256(key)
        const roundKeys = keyExpansion(hashedKey)
        const bytes = [...this.#encoder.encode(message)]
        pad(bytes)

        await this.#mode.input(bytes, roundKeys, iv, (data, key, offset) => this.#encryptBlock(data, key, offset))

        return btoa(bytes.map(x => String.fromCharCode(x)).join(""))
    }

    async decrypt(message, key, iv) {
        const hashedKey = await sha256(key)
        const roundKeys = keyExpansion(hashedKey)
        const bytes = [...atob(message)].map(x => x.charCodeAt(0))

        if (bytes.length % size !== 0) {
            throw new class extends Error {
                constructor() {
                    super(`Size of data to decrypt must be a multiple of ${size}! Size given: ${bytes.length} (${size - (bytes.length % size)} bytes too short!)`);
                    this.name = "AesDecryptionInputSizeError"
                }
            }
        }

        await this.#mode.output(bytes, roundKeys, iv, (data, key, offset) => this.#decryptBlock(data, key, offset))

        unpad(bytes)

        return this.#decoder.decode(new Uint8Array(bytes))
    }

    async #encryptBlock(state, roundKeys, offset) {
        // the algorithm operates in DWORDs, while this works in bytes,
        // so some conversion trickery is necessary
        await this.#addRoundKey(state, roundKeys, offset, 0)

        const r = roundKeys.length / size - 1

        for (let i = 1; i < r; ++i) {
            await this.#subBytes(state, offset)
            await this.#shiftRows(state, offset)
            await this.#mixColumns(state, offset)
            await this.#addRoundKey(state, roundKeys, offset, i)
        }

        await this.#subBytes(state, offset)
        await this.#shiftRows(state, offset)
        await this.#addRoundKey(state, roundKeys, offset, r)
    }

    async #decryptBlock(state, roundKeys, offset) {
        const r = roundKeys.length / size - 1
        await this.#addRoundKey(state, roundKeys, offset, r)
        await this.#inverseShiftRows(state, offset)
        await this.#inverseSubBytes(state, offset)

        for (let i = r - 1; i > 0; --i) {
            await this.#addRoundKey(state, roundKeys, offset, i)
            await this.#inverseMixColumns(state, offset)
            await this.#inverseShiftRows(state, offset)
            await this.#inverseSubBytes(state, offset)
        }

        await this.#addRoundKey(state, roundKeys, offset, 0)
    }

    _protectedSetSteps(
        caller,
        addRoundKey,
        subBytes,
        inverseSubBytes,
        shiftRows,
        inverseShiftRows,
        mixColumns,
        inverseMixColumns
    ) {
        if (caller !== this) {
            throw new Error("Invalid Access to Protected Member!")
        }
        this.#addRoundKey = addRoundKey
        this.#subBytes = subBytes
        this.#inverseSubBytes = inverseSubBytes
        this.#shiftRows = shiftRows
        this.#inverseShiftRows = inverseShiftRows
        this.#mixColumns = mixColumns
        this.#inverseMixColumns = inverseMixColumns
    }
}

class PaddingError extends Error {

    constructor(type, ...arg) {
        const message =
            type === "PADDING_SIZE" ? `Padding of invalid size! (${arg[0]})` :
            type === "PADDING_FORMAT" ? "Padding of invalid format!" :
                "Unknown Padding Error"

        super(message);
    }
}

function pad(data) {
    const len = size - (data.length % size)
    const padding = new Array(len).fill(len)
    data.push(...padding)
}

function unpad(data) {
    const len = data.pop()
    if (len < 1 || len > size) throw new PaddingError("PADDING_SIZE", len)
    for (let i = 1; i < len; ++i) {
        if (data[data.length + i - len] !== len) throw new PaddingError("PADDING_FORMAT")
        data.pop()
    }
}

function keyExpansion(key) {
    const n = key.length / 4 /* 32 bits = 4 bytes */
    const r = n === 4 ? 11 :
        n === 6 ? 13 :
        n === 8 ? 15 :
            console.error("Invalid key length: ", n)

    const rc = [ 0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1B, 0x36 ]

    // 4 R * 4 (DWORD to bytes)
    const w = new Array(r * size).fill(0)

    for (let I = 0; I < 4 * r; ++I) {
        const i = I * 4
        const iN = i - n * 4
        if (I < n) {
            w[i] = key[i]
            w[i + 1] = key[i + 1]
            w[i + 2] = key[i + 2]
            w[i + 3] = key[i + 3]
        } else if ((I % n) === 0) {
            const rcin = rc[I / n]
            // rotate word
            w[i]     = w[iN]     ^ sub(w[i - 3]) ^ rcin
            w[i + 1] = w[iN + 1] ^ sub(w[i - 2])
            w[i + 2] = w[iN + 2] ^ sub(w[i - 1])
            w[i + 3] = w[iN + 3] ^ sub(w[i - 4])
        } else if (n > 6 && (I % n) === 4) {
            w[i]     = w[iN]     ^ sub(w[i - 4])
            w[i + 1] = w[iN + 1] ^ sub(w[i - 3])
            w[i + 2] = w[iN + 2] ^ sub(w[i - 2])
            w[i + 3] = w[iN + 3] ^ sub(w[i - 1])
        } else {
            w[i]     = w[iN]     ^ w[i - 4]
            w[i + 1] = w[iN + 1] ^ w[i - 3]
            w[i + 2] = w[iN + 2] ^ w[i - 2]
            w[i + 3] = w[iN + 3] ^ w[i - 1]
        }
    }
    return w
}
