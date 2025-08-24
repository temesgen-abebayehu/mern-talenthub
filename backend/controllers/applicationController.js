
import applicationService from '../services/applicationService.js';
import cloudinary from '../config/cloudinary.js';

const applicationController = {
    async getAllApplications(req, res, next) {
        try {
            const applications = await applicationService.getAllApplications(req.user, req.query);
            res.json(applications);
        } catch (err) { next(err); }
    },
    async getUserApplications(req, res, next) {
        try {
            const applications = await applicationService.getUserApplications(req.params.userId, req.user);
            res.json(applications);
        } catch (err) { next(err); }
    },
    async getJobApplicationsForJob(req, res, next) {
        try {
            const applications = await applicationService.getJobApplicationsForJob(req.params.jobId, req.user);
            res.json(applications);
        } catch (err) { next(err); }
    },
    async getApplicationById(req, res, next) {
        try {
            const application = await applicationService.getApplicationById(req.params.id, req.user);
            res.json(application);
        } catch (err) { next(err); }
    },
    async applyForJob(req, res, next) {
        try {
            let resumeUrl = '';
            if (req.files && req.files.resume) {
                // Upload resume to Cloudinary as raw file
                const doc = req.files.resume;
                const originalName = doc.name || doc.originalname || 'resume';
                const ext = originalName.split('.').pop();
                const publicId = `resumes/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
                const uploadResult = await cloudinary.uploader.upload(doc.tempFilePath || doc.path, {
                    folder: 'resumes',
                    resource_type: 'raw',
                    public_id: publicId,
                    use_filename: true,
                    unique_filename: false,
                });
                resumeUrl = uploadResult.secure_url;
            }
            const application = await applicationService.applyForJob({
                ...req.body,
                resume: resumeUrl,
            }, req.user);
            res.status(201).json(application);
        } catch (err) { next(err); }
    },
    async updateApplicationStatus(req, res, next) {
        try {
            const application = await applicationService.updateApplicationStatus(req.params.id, req.body.status, req.user);
            res.json(application);
        } catch (err) { next(err); }
    },
    async withdrawApplication(req, res, next) {
        try {
            const deleted = await applicationService.withdrawApplication(req.params.id, req.user);
            if (!deleted) {
                return res.status(404).json({ message: 'Application not found or not owned by user' });
            }
            res.json({ message: 'Application withdrawn' });
        } catch (err) { next(err); }
    },
    async addNoteToApplication(req, res, next) {
        try {
            const application = await applicationService.addNoteToApplication(req.params.id, req.body.note, req.user);
            res.json(application);
        } catch (err) { next(err); }
    }
};

export default applicationController;
