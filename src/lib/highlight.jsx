import React from "react";

export function HighlightedCode({ code }) {
  if (!code) return null;

  // Split code into lines so line numbers/breaks are preserved cleanly
  const lines = code.split("\n");

  return (
    <span className="font-mono text-[13px] leading-relaxed block select-text">
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} className="block min-h-[1.5em]">
          {highlightLine(line)}
        </span>
      ))}
    </span>
  );
}

function highlightLine(line) {
  if (!line) return "\u00A0";

  // Regex tokens:
  // 1. Comments: //...
  // 2. Strings: "..." or '...' or `...`
  // 3. JSX Tags: </?[A-Z][A-Za-z0-9_]*|/?>
  // 4. Keywords: import, from, export, function, return, const, let, var, default, async, await
  // 5. Props: \b[a-zA-Z_][a-zA-Z0-9_-]*(?==)
  // 6. Numbers/Booleans: true, false, null, \d+
  // 7. Component names in imports/identifiers: { BendySlider } or Demo()
  const tokenRegex = /(\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|<\/?[A-Za-z0-9_]+|\/?>|\b(?:import|from|export|function|return|const|let|var|default|async|await)\b|\b(?:true|false|null|undefined|\d+)\b|\b[a-zA-Z_][a-zA-Z0-9_-]*(?=\=)|[{}()[\];,]|[\w-]+|\s+|[^\s\w]+)/g;

  const elements = [];
  let match;
  let key = 0;

  const keywords = new Set([
    "import", "from", "export", "function", "return", "const", "let", "var", "default", "async", "await", "type", "interface"
  ]);

  while ((match = tokenRegex.exec(line)) !== null) {
    const token = match[0];

    if (token.startsWith("//")) {
      // Comment
      elements.push(
        <span key={key++} className="text-neutral-400 dark:text-neutral-500 italic">
          {token}
        </span>
      );
    } else if (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'")) ||
      (token.startsWith("`") && token.endsWith("`"))
    ) {
      // String literal: olive / emerald green
      elements.push(
        <span key={key++} className="text-[#4E8E5E] dark:text-[#4ade80]">
          {token}
        </span>
      );
    } else if (token.startsWith("<") || token.startsWith("</")) {
      // Tag opening: < or </ and tag name
      const isClosing = token.startsWith("</");
      const tagName = isClosing ? token.slice(2) : token.slice(1);
      const isComponent = /^[A-Z]/.test(tagName);

      elements.push(
        <span key={key++}>
          <span className="text-neutral-400 dark:text-neutral-500">{isClosing ? "</" : "<"}</span>
          <span className={isComponent ? "text-[#C28A43] dark:text-[#fbbf24] font-medium" : "text-purple-600 dark:text-purple-400"}>
            {tagName}
          </span>
        </span>
      );
    } else if (token === ">" || token === "/>") {
      // Tag closing
      elements.push(
        <span key={key++} className="text-neutral-400 dark:text-neutral-500">
          {token}
        </span>
      );
    } else if (keywords.has(token)) {
      // Keyword: violet / purple
      elements.push(
        <span key={key++} className="text-[#8B5CF6] dark:text-[#a78bfa] font-medium">
          {token}
        </span>
      );
    } else if (/^[A-Z][A-Za-z0-9_]*$/.test(token)) {
      // Capitalized component identifier e.g. BendySlider, Button, Card
      elements.push(
        <span key={key++} className="text-[#C28A43] dark:text-[#fbbf24] font-medium">
          {token}
        </span>
      );
    } else if (/^(?:true|false|null|undefined|\d+)$/.test(token)) {
      // Number or boolean: amber / orange
      elements.push(
        <span key={key++} className="text-[#D97706] dark:text-[#f59e0b]">
          {token}
        </span>
      );
    } else if (line.indexOf(token + "=") !== -1 && /^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(token)) {
      // Prop / Attribute: soft violet
      elements.push(
        <span key={key++} className="text-[#8B5CF6] dark:text-[#c4b5fd]">
          {token}
        </span>
      );
    } else if (/^[{}()[\];,=]$/.test(token)) {
      // Punctuation
      elements.push(
        <span key={key++} className="text-neutral-400 dark:text-neutral-500">
          {token}
        </span>
      );
    } else if (/^[a-z][A-Za-z0-9_]*$/.test(token) && line.indexOf(token + "(") !== -1) {
      // Function call e.g. Demo()
      elements.push(
        <span key={key++} className="text-[#2563EB] dark:text-[#60a5fa]">
          {token}
        </span>
      );
    } else {
      // Standard text / whitespace
      elements.push(<span key={key++}>{token}</span>);
    }
  }

  return elements.length > 0 ? elements : line;
}
