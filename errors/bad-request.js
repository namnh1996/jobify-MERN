import CustomApiError from "./not-found.js";
import { StatusCodes } from "http-status-codes";
class BadRequestError extends CustomApiError {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.BAD_REQUEST;
	}
}

export default BadRequestError;
