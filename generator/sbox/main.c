/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

#include <stdio.h>

#include <octoalex/cryptolive/sbox/initialize_aes_sbox.h>
#include <octoalex/cryptolive/sbox/generate_javascript.h>

int main(void) {

    uint8_t sbox[256], isbox[256];

    initialize_aes_sbox(sbox);
    invert_sbox(sbox, isbox);

    generate_javascript("..\\output\\", sbox, "sbox");
    generate_javascript("..\\output\\", isbox, "isbox");

    return 0;
}