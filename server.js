const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, 'dist')));
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});
