const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');

let User;

try {
  // Verifica se o modelo já foi definido antes
  User = mongoose.model('User');
} catch (e) {
  // Se não foi definido antes, define agora
  const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true
    }
  });

  userSchema.pre('save', function (this: any, next: any) {
    this.username = sanitizeHtml(this.username);
    this.email = sanitizeHtml(this.email);
    this.password = sanitizeHtml(this.password);
    next();
  });

  User = mongoose.model('User', userSchema);
}

module.exports = User;