export function saveHistory(message) {
    const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
    history.push(message);
    localStorage.setItem('chatHistory', JSON.stringify(history));
}

export function loadHistory() {
    return JSON.parse(localStorage.getItem('chatHistory')) || [];
}
