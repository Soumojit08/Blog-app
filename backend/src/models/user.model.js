import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
      default: null, // Will store the path to the uploaded photo
    },
    bio: {
      type: String,
      maxlength: 300,
    },
    links: {
      type: String,
      validate: function (v) {
        return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL`,
      required: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
