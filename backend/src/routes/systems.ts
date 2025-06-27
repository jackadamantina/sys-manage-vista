
import express from 'express';
import { Database } from '../database/database';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all systems
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await Database.query(
      'SELECT * FROM systems_idm ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get systems error:', error);
    res.status(500).json({ error: 'Erro ao buscar sistemas' });
  }
});

// Create system
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name, description, url, hosting, access_type, responsible,
      user_management_responsible, password_complexity, onboarding_type,
      offboarding_type, offboarding_priority, named_users, sso_configuration,
      integration_type, region_blocking, mfa_configuration, mfa_policy,
      mfa_sms_policy, logs_status, log_types, version, integrated_users
    } = req.body;

    const result = await Database.query(`
      INSERT INTO systems_idm (
        name, description, url, hosting, access_type, responsible,
        user_management_responsible, password_complexity, onboarding_type,
        offboarding_type, offboarding_priority, named_users, sso_configuration,
        integration_type, region_blocking, mfa_configuration, mfa_policy,
        mfa_sms_policy, logs_status, log_types, version, integrated_users, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      RETURNING *
    `, [
      name, description, url, hosting, access_type, responsible,
      user_management_responsible, password_complexity, onboarding_type,
      offboarding_type, offboarding_priority, named_users, sso_configuration,
      integration_type, region_blocking, mfa_configuration, mfa_policy,
      mfa_sms_policy, logs_status, log_types, version, integrated_users, req.user.userId
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create system error:', error);
    res.status(500).json({ error: 'Erro ao criar sistema' });
  }
});

// Update system
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;
    
    // Build dynamic update query
    const keys = Object.keys(updateFields);
    const values = Object.values(updateFields);
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    
    const result = await Database.query(
      `UPDATE systems_idm SET ${setClause}, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sistema não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update system error:', error);
    res.status(500).json({ error: 'Erro ao atualizar sistema' });
  }
});

// Delete system
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Database.query(
      'DELETE FROM systems_idm WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sistema não encontrado' });
    }

    res.json({ message: 'Sistema deletado com sucesso' });
  } catch (error) {
    console.error('Delete system error:', error);
    res.status(500).json({ error: 'Erro ao deletar sistema' });
  }
});

export default router;
