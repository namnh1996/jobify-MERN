import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please provide name"],
	},
	email: {
		type: String,
		required: [true, "Please provide email"],
		validate: {
			validator: validator.isEmail,
			message: "Please provide valid email",
		},
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Please provide password"],
		select: true,
	},
	lastName: {
		type: String,
		trim: true,
		default: "lastName ",
	},
	location: {
		type: String,
		trim: true,
		default: "my city",
	},
});
//ung dung cua UserSchema > hash password
UserSchema.pre("save", async function () {
	const salt = await bcrypt.genSaltSync(10);
	const hashPassword = await bcrypt.hashSync("B4c0//", salt);
	this.password = hashPassword;
});

//phuong thuc lay token
UserSchema.methods.createJWT = function () {
	return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_LIFETIME,
	});
};

//check password
UserSchema.method.comparePassword = async function(candidatePassword){
	const isMatch = await bcrypt.compare(candidatePassword, this.password)
	return isMatch;
}
export default mongoose.model("User", UserSchema);
