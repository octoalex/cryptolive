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