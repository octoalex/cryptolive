/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

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
