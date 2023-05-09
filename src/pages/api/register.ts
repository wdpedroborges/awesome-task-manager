import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';
const mongoose = require('mongoose');
const User = require('./_models/User');

// configuração do mongoose
mongoose.set("strictQuery", false);
mongoose.connect(`${process.env.DB_CONNECTION}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

console.log(process.env.DB_CONNECTION)

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
    case "POST":
      try {
        const { username, email, password } = req.body;

        console.log('Registering user with the following data:')
        console.log(username, email, password)

        const existingUsername = await User.findOne({ username });
        if (existingUsername) 
          return res.status(400).json({ message: "Username already exists.", error: true });

        const existingEmail = await User.findOne({ email });
        if (existingEmail)
          return res.status(400).json({ message: "Email already exists.", error: true });

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({ username, email, password: hashedPassword });

        return res.status(201).json({ message: "User created.", error: false });
      } catch (error) {
        return res.status(500).json({ message: "Error creating user", error });
      }
    default:
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
