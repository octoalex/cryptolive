/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

//
// Created by Alex on 15/05/2025.
//

#include <octoalex/cryptolive/sbox/initialize_aes_sbox.h>

/* Source code provided by Wikipedia
 * https://en.wikipedia.org/w/index.php?title=Rijndael_S-box&oldid=1255585666#Example_implementation_in_C_language */

#define ROTL8(x,shift) ((uint8_t) ((x) << (shift)) | ((x) >> (8 - (shift))))

void initialize_aes_sbox(uint8_t sbox[256]) {
    uint8_t p = 1, q = 1;

    /* loop invariant: p * q == 1 in the Galois field */
    do {
        /* multiply p by 3 */
        p = p ^ (p << 1) ^ (p & 0x80 ? 0x1B : 0);

        /* divide q by 3 (equals multiplication by 0xf6) */
        q ^= q << 1;
        q ^= q << 2;
        q ^= q << 4;
        q ^= q & 0x80 ? 0x09 : 0;

        /* compute the affine transformation */
        uint8_t xformed = q ^ ROTL8(q, 1) ^ ROTL8(q, 2) ^ ROTL8(q, 3) ^ ROTL8(q, 4);

        sbox[p] = xformed ^ 0x63;
    } while (p != 1);

    /* 0 is a special case since it has no inverse */
    sbox[0] = 0x63;
}

void invert_sbox(const uint8_t sbox[256], uint8_t isbox[256]) {
    // sbox[i] = s
    // isbox[s] = i
    for (int i = 0; i < 256; ++i) {
        const uint8_t s = sbox[i];
        isbox[s] = i;
    }
}
