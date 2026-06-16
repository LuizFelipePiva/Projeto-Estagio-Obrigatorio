import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

import db from '../config/db.js';

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT_SECRET nao configurado' });
        }

        const [users] = await db.query(
            'SELECT id, name, email, user_type, password FROM users WHERE email = ?',
            [email]
        );
        if (users.length === 0) {
            return res.status(400).json({ message: 'Email ou senha incorretos' });
        }
        const user = users[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Email ou senha incorretos' });
        }


        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, user_type: user.user_type },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                user_type: user.user_type
            }
        });
    }
    catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro ao fazer login' });
    }
}
