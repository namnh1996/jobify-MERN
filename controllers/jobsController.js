import Job from "../models/job.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { UnauthenticatedError } from "../errors/index.js";

import checkPermissions from "../utils/checkPermissions.js";
const createJob = async (req, res) => {
	const { position, company } = req.body;

	if (!position || !company) {
		throw new BadRequestError("Please Provide All Values");
	}
	req.body.createdBy = req.user.userId;

	const job = await Job.create(req.body);
	res.status(StatusCodes.CREATED).json({ job });
};

const deleteJob = async (req, res) => {
	const { id: jobId } = req.params;
	const job = await Job.findOne({ _id: jobId });

	if (!job) {
		throw new UnauthenticatedError(`No job with id: ${jobId}`);
	}

	checkPermissions(req.user, job.createdBy);

	await job.remove();
	res.status(StatusCodes.OK).json({ msg: "Success! Job removed" });
};
const getAllJobs = async (req, res) => {
	const jobs = await Job.find({ createBy: req.user.userId });

	res.status(StatusCodes.OK).json({
		jobs,
		totalJobs: jobs.length,
		numOfPages: 1,
	});
};
const updateJob = async (req, res) => {
	const { id: jobId } = req.params;
	const { company, position, status } = req.body;

	if (!position || !company) {
		throw new BadRequestError("Please provide all values");
	}
	const job = await Job.findOne({ _id: jobId });

	if (!job) {
		throw new BadRequestError(`No job with id: ${jobId}`);
	}

	checkPermissions(req.user, job.createdBy);

	const updateJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(StatusCodes.OK).json({ updateJob });
};
const showStats = async (req, res) => {
	res.send("show stats");
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
