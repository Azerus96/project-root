import { saveHistory, loadHistory } from './history.js';
import { highlightSyntax } from './syntaxHighlighter.js';

const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const fileInput = document.getElementById('file-input');
const sendButton = document.getElementById('send-button');

// Загрузка истории
const history = loadHistory();
history.forEach(message => appendMessageToChat(message));

sendButton.addEventListener('click', async () => {
    const userMessage = userInput.value;
    const file = fileInput.files[0];

    if (!userMessage && !file) return;  // Если нет ни текста, ни файла

    appendMessageToChat({ role: 'user', content: userMessage });

    try {
        let fileUrl = null;

        // Если файл прикреплён, загружаем его на сервер
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const uploadResult = await uploadResponse.json();
            fileUrl = uploadResult.url;
        }

        // Формируем запрос к GPT-4o через Puter.js
        const response = await puter.ai.chat(userMessage, { model: 'gpt-4o', fileUrl });
        const responseMessage = response.message.content[0].text;

        appendMessageToChat({ role: 'ai', content: responseMessage });

        // Сохранение истории
        saveHistory({ role: 'user', content: userMessage });
        saveHistory({ role: 'ai', content: responseMessage });

        userInput.value = ''; // Очистить поле ввода
        fileInput.value = ''; // Очистить поле загрузки файла
    } catch (error) {
        console.error("Ошибка при отправке запроса:", error);
    }
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
