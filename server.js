import express from "express";
import dotenv from "dotenv";
import "express-async-errors";
//import cors from "cors";
import morgan from "morgan";
const app = express();
dotenv.config();

//db
import connectDB from "./db/connect.js";

//router
import authRouter from "./routes/authRoutes.js";
import jobsRouter from "./routes/jobsRoutes.js";

//middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

//app.use(cors());
app.use(express.json());

//using morgan
if (process.env.NODE_ENV !== "production") {
	app.use(morgan("dev"));
}

app.get("/", (req, res) => {
	//throw new Error("error");
	res.send({ msg: "Welcome!" });
});
app.get("/api/v1", (req, res) => {
	//throw new Error("error");
	res.send({ msg: "API" });
});

//use router
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL);
		app.listen(port, () =>
			console.log(`Server is listening on port ${port} ...`)
		);
	} catch (error) {
		console.log(error);
	}
};

start();
