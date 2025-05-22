/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { size } from "./core.js"

export const cbc = { input: cbcInput, output: cbcOutput }

function* cbcInput(bytes, iv) {
    xor(bytes, iv, 0, 0)
    yield

    for (let i = size; i < bytes.length; i += size) {
        xor(bytes, bytes, i, i - size)
        yield
    }
}

function* cbcOutput(bytes, iv) {
    const previous = new Array(size).fill(0)
    const active = iv.slice()
    for (let i = 0; i < bytes.length; i += size) {
        for (let j = 0; j < size; j++) {
            previous[j] = active[j]
            active[j] = bytes[i + j]
        }
        yield
        xor(bytes, previous, i, 0)
    }
    yield
}

function xor(a, b, aOffset, bOffset) {
    for (let i = 0; i < size; ++i) {
        a[i + aOffset] ^= b[i + bOffset]
    }
}
