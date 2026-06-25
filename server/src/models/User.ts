import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const userSchema = new Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
)

export type UserDocument = InferSchemaType<typeof userSchema>

// NOTE: Collection name can be controlled by the `model` name in Mongoose.
// We keep model name explicit so collections don't collide with other apps.
export const User = mongoose.model('tasks_app_final_users', userSchema)



