//
// Created by Alex on 15/05/2025.
//

#include <octoalex/cryptolive/sbox/generate_javascript.h>

#include <stdio.h>
#include <time.h>
#include <string.h>
#include <stdlib.h>
#include <stdbool.h>

#ifdef _WIN32

#include <windows.h>

#define mkdir(dir, mode) _mkdir(dir)
#define SEP '\\'

#else

#include <unistd.h>
#define SEP  '/'

#endif

static void print_current_date(FILE *file);
static const char sep[] = { SEP, 0 };

void generate_javascript(const char *folder, uint8_t sbox[256], const char *name) {
    bool useSep = folder[strlen(folder) - 1] != SEP;
    size_t len = strlen(folder) + strlen(name) + 3 /* extension */ + 1 + useSep ? 1 /* separator */ : 0;
    char *location = calloc(len, sizeof(char));
    strcpy(location, folder);
    if (useSep) strcat(location, sep);
    strcat(location, name);
    strcat(location, ".js");

    mkdir(folder, 0755);
    FILE *file = fopen(location, "w+");

    fprintf(file, "/* Generated on ");
    print_current_date(file);
    fprintf(file, " */\n");

    // javascript generation

    fprintf(file, "\n");

    fprintf(file, "export function initialize_%s() {\n", name);
    fprintf(file, "\treturn [ 0x%02X", sbox[0]);

    for (int i = 1; i < 256; ++i) {
        fprintf(file, ", 0x%02X", sbox[i]);
    }

    fprintf(file, " ];\n");
    fprintf(file, "}\n");
    fprintf(file, "\n");
    fclose(file);
}



static void print_current_date(FILE *file) {
    const time_t t = time(NULL);
    const struct tm tm = *localtime(&t);
    fprintf(file, "%d-%02d-%02d %02d:%02d:%02d",
        tm.tm_year + 1900,
        tm.tm_mon + 1,
        tm.tm_mday,
        tm.tm_hour,
        tm.tm_min,
        tm.tm_sec
    );
}
