
import express from 'express';
import * as companyController from '../controllers/companyController.js';
import auth from '../middleware/auth.js';
import adminOnly from '../middleware/admin.js';
const router = express.Router();

// POST /api/companies/review - Admin: approve or deny a company
router.post('/review', auth, adminOnly, companyController.reviewCompany);

// GET /api/companies/ - List all companies (admin only)
router.get('/', auth, adminOnly, companyController.getAllCompanies);

// POST /api/companies/ - Register a new company (companyOwner only)
router.post('/', auth, companyController.registerCompany);

// GET /api/companies/my - List all companies owned by the logged-in companyOwner
router.get('/my', auth, companyController.getMyCompanies);

// PUT /api/companies/:id - Update a company (only by owner)
router.put('/:id', auth, companyController.updateCompany);

// DELETE /api/companies/:id - Delete a company (only by owner)
router.delete('/:id', auth, companyController.deleteCompany);

export default router;
