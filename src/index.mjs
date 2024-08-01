import express from 'express';
import routes from './routes/index.mjs';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(routes);

app.get('/', (req, res) => {
  res.status(201).send({ msg: 'hello' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
