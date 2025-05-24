/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export {
    tablesBox,
    createTable,
    setTable,
    setTableWithString,
    setTableBy,
    Tables
}

const tablesBox = document.getElementById("table-box");

function createTable() {
    const table = document.createElement("table")
    const caption = document.createElement("caption")
    const tbody = document.createElement("tbody")

    for (let i = 0; i < 4; ++i) {
        const tr = document.createElement("tr")
        tr.classList.add(`row-${i}`)
        for (let j = 0; j < 4; j++) {
            const td = document.createElement("td")
            td.classList.add(`col-${j}`)
            const span = document.createElement("span")
            td.appendChild(span)
            tr.appendChild(td)
        }
        tbody.appendChild(tr)
    }

    table.appendChild(caption)
    table.appendChild(tbody)

    return table
}

function setTable(table, data, offset) {
    const tbody = table.querySelector("tbody")
    // console.log("Table Set", table, data, offset)
    for (let i = 0; i < 4; ++i) {
        const tr = tbody.children[i]
        for (let j = 0; j < 4; ++j) {
            const td = tr.children[j]
            const span = td.children[0]
            span.textContent = data[j * 4 + i + offset].toString(16).padStart(2, "0")
        }
    }
}

function setTableWithString(table, string) {
    const tbody = table.querySelector("tbody")
    for (let i = 0; i < 4; ++i) {
        const tr = tbody.children[i]
        for (let j = 0; j < 4; ++j) {
            const td = tr.children[j]
            const span = td.children[0]
            span.textContent = string
        }
    }
}

function setTableBy(table, provider) {
    const tbody = table.querySelector("tbody")
    for (let i = 0; i < 4; ++i) {
        const tr = tbody.children[i]
        for (let j = 0; j < 4; ++j) {
            const td = tr.children[j]
            const span = td.children[0]
            provider(i, j, span)
        }
    }
}

class Tables {
    static main
    static borrow
    static key
}
