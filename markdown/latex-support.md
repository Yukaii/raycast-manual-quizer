Raycast supports rendering LaTeX equations in various contexts, including responses in AI Chat, Quick AI and also in extension detail view Markdown.

## Delimiters

We support the following equation delimiters:

-   Inline Equations: `\(...\)` and `\begin{math}...\end{math}`
-   Display Equations: `\[...\]` , `$$...$$` and `\begin{equation}...\end{equation}`

Note: We don’t support the `$` delimiters for inline equations because it too easily results in false positive matches.

## Syntax

We support all LaTeX equation syntax implemented by MathJax with the AMSmath extension enabled.