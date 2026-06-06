const express = require('express');
const app = express();
app.use(express.json());

app.post('/verify', (req, res) => {
    res.status(200).send('ok');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
