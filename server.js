// server.js (arquivo do backend)
const express = require('express');
const fetch = require('node-fetch'); // Instale com npm install node-fetch@2
const cors = require('cors'); // Instale com npm install cors

const app = express();
app.use(express.json());
app.use(cors()); // Permite chamadas do frontend

// Configurações do GitHub (agora seguras no servidor)
const GITHUB_OWNER = 'Vtrmalu';
const GITHUB_REPO = 'sonhodourado';
const GITHUB_TOKEN = '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';

app.post('/api/create-github-file', async (req, res) => {
    const { path, content, message } = req.body;

    if (!path || !content || !message) {
        return res.status(400).json({ message: 'Dados incompletos.' });
    }

    const base64Content = Buffer.from(content).toString('base64');

    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: message,
                content: base64Content
            })
        });

        if (response.ok) {
            res.json({ success: true });
        } else {
            const errorData = await response.json();
            res.status(500).json({ message: errorData.message || 'Erro no GitHub.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
