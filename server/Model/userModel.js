import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
    },
    address: { type: String },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    role: {
      type: String,
      enum: [
        "admin",
        "senior_developer",
        "junior_developer",
        "HR",
        "unauthorized_user",
      ],
      default: "unauthorized_user",
    },
    profilePicture: {
      public_id: {
        type: String,
        default: ""
      },
      url: {
        type: String,
        default: "https://i.ibb.co/4pDNDk1/avatar.png"
      },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    biography: { type: String }, 
    socials: {
      twitter: { type: String },
      linkedin: { type: String },
      github: { type: String },
    }, 
    locations: [String],
    skills: {
      type: [String],
      enum: [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Vue",
        "Angular",
        "Next.js",
        "Node.js",
        "Express",
        "Python",
        "Django",
        "Flask",
        "Java",
        "Spring",
        "SQL",
        "MongoDB",
        "Git",
        "Jenkins",
        "Docker",
        "Jest",
        "Cypress",
        "Figma",
        "Adobe XD",
        "Tailwind CSS",
        "Bootstrap",
        "Azure",
        "GCP",
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
