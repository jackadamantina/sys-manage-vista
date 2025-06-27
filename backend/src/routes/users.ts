
import express from 'express';
import { Database } from '../database/database';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get imported users count
router.get('/imported/count', authenticateToken, async (req, res) => {
  try {
    const result = await Database.query('SELECT COUNT(*) as count FROM imported_users_idm');
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Get imported users count error:', error);
    res.status(500).json({ error: 'Erro ao buscar contagem de usuários' });
  }
});

// Get system users count
router.get('/system/count', authenticateToken, async (req, res) => {
  try {
    const result = await Database.query('SELECT COUNT(*) as count FROM system_users_idm');
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Get system users count error:', error);
    res.status(500).json({ error: 'Erro ao buscar contagem de usuários de sistemas' });
  }
});

// Get all imported users
router.get('/imported', authenticateToken, async (req, res) => {
  try {
    const result = await Database.query(
      'SELECT * FROM imported_users_idm ORDER BY imported_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get imported users error:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários importados' });
  }
});

export default router;
