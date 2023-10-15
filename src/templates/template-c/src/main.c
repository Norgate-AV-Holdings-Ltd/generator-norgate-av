#include <stdlib.h>
#include <stdio.h>

int main(int argc, char **argv)
{
    printf("Hello, world!\n");

    for (int count = 0; count < argc; count++)
    {
        printf("Argument %d: %s\n", count, argv[count]);
    }

    return 0;
}
