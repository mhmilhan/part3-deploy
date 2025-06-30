const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3, // 3.19: Name must be at least 3 characters long
    required: true,
    unique: true, // Add unique constraint for name for future robustness (though 3.14 ignores it, 3.15 needs it)
  },
  number: {
    type: String,
    minlength: 8, // 3.20: Number must be at least 8 characters long
    required: true,
    validate: {
      // 3.20: Custom validator for number format
      validator: function (v) {
        // Must be formed of two parts separated by -, first part 2 or 3 numbers, second part consists of numbers
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!
      A phone number must be formed of two parts separated by -, the first part has two or three numbers and the second part also consists of numbers.
      Example: 09-1234556 or 040-22334455`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
