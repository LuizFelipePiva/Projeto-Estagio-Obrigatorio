import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import auth from './routes/auth.js';
import jobs from './routes/jobs.js';
import profile from './routes/profile.js';
import vagas from './routes/vagas.js'; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Api rodando');
});

app.use("/auth", auth);
app.use("/jobs", jobs);
app.use("/profile", profile);
app.use("/vagas", vagas);


app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
