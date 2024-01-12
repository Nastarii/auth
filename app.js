const express = require('express');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const clientRouter = require('./core/clients/routes');
const signRouter = require('./core/authentication/sign/routes');
const logRouter = require('./core/authentication/log/routes');
const sendEmail = require('./core/authentication/email/service');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/clients', clientRouter);
app.use('/sign', signRouter);
app.use('/log', logRouter);

app.get('/', async (req, res) => {
  const successMsg = '📨 Your SMTP settings are properly configured!';
  let success = true;
  const sentMail = await sendEmail({
    to:process.env.SMTP_USER,
    subject: 'Settings Verification ✔',
    text: successMsg,
  }).catch(error => {
    console.log(error)
    success = false;
  });
  const mailMessage = (sentMail.accepted.length > 0 && success) ? successMsg : '📩 Your SMTP failed!';
  res.send(`✨ Well Done your app is up!\n${mailMessage}`)
})

app.listen(PORT, () => {
  console.log(`🚀 App listening on port ${PORT}, available at http://${process.env.DOMAIN}:${PORT}`)
})