
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Database } from '../database/database';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const result = await Database.query(
      'SELECT id, email, username, full_name, role, password, is_active FROM user_idm WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(401).json({ error: 'Usuário inativo' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, fullName } = req.body;

    if (!email || !password || !username || !fullName) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Check if user already exists
    const existingUser = await Database.query(
      'SELECT id FROM user_idm WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email ou nome de usuário já existem' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Database.query(
      'INSERT INTO user_idm (email, password, username, full_name, role) VALUES ($1, $2, $3, $4, $5)',
      [email, hashedPassword, username, fullName, 'user']
    );

    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
