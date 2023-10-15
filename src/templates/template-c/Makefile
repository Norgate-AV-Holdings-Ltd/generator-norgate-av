# Compiler
CC=gcc

# Debugging flags
DEBUG=yes

# Executable name
EXEC=main

# Source files
SRC=$(wildcard src/*.c)

# Object files
OBJ=$(SRC:.c=.o)

# Dependency files
DEP=$(OBJ:.o=.d)

# Flags
# -g for debug
# -Wall to get all the possible warnings
# -ansi -pendantic to get portable code
ifeq ($(DEBUG),yes)
    CFLAGS=-W -Wall -ansi -pedantic -g -std=c99
    LDFLAGS= -Wall -lm
else
    CFLAGS=-W -Wall -ansi -pedantic -std=c99 -O3
    LDFLAGS= -Wall -lm
endif

###############################################
# end of the configuration
###############################################

all: $(EXEC)

$(EXEC): $(OBJ)
    $(CC) -o $@ $^ $(LDFLAGS)

-include $(DEP)

%.d: %.c
	@$(CC) $(CFLAGS) $< -MM -MT $(@:.d=.o) >$@

%.o: %.c
    $(CC) $(CFLAGS) -o $@ -c $<

.PHONY: clean
clean:
	rm -f $(OBJ) $(EXEC) $(DEP)
