#!/bin/bash

# Input file (the combined Three.js manual)
INPUT_FILE="threejs_manual_combined.md"

# Output file (cleaned version)
OUTPUT_FILE="threejs_manual_cleaned.md"

# Temporary file for intermediate processing
TMP_FILE="temp_file.md"

# Function to clean up the content
cleanup_content() {
    # Remove HTML tags
    sed 's/<[^>]*>//g' |
    # Remove empty lines
    sed '/^\s*$/d' |
    # Remove lines starting with '---'
    sed '/^---/d' |
    # Remove lines containing only whitespace and punctuation
    sed '/^[[:space:][:punct:]]*$/d' |
    # Convert multiple spaces to a single space
    sed 's/[[:space:]]\+/ /g' |
    # Trim leading and trailing whitespace
    sed 's/^[[:space:]]*//; s/[[:space:]]*$//'
}

# Process the file
cat "$INPUT_FILE" | cleanup_content > "$TMP_FILE"

# Use awk to format the cleaned content
awk '
BEGIN { print "# Three.js Manual\n" }
/^# / { print "\n" $0 "\n" }
!/^# / { printf "%s ", $0 }
END { print "\n" }
' "$TMP_FILE" > "$OUTPUT_FILE"

# Remove the temporary file
rm "$TMP_FILE"

echo "HTML tags removed and content cleaned. Output saved to $OUTPUT_FILE"

# Print file size reduction
original_size=$(wc -c < "$INPUT_FILE")
cleaned_size=$(wc -c < "$OUTPUT_FILE")
reduction=$((original_size - cleaned_size))
percent_reduction=$((reduction * 100 / original_size))

echo "Original file size: $original_size bytes"
echo "Cleaned file size: $cleaned_size bytes"
echo "Size reduction: $reduction bytes ($percent_reduction%)"