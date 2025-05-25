/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { size } from "/js/lib/aes/core.js"

export class AnimatedECB {

    #animator

    constructor(animator) {
        this.#animator = animator
    }

    async input(data, key, iv, encrypt) {
        for (let i = 0; i < data.length; i += size) {
            await this.#animator.play("cbcInput", data, data, i)
            await encrypt(data, key, i / size)
        }
    }

    async output(data, key, iv, decrypt) {
        for (let i = 0; i < data.length; i += size) {
            await this.#animator.play("cbcOutput", data, i)
            await decrypt(data, key, i / size)
        }
    }
}
