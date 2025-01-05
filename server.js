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
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const analyticsRoutes = require('./routes/analytics');
const paymentRoutes = require('./routes/payment');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB with error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/precisecv', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Security middleware
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/precisecv'
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(cors());
const appUrl = `http://localhost:${PORT}`;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Precise CV API',
      version: '1.0.0',
      description: 'REST API for Precise CV',
    },
    servers: [{ url: appUrl }],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payment', paymentRoutes);

// Main routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/cv-builder', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cv-builder.html'));
});

app.get('/dashboard', (req, res) => {
  return res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard.html'));
});

app.get('/login', (req, res) => {
  return res.sendFile(path.join(__dirname, 'public', 'auth', 'login.html'));
});

app.get('/register', (req, res) => {
  return res.sendFile(path.join(__dirname, 'public', 'auth', 'register.html'));
});

app.get('/stitch_sense/privacy', (req, res) => {
  return res.sendFile(path.join(__dirname, 'public', 'stitch_sense', 'privacy.html'));
});

app.get('/mart_pos/privacy', (req, res) => {
  return res.sendFile(path.join(__dirname, 'public', 'mart_pos', 'privacy.html'));
});

// Update the logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, ...metadata }) => {
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...metadata
      });
    })
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// If we're not in production, also log to console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Protected route for CV generation
app.post('/generate-cv', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const agent = useragent.parse(req.headers['user-agent']);
      
      logger.warn('Unauthenticated CV generation attempt', {
        ip: ip,
        userAgent: {
          browser: agent.toAgent(),
          os: agent.os.toString(),
          device: agent.device.toString(),
          version: agent.version
        },
        timestamp: new Date(),
        path: req.path,
        method: req.method
      });

      return res.status(401).json({ 
        status: 'error',
        message: 'Please login to generate CV',
        notification: {
          type: 'warning',
          duration: 5000
        }
      });
    }

    // Check if user has active subscription
    const user = await User.findById(req.user._id);
    if (!user.hasActiveSubscription) {
      return res.status(403).json({ error: 'Please subscribe to generate CV' });
    }

    const data = req.body;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const agent = useragent.parse(req.headers['user-agent']);
    const visitor = `${ip} ${agent.source} ${agent.version} ${agent.browser} ${agent.os}`;
    const outputName = `${data.personalDetails.name.toLowerCase().replace(/\s+/g, '_')}`;
    const filePath = path.join(__dirname, `${outputName}.pdf`);

    // Generate CV
    await pdfGenerator.createCV(data);

    // Log analytics
    await Analytics.create({
      userId: req.user._id,
      eventType: 'DOWNLOAD',
      details: {
        action: 'CV_GENERATION',
        formData: data
      },
      userAgent: agent.source,
      ipAddress: ip
    });

    // Update user's download history
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        downloads: {
          cvId: outputName,
          downloadedAt: new Date(),
          location: req.body.location // Client should send location data
        }
      }
    });

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
      // Clean up the file after sending
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting temporary file:', err);
      });
    });
  } catch (error) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const agent = useragent.parse(req.headers['user-agent']);

    logger.error('Error generating PDF', {
      error: error.message,
      stack: error.stack,
      ip: ip,
      userAgent: {
        browser: agent.toAgent(),
        os: agent.os.toString(),
        device: agent.device.toString(),
        version: agent.version
      },
      userId: req.user?._id,
      timestamp: new Date(),
      path: req.path,
      method: req.method
    });

    res.status(500).json({
      status: 'error',
      message: 'Error generating PDF',
      notification: {
        type: 'error',
        duration: 5000
      }
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server listening on ` + appUrl);
});