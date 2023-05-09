import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const mongoose = require('mongoose');
const User = require('./_models/User');
const Task = require('./_models/Task');

// configuração do mongoose
mongoose.set("strictQuery", false);
mongoose.connect(`${process.env.DB_CONNECTION}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB'));
db.once('open', function () {
    console.log('MongoDB connected');
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req;
    switch (method) {
        case 'POST':
            const { username, password } = req.body;

            console.log('Logging user with the following data:')
            console.log(username, password)

            try {
                // Verifica se o usuário existe na base de dados
                const user = await User.findOne({ username });

                if (!user) {
                    return res.status(401).json({ message: "Username is incorrect or doesn't exist.", error: true });
                }

                console.log('registered username: ' + user.username)
                console.log('password: ' + user.password)

                // Verifica se a senha está correta
                const isPasswordCorrect = await bcrypt.compare(password, user.password);

                if (!isPasswordCorrect) {
                    return res.status(401).json({ message: 'Password is incorrect.', error: true });
                }

                // Gera o token JWT
                const token = jwt.sign({ username: user.username }, `${process.env.JWT_KEY}`, { expiresIn: '1h' });

                // Retorna o token no response
                return res.status(200).json({ token, username: user.username, email: user.email });
            } catch(err) {
                console.error(err)
                return res.status(401).json({ message: 'Invalid token', error: true })               
            }
        case 'GET':
            console.log('getting user data')
            if (!req.headers.authorization) {
                return res.status(401).json({ message: 'Authorization header not found', error: true })
            }
    
            try {
                const token = req.headers.authorization.replace('Bearer ', '')
                const decoded = jwt.verify(token, `${process.env.JWT_KEY}`)
                const { username }: any = decoded
                const user = await User.findOne({ username }, { email: 1 })
                if (!user)
                    return res.status(404).json({ message: 'User not found', error: true })

                const today = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear();
                const userProgress = await Task.find({ author: username, type: 'record' })
                console.log(userProgress)
                let totalCompleted = 0
                let amounts = []
                let dates = []
                for (let i = 0; i < userProgress.length; i++) {
                    let completed = Boolean(userProgress[i].content.split(' - ')[0])
                    if (completed) {
                        totalCompleted += 1
                        amounts.push(parseInt(userProgress[i].content.split(' - ')[1]))
                        dates.push(userProgress[i].category)
                    }
                }

                return res.status(200).json({ username, email: user.email, amounts, dates, totalCompleted: (totalCompleted / userProgress.length) || 0 })
            } catch (err) {
            console.error(err)
            return res.status(401).json({ message: 'Invalid token', error: true })
            }            
        default:
            res.setHeader('Allow', ['POST', 'GET']);
            return res.status(405).end(`Method ${method} Not Allowed`);
    }
}