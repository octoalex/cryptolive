/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {AnimatedAes} from "/js/lib/animated_aes/animatedAes.js";
import { Animator } from "/js/lib/anim/animator.js"
import {
    animateAddRoundKey,
    animateSubBytes,
    animateInverseSubBytes,
    animateShiftRows,
    animateInverseShiftRows,
    animateMixColumns,
    animateInverseMixColumns,
    animateCbcInput,
    animateCbcOutput,
    animateAppear
} from "./setAnimations.js"
import {
    tablesBox,
    createTable,
    Tables,
    resetTable,
} from "./tables.js";
import { AnimatedCBC } from "/js/lib/animated_aes/animatedCbc.js"
import {sha256} from "./lib/sha/sha256.js";
import {size} from "./lib/aes/core.js";
import {AnimatedECB} from "./lib/animated_aes/animatedEcb.js";

window["init"] = init
window["calculate"] = calculate
window["generateRandomIv"] = generateRandomIv

const timeout = 1000;
const animator = new Animator(
    {
        name: "addRoundKey",
        callback: animateAddRoundKey,
        timeout: timeout * 2
    },
    {
        name: "subBytes",
        callback: animateSubBytes,
        timeout: timeout * 2
    },
    {
        name: "inverseSubBytes",
        callback: animateInverseSubBytes,
        timeout: timeout * 2
    },
    {
        name: "shiftRows",
        callback: animateShiftRows,
        timeout: timeout
    },
    {
        name: "inverseShiftRows",
        callback: animateInverseShiftRows,
        timeout: timeout
    },
    {
        name: "mixColumns",
        callback: animateMixColumns,
        timeout: timeout
    },
    {
        name: "inverseMixColumns",
        callback: animateInverseMixColumns,
        timeout: timeout
    },
    {
        name: "cbcInput",
        callback: animateCbcInput,
        timeout: timeout * 2
    },
    {
        name: "cbcOutput",
        callback: animateCbcOutput,
        timeout: timeout
    },
    {
        name: "appear",
        callback: animateAppear,
        timeout: timeout
    }
)

const process = document.getElementById("process")
const message = document.getElementById("message")
const key = document.getElementById("key")
const mode = document.getElementById("mode")
const iv = document.getElementById("iv")

const keyLabel = document.getElementById("key-name")
const output = document.getElementById("output")

const encoder = new TextEncoder()

async function calculate() {
    const p = process.value;
    const m = message.value;
    const k = key.value;
    const d = mode.value;
    const v = doIv(iv.value);

    sha256(k).then(x => {
        const text = btoa(x.map(y => String.fromCharCode(y)).join(""))
        keyLabel.textContent = text.slice(0, 22) + "\n" + text.slice(22, 44)
    });

    const aes = new AnimatedAes(animator,
        d === "cbc" ? new AnimatedCBC(animator) :
            d === "ecb" ? new AnimatedECB(animator) :
                undefined
        )

    output.scrollIntoView()
    await animator.play("appear")

    if (p === "encrypt") {
        output.textContent = await aes.encrypt(m, k, v)
    } else if (p === "decrypt") {
        await animator.play("cbcOutput", [...atob(m)].map(x => x.charCodeAt(0)).slice(0, size), 0)
        output.textContent = await aes.decrypt(m, k, v)
    }
}

function doIv (iv) {
    // check

    const data = encoder.encode(atob(iv))
    if (data.length !== size) {
        //throw
        throw new Error("IV is not 16 bytes long! (actual size: " + data.length + " bytes)")
    }
    return Array.from(data)
}

function generateRandomIv() {
    const v = new Array(16)
        .fill(0)
        .map(() => Math.floor(Math.random() * 128))
    iv.value = btoa(v.map(x => String.fromCharCode(x)).join(""))
}

const bytes = [
    0x00, 0x01, 0x02, 0x03,
    0x10, 0x11, 0x12, 0x13,
    0x20, 0x21, 0x22, 0x23,
    0x30, 0x31, 0x32, 0x33
]

function init() {

    const dataTable = createTable()
    const borrowTable = createTable()
    const keyTable = createTable()
    // setTable(dataTable, bytes, 0)
    // setTable(borrowTable, bytes, 0)
    // setTable(keyTable, bytes, 0)
    dataTable.classList.add("main")
    borrowTable.classList.add("borrow")
    keyTable.classList.add("key")

    tablesBox.appendChild(dataTable)
    tablesBox.appendChild(borrowTable)
    tablesBox.appendChild(keyTable)

    Tables.main = dataTable
    Tables.borrow = borrowTable
    Tables.key = keyTable

    resetTable(dataTable)
    resetTable(borrowTable)
    resetTable(keyTable)

}
