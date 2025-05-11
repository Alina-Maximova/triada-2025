const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../utils/db');
const SECRET_KEY = 'your_secret_key';

exports.register = async (req, res) => {
    const { first_name, last_name, email, password, role_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(req.body);
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
        return res.status(400).send('Почта уже занята');
    }
    try {
        const [userId] = await db('users').insert({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            role_id
        }).returning('id');
        console.log(userId.id)
        const token = jwt.sign({ id: userId.id, userName: first_name, role: role_id }, SECRET_KEY);
        res.json({ token });
    } catch (error) {
        console.log(error.detail);
        res.status(500).send('Ошибка регистрации');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await db('users').where({ email }).first();

    if (!user) {
        return res.status(401).send('Пользователь с такой почтой не зарегистрирован');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
        const token = jwt.sign({ id: user.id, userName: user.first_name, role: user.role_id }, SECRET_KEY);
        res.json({ token });
    } else {
        res.status(401).send('Неверный пароль');
    }
}

