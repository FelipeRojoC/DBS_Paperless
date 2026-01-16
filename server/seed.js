const { pool } = require('./src/db');
const bcrypt = require('bcryptjs');

const roles = [
    'Mecánico especialista', 'Líder Mecánico', 'Ingeniero de Calidad',
    'Jefe de Calidad', 'Jefe de servicio', 'Jefe SGI', 'Asesor HSE',
    'Soldador', 'Op Maquina herramienta', 'Gerente Servicio',
    'Gerente Operaciones', 'Encargado de Bodega'
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Seeding database...');

        // Hash a default password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);

        // Create 1 user for each role
        for (const role of roles) {
            const email = `${role.toLowerCase().replace(/\s+/g, '.')}@example.com`
                .replace(/[á]/g, 'a')
                .replace(/[é]/g, 'e')
                .replace(/[í]/g, 'i')
                .replace(/[ó]/g, 'o')
                .replace(/[ú]/g, 'u')
                .replace(/ñ/g, 'n');

            const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

            if (userCheck.rows.length === 0) {
                await pool.query(
                    'INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4)',
                    [email, passwordHash, `Test ${role}`, role]
                );
                console.log(`✅ Created user: ${email} (${role})`);
            } else {
                console.log(`⚠️ User existing: ${email}`);
            }
        }


        // Create Form Templates
        const templates = [
            { code: 'R3', name: 'Permiso de Trabajo Seguro (R3)', schema: { fields: [] } },
            { code: 'R7', name: 'Certificado de Aislamiento (R7)', schema: { fields: [] } }
        ];

        for (const tpl of templates) {
            const tplCheck = await pool.query('SELECT * FROM form_templates WHERE code = $1', [tpl.code]);
            if (tplCheck.rows.length === 0) {
                await pool.query(
                    'INSERT INTO form_templates (code, name, schema_definition) VALUES ($1, $2, $3)',
                    [tpl.code, tpl.name, tpl.schema]
                );
                console.log(`✅ Created Template: ${tpl.code}`);
            } else {
                console.log(`⚠️ Template existing: ${tpl.code}`);
            }
        }

        console.log('🏁 Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding database:', err);
        process.exit(1);
    }
};

seedDatabase();
