import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Express server running on http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error("Unable to start server:", error);
    process.exit(1);
  });
