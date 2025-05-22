export class Animator {

    #animations = { }

    constructor(...animations) {
        for (const { name, callback, timeout } of animations) {
            this.#animations[name] = {
                callback: callback,
                timeout: timeout
            }
        }
    }

    async play(name, ...args) {
        const { callback, timeout } = this.#animations[name] ?? { callback: null, timeout: 0 }

        if (callback) callback(...args)

        if (!timeout) return
        await wait(timeout)
    }

}

async function wait(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
