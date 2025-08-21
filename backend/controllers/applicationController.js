import applicationService from '../services/applicationService.js';

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
            const application = await applicationService.applyForJob(req.body, req.user);
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
            await applicationService.withdrawApplication(req.params.id, req.user);
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
