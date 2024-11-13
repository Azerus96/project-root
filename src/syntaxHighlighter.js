import 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/prism.min.js';

export function highlightSyntax(text) {
    const codeRegex = /```(.*?)```/gs; // Регулярное выражение для поиска блоков кода
    return text.replace(codeRegex, (match, p1) => {
        const highlightedCode = Prism.highlight(p1, Prism.languages.javascript, 'javascript');
        return `<pre class="code-block"><code>${highlightedCode}</code></pre>`;
    });
}
