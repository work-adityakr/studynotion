const mongoose = require("mongoose");

exports.connect = () => {
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connection Success"))
  .catch((err) => console.log("DB Connection Failed", err));
};
