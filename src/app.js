import { saveHistory, loadHistory } from './history.js';
import { highlightSyntax } from './syntaxHighlighter.js';

const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const fileInput = document.getElementById('file-input');
const sendButton = document.getElementById('send-button');
const errorMessage = document.getElementById('error-message');

// Загрузка истории
const history = loadHistory();
history.forEach(message => appendMessageToChat(message));

sendButton.addEventListener('click', async () => {
    const userMessage = userInput.value;
    const file = fileInput.files[0];

    // Очистка сообщения об ошибке перед каждым запросом
    errorMessage.textContent = '';

    // Проверяем, что есть либо сообщение, либо файл
    if (!userMessage && !file) {
        errorMessage.textContent = 'Введите сообщение или прикрепите файл.';
        return;
    }

    appendMessageToChat({ role: 'user', content: userMessage || 'Файл загружается...' });

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

            if (!uploadResponse.ok) {
                throw new Error('Ошибка при загрузке файла.');
            }

            const uploadResult = await uploadResponse.json();
            fileUrl = uploadResult.url;
        }

        // Формируем запрос к GPT-4o через Puter.js
        const response = await puter.ai.chat(userMessage || 'Файл прикреплён.', { model: 'gpt-4o', fileUrl });

        if (!response || !response.message || !response.message.content) {
            throw new Error('Ошибка при получении ответа от GPT-4o.');
        }

        const responseMessage = response.message.content[0].text;

        appendMessageToChat({ role: 'ai', content: responseMessage });

        // Сохранение истории
        saveHistory({ role: 'user', content: userMessage });
        saveHistory({ role: 'ai', content: responseMessage });

        userInput.value = ''; // Очистить поле ввода
        fileInput.value = ''; // Очистить поле загрузки файла
    } catch (error) {
        console.error("Ошибка при отправке запроса:", error);
        errorMessage.textContent = `Ошибка: ${error.message}`;
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
