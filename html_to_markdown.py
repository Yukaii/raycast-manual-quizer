#!/usr/bin/env python3
import os
import re
from html.parser import HTMLParser
from pathlib import Path

class HTMLToMarkdown(HTMLParser):
    def __init__(self):
        super().__init__()
        self.markdown = []
        self.current_tag = []
        self.list_level = 0
        self.in_code = False
        self.in_strong = False
        self.in_em = False
        self.in_link = False
        self.link_url = ""
        self.skip_content = False
        
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        
        # Skip certain elements
        if tag in ['script', 'style', 'template', 'svg', 'img']:
            self.skip_content = True
            return
            
        self.current_tag.append(tag)
        
        if tag == 'h1':
            self.markdown.append('\n# ')
        elif tag == 'h2':
            self.markdown.append('\n## ')
        elif tag == 'h3':
            self.markdown.append('\n### ')
        elif tag == 'h4':
            self.markdown.append('\n#### ')
        elif tag == 'p':
            self.markdown.append('\n')
        elif tag == 'br':
            self.markdown.append('\n')
        elif tag == 'code':
            self.in_code = True
            self.markdown.append('`')
        elif tag == 'strong' or tag == 'b':
            self.in_strong = True
            self.markdown.append('**')
        elif tag == 'em' or tag == 'i':
            self.in_em = True
            self.markdown.append('*')
        elif tag == 'a':
            self.in_link = True
            self.link_url = attrs_dict.get('href', '')
            self.markdown.append('[')
        elif tag == 'ul':
            self.markdown.append('\n')
        elif tag == 'ol':
            self.markdown.append('\n')
        elif tag == 'li':
            self.markdown.append('* ')
        elif tag == 'blockquote':
            self.markdown.append('\n> ')
        elif tag == 'hr':
            self.markdown.append('\n---\n')
            
    def handle_endtag(self, tag):
        if tag in ['script', 'style', 'template', 'svg', 'img']:
            self.skip_content = False
            return
            
        if self.current_tag and self.current_tag[-1] == tag:
            self.current_tag.pop()
        
        if tag in ['h1', 'h2', 'h3', 'h4', 'p']:
            self.markdown.append('\n')
        elif tag == 'code':
            self.in_code = False
            self.markdown.append('`')
        elif tag == 'strong' or tag == 'b':
            self.in_strong = False
            self.markdown.append('**')
        elif tag == 'em' or tag == 'i':
            self.in_em = False
            self.markdown.append('*')
        elif tag == 'a':
            self.in_link = False
            if self.link_url:
                self.markdown.append(f']({self.link_url})')
            else:
                self.markdown.append(']')
        elif tag == 'li':
            self.markdown.append('\n')
        elif tag in ['ul', 'ol']:
            self.markdown.append('\n')
            
    def handle_data(self, data):
        if self.skip_content:
            return
        # Clean up whitespace but preserve structure
        data = data.strip()
        if data:
            self.markdown.append(data)
    
    def get_markdown(self):
        result = ''.join(self.markdown)
        # Clean up multiple newlines
        result = re.sub(r'\n{3,}', '\n\n', result)
        # Clean up spaces before newlines
        result = re.sub(r' +\n', '\n', result)
        return result.strip()

def convert_html_to_markdown(html_file, output_file):
    with open(html_file, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    parser = HTMLToMarkdown()
    parser.feed(html_content)
    markdown = parser.get_markdown()
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(markdown)

# Main conversion
input_dir = Path('clean_content')
output_dir = Path('markdown')
output_dir.mkdir(exist_ok=True)

for html_file in input_dir.glob('*.html'):
    md_file = output_dir / html_file.with_suffix('.md').name
    print(f"Converting: {html_file.name} -> {md_file.name}")
    convert_html_to_markdown(html_file, md_file)

print(f"\nConversion complete! Markdown files saved to {output_dir}/")
