const express = require('express');
const Job = require('../models/Job');
const User = require('../models/User'); 
const router = express.Router();

// Fetch all jobs with postedBy details populated
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name'); // only populate name & email
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Profile page mein jobs fetch karna
router.get('/profile/:id', async (req, res) => {
  try {
    const userId = req.params.id; // Directly use req.params.id
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const jobs = await Job.find({ postedBy: userId }).populate('postedBy', 'firstName email');
    res.json({ user, jobs });
  } catch (err) {
    console.error("🔥 Error fetching alumnus:", err);
    res.status(500).json({ message: err.message });
  }
});


// Add a new job (assuming you pass the logged-in user’s ID in postedBy)
router.post('/', async (req, res) => {
  const { title, company, location, description, hrName, email, postedBy, firstName, } = req.body;

  const job = new Job({
    title,
    company,
    location,
    description,
    hrName,
    email,
    postedBy,
    firstName,
  });

  try {
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an existing job
router.put('/:id', async (req, res) => {
  console.log("Received ID:", req.params.id); 
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const { title, company, description, location, hrName, email } = req.body;
    job.title = title || job.title;
    job.company = company || job.company;
    job.location = location || job.location;
    job.description = description || job.description;
    job.hrName = hrName || job.hrName;
    job.email = email || job.email;

    await job.save();
    res.json({ message: 'Job updated', job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a job
router.delete("/:id", async (req, res) => {
  console.log("DELETE request received for ID:", req.params.id); 

  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      console.log("Job not found for deletion.");
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    console.log("Server error while deleting job:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
