#!/bin/bash

# Set the GitHub API URL for the specified directory
API_URL="https://api.github.com/repos/mrdoob/three.js/contents/manual/en"

# Set the output file name
OUTPUT_FILE="threejs_manual_combined.md"

# Function to download a file and append its content to the output file
download_and_append() {
    local file_url="$1"
    local file_name="$2"
    
    echo "Downloading: $file_name"
    echo -e "\n\n# $file_name\n" >> "$OUTPUT_FILE"
    curl -sL "$file_url" >> "$OUTPUT_FILE"
}

# Clear the output file if it exists
> "$OUTPUT_FILE"

# Fetch the list of files in the directory
files=$(curl -s "$API_URL" | jq -r '.[] | select(.type == "file") | [.download_url, .name] | @tsv')

# Download and append each file
echo "$files" | while IFS=$'\t' read -r url name; do
    download_and_append "$url" "$name"
done

echo "All files have been downloaded and combined into $OUTPUT_FILE"