# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

cmake_minimum_required(VERSION 3.31)
project(sbox C)

set(CMAKE_C_STANDARD 11)

add_executable(sbox main.c
        src/initialize_aes_sbox.c
        src/generate_javascript.c)

target_include_directories(sbox PRIVATE include)
