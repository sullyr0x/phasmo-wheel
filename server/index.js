import { join } from 'path';
import express from 'express';

const PORT = process.env.PORT || 8000;

const app = express();

app.use('/js', express.static(join(__dirname, '../client')));
app.use('/data', express.static(join(__dirname, '../data')));

app.get('/index.css', (req, res) => res.sendFile(join(__dirname, '../index.css')));

app.get('*', (req, res) => res.sendFile(join(__dirname, '../index.html')));

app.listen(PORT, () => { console.log(`Listening on port ${PORT}`) });