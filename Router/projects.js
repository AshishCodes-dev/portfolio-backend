const express = require('express');
const router = express.Router();
const Project = require('../Models/project');

// =====================
// POST - नया project add करो
// =====================
router.post('/add', async (req, res) => {
  try {
    const { title, description, image, technologies, liveLink, githubLink, category } = req.body;

    // Validation check करो
    if (!title || !description || !technologies) {
      return res.status(400).json({ 
        error: 'Title, Description और Technologies जरूरी हैं' 
      });
    }

    // नया project document बनाओ
    const newProject = new Project({
      title,
      description,
      image,
      technologies,
      liveLink,
      githubLink,
      category
    });

    // Database में save करो
    await newProject.save();

    res.status(201).json({ 
      message: '✅ Project added successfully!',
      data: newProject
    });

  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ 
      error: 'Project add करने में error आया',
      details: error.message
    });
  }
});

// =====================
// GET - सभी projects देखो
// =====================
router.get('/all', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({
      message: '✅ All projects fetched',
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Projects fetch करने में error',
      details: error.message
    });
  }
});

// =====================
// GET - एक specific project देखो
// =====================
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ 
        error: 'Project नहीं मिला' 
      });
    }

    res.json({
      message: '✅ Project fetched',
      data: project
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Project fetch करने में error',
      details: error.message
    });
  }
});

// =====================
// PUT - project को update करो
// =====================
router.put('/update/:id', async (req, res) => {
  try {
    const { title, description, image, technologies, liveLink, githubLink, category } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, image, technologies, liveLink, githubLink, category },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ 
        error: 'Project नहीं मिला' 
      });
    }

    res.json({ 
      message: '✅ Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Update करने में error',
      details: error.message
    });
  }
});

// =====================
// DELETE - project को delete करो
// =====================
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ 
        error: 'Project नहीं मिला' 
      });
    }

    res.json({ 
      message: '✅ Project deleted successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Delete करने में error',
      details: error.message
    });
  }
});

module.exports = router;