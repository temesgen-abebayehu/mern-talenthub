import jobService from '../services/jobService.js';

const jobController = {
    async getAllJobs(req, res, next) {
        try {
            const jobs = await jobService.getAllJobs(req.query);
            res.json(jobs);
        } catch (err) { next(err); }
    },
    async getFeaturedJobs(req, res, next) {
        try {
            const jobs = await jobService.getFeaturedJobs(req.query);
            res.json(jobs);
        } catch (err) { next(err); }
    },
    async getJobsByEmployer(req, res, next) {
        try {
            const jobs = await jobService.getJobsByEmployer(req.params.employerId);
            res.json(jobs);
        } catch (err) { next(err); }
    },
    async searchJobs(req, res, next) {
        try {
            const jobs = await jobService.searchJobs(req.query);
            res.json(jobs);
        } catch (err) { next(err); }
    },
    async getJobById(req, res, next) {
        try {
            const job = await jobService.getJobById(req.params.id);
            res.json(job);
        } catch (err) { next(err); }
    },
    async createJob(req, res, next) {
        try {
            const job = await jobService.createJob(req.body, req.user.id);
            res.status(201).json(job);
        } catch (err) { next(err); }
    },
    async updateJob(req, res, next) {
        try {
            const job = await jobService.updateJob(req.params.id, req.body, req.user.id);
            res.json(job);
        } catch (err) { next(err); }
    },
    async deleteJob(req, res, next) {
        try {
            await jobService.deleteJob(req.params.id, req.user.id);
            res.json({ message: 'Job deleted' });
        } catch (err) { next(err); }
    },
    async getJobApplications(req, res, next) {
        try {
            const applications = await jobService.getJobApplications(req.params.id, req.user.id);
            res.json(applications);
        } catch (err) { next(err); }
    },
    async getJobAnalytics(req, res, next) {
        try {
            const analytics = await jobService.getJobAnalytics(req.params.id, req.user.id);
            res.json(analytics);
        } catch (err) { next(err); }
    }
};

export default jobController;
