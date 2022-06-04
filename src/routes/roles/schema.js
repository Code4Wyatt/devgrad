import mongoose from "mongoose"

const { Schema, model } = mongoose

const RoleSchema = new Schema({
    jobTitle: { type: String, required: true },
    positionType: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    salary: { type: String, required: true },
    applicants: { type: Array, default: [] }
}, {
    timestamps: true,
})

export default model("Role", RoleSchema)
