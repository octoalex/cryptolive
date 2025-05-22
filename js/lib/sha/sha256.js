/* Taken from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
 * on 22/05/2025
 * Modified as Necessary by octoalex
 */

export async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hash = await window.crypto.subtle.digest("SHA-256", data);
    return hash;
}