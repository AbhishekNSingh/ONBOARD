import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";




// import Routes
import authRouter from "./routes/auth.routes.js";
import userRouter  from "./routes/user.routes.js";
import attendanceRouter from "./routes/attendance.routes.js";
import leaveRouter from "./routes/leave.routes.js"


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(morgan("dev"));



// ROUTES
app.use("/api/auth",authRouter);
app.use("/api/users",userRouter);
app.use("/api/attendance",attendanceRouter)
app.use("/api/leaves",leaveRouter)



export default app;