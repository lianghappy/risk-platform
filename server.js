const path = require('path');
const express = require('express');
const constants = require('./constants');

const app = express();
const PORT = process.env.PORT || 8000;

const filePath = constants.PATHS === '' ? 'dist/index.html' : `dist/${constants.PATHS}/index.html`;

app.use(express.static(path.join(__dirname, 'dist')));
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'dist/index.html'));
// });

/* ---------- 路由解析 ----------*/
app.get('*', (req, res) => {
    if (!/^\/api/.test(req.path)) {
        res.sendFile(path.resolve(__dirname, filePath));
    }
});
