import express from 'express';
import jobController from '../controllers/jobController.js';
import auth from '../middleware/auth.js';
import { validateJob, validateJobUpdate, validateJobId, validateJobSearch } from '../middleware/jobValidation.js';
const router = express.Router();


// GET /api/jobs/ - Get all jobs (with pagination)
router.get('/', jobController.getAllJobs);

// GET /api/jobs/featured - Get featured jobs
router.get('/featured', jobController.getFeaturedJobs);

// GET /api/jobs/employer/:employerId - Get jobs by employer
router.get('/employer/:employerId', auth, jobController.getJobsByEmployer);

// GET /api/jobs/search - Search jobs by criteria
router.get('/search', validateJobSearch, jobController.searchJobs);

// GET /api/jobs/:id - Get job by ID
router.get('/:id', validateJobId, jobController.getJobById);

// POST /api/jobs/ - Create a new job
router.post('/', auth, validateJob, jobController.createJob);

// PUT /api/jobs/:id - Update a job
router.put('/:id', auth, validateJobId, validateJobUpdate, jobController.updateJob);

// DELETE /api/jobs/:id - Delete a job
router.delete('/:id', auth, validateJobId, jobController.deleteJob);

// GET /api/jobs/:id/applications - Get applications for a job
router.get('/:id/applications', auth, validateJobId, jobController.getJobApplications);

// GET /api/jobs/:id/analytics - Get job application analytics
router.get('/:id/analytics', auth, validateJobId, jobController.getJobAnalytics);

// GET /api/jobs/company/:companyId - Get all jobs for a specific company
router.get('/company/:companyId', jobController.getJobsByCompany);

// GET /api/jobs/my - Get all jobs for the current company owner
router.get('/my', auth, jobController.getJobsByOwner);

export default router;
