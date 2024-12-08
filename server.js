const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const useragent = require('useragent');
const pdfGenerator = require('./pdfGenerator.js');
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
      title: 'Precise CV API',
      version: '1.0.0',
      description: 'REST API for Precise CV',
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

app.get('/dashboard', (req, res) => {
  return res.sendFile(path.join(__dirname, 'public', 'admin', 'home.html'));
});


app.get('/sample', (req, res) => {
  const PDFDocument = require('pdfkit');
const fs = require('fs');

// Create a new PDF document
const doc = new PDFDocument();

// Pipe the PDF document to a file
doc.pipe(fs.createWriteStream('sample.pdf'));

// Add content to the PDF
doc.fontSize(25)
   .text('Hello, PDFKit!', 100, 100);

doc.fontSize(12)
   .text('This is a simple PDF generated using PDFKit.', 100, 150);

// Add some styling and additional elements
doc.moveDown()
   .fillColor('blue')
   .text('PDFKit makes PDF creation easy!', 100, 200);

// Draw a rectangle
doc.rect(100, 250, 200, 50)
   .stroke();

// Add an image (optional - requires image file)
// doc.image('path/to/image.jpg', 100, 320, { width: 200 });

// Finalize the PDF
doc.end();

console.log('PDF generated successfully!');
});

app.get('/download-pdf', (req, res) => {
  // Create a new PDF document
  const doc = new PDFDocument();

  // Set headers for PDF download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=sample.pdf');

  // Pipe the PDF directly to the response
  doc.pipe(res);

  // Add content to the PDF
  doc.fontSize(25)
     .text('Downloadable PDF', 100, 100);

  doc.fontSize(12)
     .text('This PDF is generated and downloaded dynamically.', 100, 150);

  doc.moveDown()
     .fillColor('blue')
     .text('Created with Express and PDFKit', 100, 200);

  // Draw a rectangle
  doc.rect(100, 250, 200, 50)
     .stroke();

  // Finalize the PDF
  doc.end();
});



app.post('/generate-cv', (req, res) => {
  const data = req.body;

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const agent = useragent.parse(req.headers['user-agent']);
  const visitor =  `${ip} ${agent.source} ${agent.version} ${agent.browser} ${agent.os}` 
  const outputName = `${data.personalDetails.name.toLowerCase().replace(/\s+/g, '_')}`;
  const filePath = path.join(__dirname, `${outputName}.pdf`);

  pdfGenerator.createCV(data)
    .then(() => {
      res.download(filePath, `${outputName}.pdf`, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).send('Error generating PDF');
        } else {
          notifier.notify({
            title: 'Download Success',
            message: 'File downloaded successfully',
          });
        }
      });
    })
    .catch(err => {
      console.error('Error generating PDF:', err);
      res.status(500).send('Error generating PDF');
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on port.` + appUrl);
});