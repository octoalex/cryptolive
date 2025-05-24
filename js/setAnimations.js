/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {setTable, setTableBy, Tables} from "./tables.js";

export {
	animateMixColumns,
	animateShiftRows,
	animateSubBytes,
	animateAddRoundKey,
	animateCbcInput
}

function animateMixColumns(state, offset) {
	const name = "animate-mixColumns"
	Tables.main.classList.add(name)
	setTimeout(
		() => {
			setTable(Tables.main, state, offset)
		}, 500
	)
	setTimeout(
		() => {
			Tables.main.classList.remove(name)
		}, 1000
	)
}

function animateShiftRows(state, offset) {
	const name = "animate-shiftRows"
	Tables.main.classList.add(name)
	Tables.borrow.classList.add(name)
	setTimeout(
		() => {
			setTable(Tables.main, state, offset)
			Tables.main.classList.remove(name)
			Tables.borrow.classList.remove(name)
		}, 1000
	)
}

function animateSubBytes(state, offset) {
	const name = "animate-subBytes"
	Tables.main.classList.add(name)
	setTimeout(
		() => {
			setTableBy(Tables.main, (i, j, element) => {
				const sub = document.createElement("sub")
				const text = element.textContent
				sub.textContent = `(${text})`
				sub.classList.add("sbox-mini")
				element.textContent = "S"
				element.appendChild(sub)
			})
		}, 250
	)
	setTimeout(
		() => {
			setTable(Tables.main, state, offset)
			// subBytes is always and only the step preceding shiftRows, so the borrow table's data is set here
			setTable(Tables.borrow, state, offset)
		}, 750
	)
	setTimeout(() => {
		Tables.main.classList.remove(name)
	}, 1000)
}

function animateAddRoundKey(state, roundKeys, offset, keyOffset) {
	const name = "animate-addRoundKey"
	const set = "animate-setRoundKey"
	// first, set the new round key
	Tables.key.classList.add(set)
	setTimeout(
		() => {
			setTable(Tables.key, roundKeys, keyOffset)
		}, 500
	)
	setTimeout(() => {
		Tables.key.classList.remove(set)
		Tables.key.classList.add(name)
		Tables.main.classList.add(name)
	}, 1000)
	setTimeout(() => {
		setTable(Tables.main, state, offset)
	}, 1500)
	setTimeout(() => {
		Tables.key.classList.remove(name)
		Tables.main.classList.remove(name)
	}, 2000)
}

function animateCbcInput(data, active, offset) {
	const name = "animate-cbcInput"
	Tables.main.classList.add(name)
	const decoded = new TextDecoder().decode(new Uint8Array(active))
	// 0500: set new text
	// 1500: set data
	setTimeout(() => {
		setTableBy(Tables.main, (i, j, element) => {
			const index = j * 4 + i
			element.textContent = active[index] <= 16 ? active[index].toString(16).padStart(2, "0") : decoded[index]
		})
	}, 500)
	setTimeout(() => {
		setTable(Tables.main, data, offset)
	}, 1500)
	setTimeout(() => {
		Tables.main.classList.remove(name)
	}, 2000)
}
