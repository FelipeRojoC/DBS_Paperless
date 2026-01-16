require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { pool } = require('./src/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Security Middleware
app.use(helmet());

// Rate Limiting: Max 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// Middleware
app.use(cors({
    origin: '*', // TODO: Restrict this to specific domains in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10kb' })); // Body limit

const authRoutes = require('./src/routes/auth.routes');
const formRoutes = require('./src/routes/forms.routes');
const sharepointRoutes = require('./src/routes/sharepoint.routes');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/sharepoint', sharepointRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('DBS Paperless API is running');
});

// Health Check & DB Connection Test
app.get('/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ status: 'ok', time: result.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Database connection failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
