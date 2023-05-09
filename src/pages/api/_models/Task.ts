import mongoose from 'mongoose'
import sanitizeHtml from 'sanitize-html'

let Task: any

try {
  Task = mongoose.model('Task');
} catch(e) {
  const taskSchema = new mongoose.Schema({
    author: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    content: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    category: {
      type: String,
      required: true,
      default: 'everyday'
    }
  });

  taskSchema.pre('save', function (this: any, next: any) {
    this.author = sanitizeHtml(this.author);
    this.content = sanitizeHtml(this.content);
    this.completed = sanitizeHtml(this.completed);
    this.category = sanitizeHtml(this.category);
    next();
  });
  
  Task = mongoose.model('Task', taskSchema);
}

module.exports = Task;