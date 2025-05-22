import { Aes } from "../aes/aes.js"
import { cbc } from "../aes/cbc.js"
import {
    addRoundKey,
    subBytes,
    inverseSubBytes,
    shiftRows,
    inverseShiftRows,
    mixColumns,
    inverseMixColumns
} from "../aes/core.js"

export class AnimatedAes extends Aes {

    #animator

    constructor(animator, mode = cbc) {
        super(mode);

        this.#animator = animator

        this._protectedSetSteps(
            this,
            this.#addRoundKey,
            this.#subBytes,
            this.#inverseSubBytes,
            this.#shiftRows,
            this.#inverseShiftRows,
            this.#mixColumns,
            this.#inverseMixColumns
        )
    }

    async #addRoundKey(state, roundKeys, offset, keyOffset) {
        addRoundKey(state, roundKeys, offset, keyOffset);
        await this.#animator.play("addRoundKey", state, roundKeys, offset, keyOffset)
    }

    async #subBytes(state, offset) {
        subBytes(state, offset)
        await this.#animator.play("subBytes", state, offset)
    }

    async #inverseSubBytes(state, offset) {
        inverseSubBytes(state, offset)
        await this.#animator.play("inverseSubBytes", state, offset)
    }

    async #shiftRows(state, offset) {
        shiftRows(state, offset)
        await this.#animator.play("shiftRows", state, offset)
    }

    async #inverseShiftRows(state, offset) {
        inverseShiftRows(state, offset)
        await this.#animator.play("inverseShiftRows", state, offset)
    }

    async #mixColumns(state, offset) {
        mixColumns(state, offset, this.#animator)
        await this.#animator.play("mixColumns", state, offset)
    }

    async #inverseMixColumns(state, offset) {
        inverseMixColumns(state, offset, this.#animator)
        await this.#animator.play("inverseMixColumns", state, offset)
    }

}
