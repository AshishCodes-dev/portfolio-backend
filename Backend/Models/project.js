const mongoose = require('mongoose');

// Project का schema
const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: false
  },
  technologies: {
    type: [String],
    required: true
  },
  liveLink: {
    type: String,
    required: false
  },
  githubLink: {
    type: String,
    required: false
  },
  category: {
    type: String,
    enum: ['Web Development', 'Full Stack', 'Frontend', 'Backend'],
    default: 'Web Development'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema);