# Binary Plist to xml

```python3
import plistlib

def convert_binary_plist_to_xml(input_file, output_file):
    with open(input_file, 'rb') as fp:
        plist_data = plistlib.load(fp)
    
    with open(output_file, 'wb') as fp:
        plistlib.dump(plist_data, fp, fmt=plistlib.FMT_XML)

# Example usage
convert_binary_plist_to_xml('challenge.plist', 'challenge.xml')

```