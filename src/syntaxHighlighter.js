import 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/prism.min.js';

export function highlightSyntax(text) {
    const codeRegex = /```(.*?)```/gs; // Регулярное выражение для поиска блоков кода
    return text.replace(codeRegex, (match, p1) => {
        const highlightedCode = Prism.highlight(p1, Prism.languages.javascript, 'javascript');
        return `
            <div class="code-block">
                <button class="copy-button" onclick="copyToClipboard(this)">Копировать</button>
                <pre><code>${highlightedCode}</code></pre>
            </div>`;
    });
}

window.copyToClipboard = function(button) {
    const codeBlock = button.nextElementSibling.innerText;
    navigator.clipboard.writeText(codeBlock).then(() => {
        button.textContent = 'Скопировано!';
        setTimeout(() => { button.textContent = 'Копировать'; }, 2000);
    });
}
