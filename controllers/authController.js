import User from "../models/user.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/index.js";
import UnauthenticatedError from "../errors/unauthenticated.js";
import jwt from "jsonwebtoken";
const register = async (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		throw new BadRequestError("Please provide all values");
	}
	const userAlreadyExits = await User.findOne({ email });
	if (userAlreadyExits) {
		throw new BadRequestError("Email already in use");
	}
	const user = await User.create({ name, email, password });
	const token = user.createJWT();
	res.status(StatusCodes.CREATED).json({
		user: {
			email: user.email,
			password: user.password,
			name: user.name,
			lastName: user.lastName,
			location: user.location,
		},
		token,
	});
};

const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new BadRequestError("Please provide all values");
	}
	//+password vi trong Schema dang dung select:false
	const user = await User.findOne({ email }).select("+password");
	if (!user) {
		throw new UnauthenticatedError("Invalid Credentials");
	}
	const token = user.createJWT();
	user.password = undefined;
	res.status(StatusCodes.OK).json({ user, token, location: user.location });
};
const updateUser = async (req, res) => {
	const { email, name, lastName, location } = req.body;
	if (!email || !name || !lastName || !location) {
		throw new BadRequestError("Please provide all values");
	}

	const user = await User.findOne({ _id: req.user.userId });

	user.email = email;
	user.name = name;
	user.lastName = lastName;
	user.location = location;

	await user.save();

	const token = user.createJWT();
	res.status(StatusCodes.OK).json({
		user,
		token,
		location: user.location,
	});
};

const updateJob = async (req, res) => {
	const { id: jobId } = req.params;
	const { company, position } = req.body;
	if (!company || !position) {
		throw new BadRequestError("Please provide all values");
	}

	const job = await Job.findOne({ _id: jobId });

	if (!job) {
		throw new NotFoundError(`No job with id ${jobId}`);
	}

	//check permissions

	const updateJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
		new: true,
		runValidator: true,
	});

	res.status(StatusCodes.Ok).json({ updateJob });
};

export { register, login, updateUser, updateJob };
