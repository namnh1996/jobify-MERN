import { readFile } from "fs/promises";

import dotenv from "dotenv";
dotenv.config();

import Job from "./models/job.js";
import connectDB from "./db/connect.js";

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL);
		await Job.deleteMany();

		const jsonProducts = JSON.parse(
			await readFile(new URL("./data.json", import.meta.url))
		);

		await Job.create(jsonProducts);
		console.log("Success!!!!");
		process.exit(0);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

start();
