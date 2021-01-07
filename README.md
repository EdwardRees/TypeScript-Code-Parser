# Code Parser

Custom code parser that reads `.code` files, parsing different parts of code into a map with the key being the value from `start: value`, the value being all the lines between the start and `end: value`. 

Key function takes two parameters, `read(file, language)`. The language will be used to parse the comment out and find the starting value. Important note that if `start: value` is found elsewhere, the code may find an issue. If so, an error will be thrown.

## Functions
