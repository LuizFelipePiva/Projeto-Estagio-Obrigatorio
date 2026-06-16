import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

import db from '../config/db.js';

export const register = async (req, res) => {

    console.log(req.body);
    const { name, email, password, user_type, userType, accountType, confirmPassword } = req.body;

    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT_SECRET nao configurado' });
        }

        // Verificar se o email ja esta registrado
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email ja registrado' });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'As senhas nao coincidem' });
        }

        //const selectedAccountType = accountType ?? userType ?? user_type;

        let account = 1;

        if (accountType === "freelancer") {
            account = 0;
        }

        // Inserir o novo usuario no banco de dados
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, account]
        );

        const user = {
            id: result.insertId,
            name,
            email,
            user_type: account
        };

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, user_type: user.user_type },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: 'Usuario registrado com sucesso',
            token,
            user
        });

    } catch (error) {
        console.error('Erro ao registrar usuario:', error);
        res.status(500).json({ message: 'Erro ao registrar usuario' });
    }
};
