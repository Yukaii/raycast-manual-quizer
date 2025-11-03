#!/bin/bash

# Create clean directory
mkdir -p clean_content

# Process each HTML file
for file in pages/*.html; do
  filename=$(basename "$file")
  echo "Processing: $filename"
  
  # Extract article content, remove scripts, templates, and other noise
  cat "$file" | \
    htmlq 'article' | \
    htmlq --remove-nodes 'script' | \
    htmlq --remove-nodes 'template' | \
    htmlq --remove-nodes 'style' | \
    htmlq --remove-nodes '.notion-page__icon img' \
    > "clean_content/$filename"
done

echo ""
echo "Content cleaning complete!"
echo "Files saved to clean_content/"
echo ""
echo "Summary:"
du -sh clean_content/
ls clean_content/ | wc -l | xargs echo "Total files:"
