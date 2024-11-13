import { saveHistory, loadHistory } from './history.js';
import { highlightSyntax } from './syntaxHighlighter.js';

const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Загрузка истории
const history = loadHistory();
history.forEach(message => appendMessageToChat(message));

sendButton.addEventListener('click', async () => {
    const userMessage = userInput.value;
    if (!userMessage) return;

    appendMessageToChat({ role: 'user', content: userMessage });

    // Отправка запроса к Claude 3.5 Sonnet
    const response = await puter.ai.chat(userMessage, { model: 'claude-3-5-sonnet' });
    const responseMessage = response.message.content[0].text;

    appendMessageToChat({ role: 'ai', content: responseMessage });

    // Сохранение истории
    saveHistory({ role: 'user', content: userMessage });
    saveHistory({ role: 'ai', content: responseMessage });

    userInput.value = ''; // Очистить поле ввода
});

function appendMessageToChat(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', message.role);

    if (message.role === 'ai') {
        messageElement.innerHTML = highlightSyntax(message.content);
    } else {
        messageElement.textContent = message.content;
    }

    chatHistory.appendChild(messageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight; // Прокрутка вниз
}
