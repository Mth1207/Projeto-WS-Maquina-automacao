import express, { request } from 'express';

const app = express();
const PORT = 3000;

let tempoDelay = 1000; 
let usarDelay = false; 
let requestCounter = 2;

app.use(express.json());


app.post('/config', (req, res) => {
    const { delay, delayEnabled } = req.body;

    if (delay !== undefined) {
        if (isNaN(delay) || delay < 0) {
            return res.status(400).json({ error: 'O tempo de delay deve ser um número positivo!' });
        }
        tempoDelay = delay;
    }

    if (delayEnabled !== undefined) {
        usarDelay = !!delayEnabled; 
    }

    return res.status(200).json({
        message: 'Configurações atualizadas!',
        tempoDelay,
        usarDelay
    });
});

app.get('/comDelay/:etiqueta', (req, res) => {
    const { etiqueta } = req.params;

    if (!etiqueta) {
        return res.status(400).json({ error: 'Etiqueta é necessária!' });
    }

    requestCounter = (requestCounter + 1) % 3;

    const shouldDelay = usarDelay && Math.random() < 0.5; // 50% de chance de usar o delay

    if (shouldDelay) {
        requestCounter = 2;
        console.log('\n========Usando aleatório========');
        console.log(`Usando delay de ${tempoDelay}ms para a etiqueta: ${etiqueta}`);
        setTimeout(() => {
            const saida = 1;
            res.status(200).json({ etiqueta, saida, delayApplied: true, requestCounter});
        }, delayTime);
    }
    else if(!shouldDelay && requestCounter === 2){
        console.log('\n========Usando 3 em 3========');
        console.log(`Usando delay de ${tempoDelay}ms para a etiqueta: ${etiqueta}`);
        setTimeout(() => {
            const saida = 1;
            res.status(200).json({etiqueta, saida, delayApplied: true, requestCounter});
        }, delayTime);
    } 

    else {
        if (usarDelay) {
            requestCounter = 2;
        }
        console.log('\n========Usando resposta imediata========');
        console.log(`Respondendo imediatamente para a etiqueta: ${etiqueta}`);
        const saida = 1;
        res.status(200).json({ etiqueta, saida, delayApplied: false, requestCounter});
    }
});

app.get('/semDelay/:etiqueta', (req, res) => {
    const {etiqueta} = req.params;

    if (!etiqueta) {
        return res.status(400).json({ error: 'Etiqueta é necessária!' });
    }
    const saida = 1;
    res.status(200).json({etiqueta, saida});
});

app.listen(PORT, '0.0.0.0',() => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
