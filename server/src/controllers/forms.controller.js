const { pool } = require('../db');

// Create a new form submission
const submitForm = async (req, res) => {
    const { template_id, service_order_id, technician_id, form_data, status } = req.body;

    // Default status to 'submitted' if not provided
    const submissionStatus = status || 'submitted';

    try {
        const result = await pool.query(
            `INSERT INTO form_submissions 
      (template_id, service_order_id, technician_id, status, form_data) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
            [template_id || 1, service_order_id || 'SO-000', technician_id || 1, submissionStatus, form_data]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error submitting form' });
    }
};

// Get all submissions (with optional filtering)
const getSubmissions = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT fs.*, u.full_name as technician_name, ft.name as form_name 
      FROM form_submissions fs
      LEFT JOIN users u ON fs.technician_id = u.id
      LEFT JOIN form_templates ft ON fs.template_id = ft.id
      ORDER BY fs.created_at DESC
    `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching submissions' });
    }
};

// Get a single submission by ID
const getSubmissionById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM form_submissions WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching submission' });
    }
};

module.exports = { submitForm, getSubmissions, getSubmissionById };
