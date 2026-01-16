const { pool } = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// LOGIC FOR MICROSOFT LOGIN
// 1. Client sends { email, microsoftToken }
// 2. We validate token (omitted for now)
// 3. We check if user exists in our DB
// 4. We issue our own JWT

const login = async (req, res) => {
    const { email, password, microsoftToken } = req.body;

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            // Security: Do not reveal user existence? Or just say Invalid Credentials
            return res.status(401).json({ message: 'Acceso denegado. Usuario no registrado en el sistema.' });
        }

        // Determine Auth Method
        let isAuthenticated = false;

        if (microsoftToken) {
            // TODO: Validate Microsoft Token here
            // if (validate(microsoftToken)) isAuthenticated = true;
            console.log(`[AUTH] Login via Microsoft Token for ${email}`);
            isAuthenticated = true; // Assuming valid for now since we trust the client in this phase
        } else if (password) {
            // Legacy/Local fallback (if needed, or can be removed)
            const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
            isAuthenticated = validPassword;
        }

        if (!isAuthenticated) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user.rows[0].id, role: user.rows[0].role },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '8h' }
        );

        res.json({
            token,
            user: {
                id: user.rows[0].id,
                full_name: user.rows[0].full_name,
                role: user.rows[0].role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { login };
