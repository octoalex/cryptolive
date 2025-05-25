/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { size } from "./core.js"

class ECB {
    async input(data, key, iv, encrypt) {
        for (let i = 0; i < data.length; i += size) {
            await encrypt(data, key, i / size)
        }
    }

    async output(data, key, iv, decrypt) {
        for (let i = 0; i < data.length; i += size) {
            await decrypt(data, key, i / size)
        }
    }
}

export const ecb = new ECB()
