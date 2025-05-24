/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { size } from "./core.js"

class CBC {
    async input(data, key, iv, encrypt) {
        for (let i = 0; i < data.length; i += size) {
            xor(data, i === 0 ? iv : data, i, Math.max(i - size, 0))
            await encrypt(data, key, i / size)
        }
    }

    async output(data, key, iv, decrypt) {
        const previous = new Array(size).fill(0)
        const active = iv.slice()
        for (let i = 0; i < data.length; i += size) {
            for (let j = 0; j < size; j++) {
                previous[j] = active[j]
                active[j] = data[i + j]
            }
            await decrypt(data, key, i / size)
            xor(data, previous, i, 0)
        }
    }
}

function xor(a, b, aOffset, bOffset) {
    for (let i = 0; i < size; ++i) {
        a[i + aOffset] ^= b[i + bOffset]
    }
}

export const cbc = new CBC()
