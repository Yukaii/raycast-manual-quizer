#!/bin/bash

# Create markdown directory
mkdir -p markdown

# Process each HTML file
for file in clean_content/*.html; do
  filename=$(basename "$file" .html)
  echo "Converting: $filename.html -> $filename.md"
  
  # Extract text content with better formatting
  cat "$file" | htmlq --text 'article' | \
    # Clean up extra whitespace
    sed 's/^[[:space:]]*//g' | \
    sed 's/[[:space:]]*$//g' | \
    # Remove empty lines
    sed '/^$/d' | \
    # Add spacing after headings (basic heuristic)
    sed 's/^\([A-Z][^a-z]*\)$/\n# \1\n/' \
    > "markdown/${filename}.md"
done

echo ""
echo "Basic conversion complete!"
echo ""
echo "Note: For better markdown conversion, consider installing:"
echo "  brew install pandoc"
echo "  Then run: pandoc -f html -t markdown input.html -o output.md"
