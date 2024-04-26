# Resources
https://www.zend.com/sites/default/files/pdfs/whitepaper-zend-php-extensions.pdf

# What makes up an Extension

### config.m4 / config.w32
configure options and build instructions.
config.m4 -> Linux
config.w32 -> Windows

### php_extension.h
header files and glue for the extension it self.

### extension.c
extension definition and function implementation

### tests/*.phpt
Tests written in PHP


# Build Process:

```bash
./configure
make
make test
```

if you want debugging syms add this to config.m4 `PHP_ADD_COMPILE_FLAG(-g)`
