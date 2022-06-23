import mongoose from "mongoose"

const { Schema, model } = mongoose

const RoleSchema = new Schema({
    company: { type: 'string', required: true },
    jobTitle: { type: String, required: true },
    positionType: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [{ type: String, required: true }],
    salary: { type: String },
    applicants: { type: Array, default: [] },
}, {
    timestamps: true,
})

export default model("Role", RoleSchema)
