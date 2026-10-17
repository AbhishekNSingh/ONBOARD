import app from "./src/app.js";
import connectToDb from "./src/config/db.js";

process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection:", err);
});

const server = async () => {
  try {
    await connectToDb();
    app.listen(3000, () => {
      console.log("Server is live on port 3000");
    });
  } catch (err) {
    console.log("Error in starting the server", err.message);
    process.exit(1);
  }
};

server();
