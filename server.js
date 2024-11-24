const express = require("express"); // Import Express
const app = express(); // Initialize the Express application
const listController = require("./controller/listController");
const userController = require("./controller/userController");

app.use(express.json());
const PORT = process.env.PORT || 8000; // Set the port (defaults to 3000)

app.use("/list", listController);
app.use("/user", userController);

// Start the server and listen for requests

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
