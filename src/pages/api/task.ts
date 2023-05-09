import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken';
const mongoose = require('mongoose');
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

const getDayOfWeek = () => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    switch (dayOfWeek) {
        case 0:
            return "Sunday"
        case 1:
            return "Monday"
        case 2:
            return "Tuesday"
        case 3:
            return "Wednesday"
        case 4:
            return "Thursday"
        case 5:
            return "Friday"
        case 6:
            return "Saturday"
        default:
            return "Sunday"
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let author = ''
    const { content, type, completed, category } = req.body
    const { id } = req.query

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Token not found' })
    }

    jwt.verify(token, `${process.env.JWT_KEY}`, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' })
        }
        const { username }: any = decoded
        author = username
    })

    switch (req.method) {
        case 'GET':
            try {
                const tasks = await Task.find({ author, type: { $ne: 'record' } })
                res.status(200).json({ tasks })
            } catch (error) {
                res.status(500).json({ message: 'Server error', error: true })
            }
            break
        case 'POST':
            try {
                const newTask = new Task({
                    author,
                    content,
                    type,
                    category
                })
                await newTask.save()
                res.status(200).json({ message: 'Task created successfully.', error: false })
            } catch (error) {
                res.status(500).json({ message: 'Server error.', error: true })
            }
            break
        case 'PUT':
            try {
                const taskToUpdate = await Task.findById(id);
                if (!taskToUpdate) {
                    return res.status(404).json({ message: `Task not found.`, error: true });
                }

                if (JSON.stringify(req.body) === '{}') {
                    return res.status(404).json({ message: `No data was received.`, error: true });
                }

                // Only update the fields that were received in the request body
                if (content) taskToUpdate.content = content;
                if (type) taskToUpdate.type = type;
                if (completed !== undefined) taskToUpdate.completed = !Boolean(completed);
                if (category) taskToUpdate.category = category;

                await taskToUpdate.save();

                // ! Start progress handling
                const today = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear();
                const currentDayOfWeek = getDayOfWeek()
                const allTasks = await Task.find({ author, type: req.body.type });
                let totalAmount = 0
                // ? The total amount needs to be calculated considering the type
                allTasks.forEach((task: any) => {
                    if (task.type === currentDayOfWeek || task.type === 'Everyday')
                        totalAmount++
                })

                const finishedAmount = await Task.countDocuments({ author, completed: true, type: req.body.type });
                console.log(finishedAmount)
                const finished = totalAmount === finishedAmount ? true : false;
                const currentProgress = Task.findOne({ author, type: 'record', category: today }).exec();
                currentProgress.then(async (task: any) => {
                  if (task) {
                    console.log('Task of progress already exists');
                    task.content = `${finished} - ${finishedAmount}`
                    await task.save()
                  } else {
                    console.log('Task of progress does not exist');
                    const newTask = new Task({
                        author: author,
                        content: `${finished} - ${finishedAmount}`,
                        type: 'record',
                        completed: false,
                        category: today
                      });

                      await newTask.save()
                  }
                }).catch((err: Error) => {
                  console.error(err);
                });
                // ! End of progress handling
                res.status(200).json({ message: `Task updated successfully.`, error: false });
            } catch (error) {
                res.status(500).json({ message: 'Server error.', error: true });
            }
            break;
        case 'DELETE':
            try {
                const taskToDelete = await Task.findByIdAndDelete(id)
                if (!taskToDelete) {
                    return res.status(404).json({ message: `Task not found.`, error: true })
                }
                res.status(200).json({ message: `Task deleted successfully`, error: false })
            } catch (error) {
                res.status(500).json({ message: 'Server error', error: true })
            }
            break
        default:
            res.status(405).json({ message: 'Method Not Allowed', error: true })
            break
    }
}

// maximum request size to 1 megabyte
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
}