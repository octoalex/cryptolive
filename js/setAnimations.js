/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {setTable, setTableBy, Tables, tablesBox} from "./tables.js";
import {size} from "/js/lib/aes/core.js";

export {
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
}

const stepName = document.getElementById("step-name")

function animateAddRoundKey(state, roundKeys, offset, keyOffset) {
	const name = "animate-addRoundKey"
	const set = "animate-updateRoundKey"
	stepName.textContent = "Update Round Key"
	// first, set the new round key
	Tables.key.classList.add(set)
	setTimeout(
		() => {
			setTable(Tables.key, roundKeys, keyOffset * size)
		}, 500
	)
	setTimeout(() => {
		Tables.key.classList.remove(set)
		Tables.key.classList.add(name)
		Tables.main.classList.add(name)
		stepName.textContent = "Add Round Key"
	}, 1000)
	setTimeout(() => {
		setTable(Tables.main, state, offset * size)
	}, 1500)
	setTimeout(() => {
		Tables.key.classList.remove(name)
		Tables.main.classList.remove(name)
	}, 2000)

}

function animateSubBytes(state, offset) {
	const name = "animate-subBytes"
	stepName.textContent = "Sub Bytes"
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
		}, 500
	)
	setTimeout(
		() => {
			setTable(Tables.main, state, offset * size)
			// subBytes is always and only the step preceding shiftRows, so the borrow table's data is set here
			setTable(Tables.borrow, state, offset * size)
		}, 1500
	)
	setTimeout(() => {
		Tables.main.classList.remove(name)
	}, 2000)
}

function animateInverseSubBytes(state, offset) {
	const name = "animate-subBytes"
	stepName.textContent = "Inverse Sub Bytes"
	Tables.main.classList.add(name)
	setTimeout(
		() => {
			setTableBy(Tables.main, (i, j, element) => {
				const sub = document.createElement("sub")
				const text = element.textContent
				sub.textContent = `(${text})`
				sub.classList.add("sbox-mini")
				element.textContent = "I"
				element.appendChild(sub)
			})
		}, 500
	)
	setTimeout(
		() => {
			setTable(Tables.main, state, offset * size)
		}, 1500
	)
	setTimeout(() => {
		Tables.main.classList.remove(name)
	}, 2000)
}

function animateShiftRows(state, offset) {
	const name = "animate-shiftRows"
	stepName.textContent = "Shift Rows"
	Tables.main.classList.add(name)
	Tables.borrow.classList.add(name)
	setTimeout(
		() => {
			setTable(Tables.main, state, offset * size)
			Tables.main.classList.remove(name)
			Tables.borrow.classList.remove(name)
		}, 1000
	)
}

function animateInverseShiftRows(state, offset) {
	const name = "animate-inverseShiftRows"
	stepName.textContent = "Inverse Shift Rows"
	Tables.main.classList.add(name)
	Tables.borrow.classList.add(name)
	setTable(Tables.main, state, offset * size)
	setTable(Tables.borrow, state, offset * size)
	setTimeout(
		() => {
			Tables.main.classList.remove(name)
			Tables.borrow.classList.remove(name)
		}, 1000
	)
}

function animateMixColumns(state, offset) {
	const name = "animate-mixColumns"
	stepName.textContent = "Mix Columns"
	Tables.main.classList.add(name)
	setTimeout(
		() => {
			setTable(Tables.main, state, offset * size)
		}, 500
	)
	setTimeout(
		() => {
			Tables.main.classList.remove(name)
		}, 1000
	)
}

function animateInverseMixColumns(state, offset) {
	const name = "animate-mixColumns"
	stepName.textContent = "Inverse Mix Columns"
	Tables.main.classList.add(name)
	setTimeout(
		() => {
			setTable(Tables.main, state, offset * size)
		}, 500
	)
	setTimeout(
		() => {
			Tables.main.classList.remove(name)
		}, 1000
	)
}

function animateCbcInput(data, active, offset) {
	const name = "animate-cbcInput"
	stepName.textContent = "CBC Encrypt Next Block"
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

function animateCbcOutput(data, offset) {
	const name = "animate-cbcOutput"
	stepName.textContent = "CBC Decrypt Next Block"
	Tables.main.classList.add(name)
	setTimeout(() => {
		setTable(Tables.main, data, offset)
	}, 500)
	setTimeout(() => {
		Tables.main.classList.remove(name)
	}, 1000)

}

function animateAppear() {
	const name = "animate-appear"
	const unappeared = "unappeared"
	const labels = document.getElementById("labels")
	const results = document.getElementById("results")

	if (!tablesBox.classList.contains(unappeared)) return

	tablesBox.classList.add(name)
	labels.classList.add(name)
	results.classList.add(name)
	tablesBox.classList.remove(unappeared)
	labels.classList.remove(unappeared)
	results.classList.remove(unappeared)
	setTimeout(() => {
		tablesBox.classList.remove(name)
		labels.classList.remove(name)
		results.classList.remove(name)
	}, 1000)
}
