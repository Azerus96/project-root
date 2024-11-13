const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка загрузки файлов
const upload = multer({ dest: 'uploads/' });

// Раздача статических файлов
app.use(express.static(path.join(__dirname, '../public')));

// Обработка загрузки файлов
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: 'Файл не загружен' });
    }

    // Генерируем URL для загруженного файла
    const fileUrl = `/uploads/${file.filename}`;
    res.json({ url: fileUrl });
});

// Раздача загруженных файлов
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
