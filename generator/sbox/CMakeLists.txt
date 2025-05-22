cmake_minimum_required(VERSION 3.31)
project(sbox C)

set(CMAKE_C_STANDARD 11)

add_executable(sbox main.c
        src/initialize_aes_sbox.c
        src/generate_javascript.c)

target_include_directories(sbox PRIVATE include)
