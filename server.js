const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const useragent = require('useragent');
const pdfGenerator = require('./pdfGenerator.js');
const sData = require('./sampleData.json');
const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const notifier = require('node-notifier');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const appUrl =  `http://localhost:${PORT}`;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Copybay API',
      version: '1.0.0',
      description: 'REST API for Copybay',
    },
    servers: [
      {
        url: appUrl,
      },
    ],
  },
  apis: ['./index.js'], // files containing annotations as above
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.static(path.join(__dirname, 'public')));

  /**
    * @openapi
    * /:
    *   get:
    *     description: Initial page to the API
    *     responses:
    *       200:
    *         description: Returns a mysterious string.
    */

app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/generate-cv', (req, res) => {
  const data = req.body;

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const agent = useragent.parse(req.headers['user-agent']);

  const visitor =  `${ip} ${agent.source} ${agent.version} ${agent.browser} ${agent.os}` 
  pdfGenerator.createCV(data);

  res.send('Notification sent!');
  notifier.notify({
    title: 'Download Success',
    message: 'File downloaded successfully',
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port.` + appUrl);
});