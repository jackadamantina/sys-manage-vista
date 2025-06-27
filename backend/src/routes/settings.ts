
import express from 'express';
import { Database } from '../database/database';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get organization settings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await Database.query('SELECT * FROM organization_settings LIMIT 1');
    
    if (result.rows.length === 0) {
      // Create default settings if none exist
      const defaultSettings = await Database.query(`
        INSERT INTO organization_settings (organization_name, timezone)
        VALUES ('IDM Experience', 'America/Sao_Paulo')
        RETURNING *
      `);
      return res.json(defaultSettings.rows[0]);
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Erro ao buscar configurações' });
  }
});

// Update organization settings
router.put('/', authenticateToken, async (req, res) => {
  try {
    const { organization_name, timezone, password_policy, session_timeout_minutes } = req.body;
    
    const result = await Database.query(`
      UPDATE organization_settings 
      SET organization_name = $1, timezone = $2, password_policy = $3, 
          session_timeout_minutes = $4, updated_at = NOW()
      WHERE id = (SELECT id FROM organization_settings LIMIT 1)
      RETURNING *
    `, [organization_name, timezone, password_policy, session_timeout_minutes]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Configurações não encontradas' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Erro ao atualizar configurações' });
  }
});

export default router;
