/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { size } from "/js/lib/aes/core.js"

export class AnimatedCBC {

    #animator

    constructor(animator) {
        this.#animator = animator
    }

    async input(data, key, iv, encrypt) {
        const active = new Array(16).fill(0)
        for (let i = 0; i < data.length; i += size) {
            for (let j = 0; j < size; ++j) {
                active[j] = data[i + j]
            }
            xor(data, i === 0 ? iv : data, i, Math.max(i - size, 0))
            await this.#animator.play("cbcInput", data, active, i)
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
            await this.#animator.play("cbcOutput", data, active, i)
        }
    }
}

function xor(a, b, aOffset, bOffset) {
    for (let i = 0; i < size; ++i) {
        a[i + aOffset] ^= b[i + bOffset]
    }
}
