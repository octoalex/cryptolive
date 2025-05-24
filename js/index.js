/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {AnimatedAes} from "/js/lib/animated_aes/animatedAes.js";
import { Animator } from "/js/lib/anim/animator.js"
import {
    animateMixColumns,
    animateShiftRows,
    animateSubBytes,
    animateAddRoundKey,
    animateCbcInput
} from "./setAnimations.js"
import {
    tablesBox,
    createTable,
    setTable, Tables,
} from "./tables.js";
import { AnimatedCBC } from "/js/lib/animated_aes/animatedCbc.js"

window["run"] = run
window["test_animate"] = test_animate

const timeout = 1000;
const animator = new Animator(
    {
        name: "mixColumns",
        callback: animateMixColumns,
        timeout: timeout
    },
    {
        name: "shiftRows",
        callback: animateShiftRows,
        timeout: timeout
    },
    {
        name: "subBytes",
        callback: animateSubBytes,
        timeout: timeout
    },
    {
        name: "addRoundKey",
        callback: animateAddRoundKey,
        timeout: timeout * 2
    }, {
        name: "cbcInput",
        callback: animateCbcInput,
        timeout: timeout * 2
    }
)

const bytes = [
    0x00, 0x01, 0x02, 0x03,
    0x10, 0x11, 0x12, 0x13,
    0x20, 0x21, 0x22, 0x23,
    0x30, 0x31, 0x32, 0x33
]

async function run() {

    const dataTable = createTable()
    const borrowTable = createTable()
    const keyTable = createTable()
    setTable(dataTable, bytes, 0)
    setTable(borrowTable, bytes, 0)
    setTable(keyTable, bytes, 0)
    dataTable.classList.add("main")
    borrowTable.classList.add("borrow")
    keyTable.classList.add("key")

    tablesBox.appendChild(dataTable)
    tablesBox.appendChild(borrowTable)
    tablesBox.appendChild(keyTable)

    Tables.main = dataTable
    Tables.borrow = borrowTable
    Tables.key = keyTable

}

function test_animate() {
    const cbc = new AnimatedCBC(animator)
    const algo = new AnimatedAes(animator, cbc)
    algo.encrypt("mmwah~", "hello", bytes)
}
