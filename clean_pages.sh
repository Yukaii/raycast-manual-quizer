#!/bin/bash

# Create clean directory
mkdir -p clean

# Process each HTML file
for file in pages/*.html; do
  filename=$(basename "$file")
  echo "Processing: $filename"
  
  # Extract article content and save to clean directory
  cat "$file" | htmlq 'article' > "clean/$filename"
done

echo "Cleaning complete! Files saved to clean/"
