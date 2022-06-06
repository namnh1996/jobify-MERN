import User from "../models/user.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/index.js";
import UnauthenticatedError from "../errors/unauthenticated.js";
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
	res.send("update user");
};

export { register, login, updateUser };
