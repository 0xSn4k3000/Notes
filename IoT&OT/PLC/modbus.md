# Structured text (ST)

## How to calc addresses
sensor_12 AT %QX16.6 : BOOL := 0;

Understanding the Address Format

The address format %QX16.6 can be broken down as follows:

%QX indicates a digital output (coil).
16 is the byte address.
6 is the bit within that byte.

So to find the address for example in an 8-bit word size program.
16 * 8 + 6



# Understand the modbus payload.

AA BB CCCC DDDD

AA = PLC address (in hex).

BB = function code (in hex).

CCCC = register address (in hex) format 000C.

DDDD = data to send (here either FF00 or 0000).
