
import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    default: null,
    unique: true,
    required: true
  }
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

export default Admin;
