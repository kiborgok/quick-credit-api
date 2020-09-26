const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("config");
const { authRoutes, loanRoutes } = require("./routes");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || config.get("MONGO_URI"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });

    console.log("MongoDB connected");

    const app = express();
    const port = process.env.PORT || config.get("PORT");

    app.disable("x-powered-by");
    app.use(express.json());
    app.use(cors({ credentials: true }));
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    const apiRouter = express.Router();
    app.use("/api/v1", apiRouter);
    apiRouter.use("/auth", authRoutes);
    apiRouter.use("/loans", loanRoutes);

    app.listen(port, () => console.log(`Listening on port ${port}`));
  } catch (err) {
    console.log(err);
  }
})();
