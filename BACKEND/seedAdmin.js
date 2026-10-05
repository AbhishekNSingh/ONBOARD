import userModel from "./src/models/user.model.js";
import connectToDb from "./src/config/db.js";

await connectToDb();


const exists = await userModel.findOne({ email: "admin@company.com" });



if (exists) {
  console.log("Admin already exists");
} else {
  await userModel.create({
    name: "Admin",
    email: "admin@company.com",
    password: "admin123",
    contact: "9999999999", 
    role: "admin",
  });
  console.log("Admin created");
}

process.exit();