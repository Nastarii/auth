const express = require('express');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const clientRouter = require('./core/clients/routes');
const signRouter = require('./core/authentication/sign/routes');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/clients', clientRouter);
app.use('/sign', signRouter);

app.get('/', (req, res) => {
  res.send('✨ Well Done your app is up!')
})

app.listen(PORT, () => {
  console.log(`🚀 App listening on port ${PORT}, available at http://${process.env.DOMAIN}:${PORT}`)
})