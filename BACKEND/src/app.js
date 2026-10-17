import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config/config.js";




//  ------ import Routes --------
import authRouter from "./routes/auth.routes.js";
import userRouter  from "./routes/user.routes.js";
import attendanceRouter from "./routes/attendance.routes.js";
import leaveRouter from "./routes/leave.routes.js"
import bonusRouter from "./routes/bonus.routes.js"
import advanceRouter from "./routes/advance.routes.js"
import salaryRouter from "./routes/salary.routes.js"
import paymentRouter from "./routes/payment.routes.js"
import performanceRouter from "./routes/performance.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

// ------ default middlewares --------
const app = express();
app.use(cors({ origin: config.CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(morgan("dev"));



// ------  Routes    --------
app.use("/api/auth",authRouter);
app.use("/api/users",userRouter);
app.use("/api/attendance",attendanceRouter)
app.use("/api/leaves",leaveRouter)
app.use("/api/bonuses",bonusRouter)
app.use("/api/advances",advanceRouter)
app.use("/api/salaries",salaryRouter)
app.use("/api/payments",paymentRouter);
app.use("/api/performances",performanceRouter);
app.use("/api/dashboard",dashboardRouter);



app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: "Server error" });
});

export default app;