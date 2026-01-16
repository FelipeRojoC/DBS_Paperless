require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool } = require('./src/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

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
