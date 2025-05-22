/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

//
// Created by Alex on 15/05/2025.
//

#ifndef GENERATE_H
#define GENERATE_H

#include <stdint.h>

void initialize_aes_sbox(uint8_t sbox[256]);

void invert_sbox(const uint8_t sbox[256], uint8_t isbox[256]);

#endif //GENERATE_H
