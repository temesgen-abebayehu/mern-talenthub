import express from 'express';
import applicationController from '../controllers/applicationController.js';
import auth from '../middleware/auth.js';
const router = express.Router();

// GET /api/applications/ - Get all applications (Admin only)
router.get('/', auth, applicationController.getAllApplications);

// GET /api/applications/user/:userId - Get user's applications
router.get('/user/:userId', auth, applicationController.getUserApplications);

// GET /api/applications/job/:jobId - Get applications for a job
router.get('/job/:jobId', auth, applicationController.getJobApplicationsForJob);

// GET /api/applications/:id - Get application by ID
router.get('/:id', auth, applicationController.getApplicationById);

// POST /api/applications/ - Apply for a job
router.post('/', auth, applicationController.applyForJob);

// PUT /api/applications/:id/status - Update application status
router.put('/:id/status', auth, applicationController.updateApplicationStatus);

// DELETE /api/applications/:id - Withdraw application
router.delete('/:id', auth, applicationController.withdrawApplication);

// POST /api/applications/:id/notes - Add note to application
router.post('/:id/notes', auth, applicationController.addNoteToApplication);

export default router;
