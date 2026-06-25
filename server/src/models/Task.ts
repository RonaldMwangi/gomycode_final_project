import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const taskSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    deadline: { type: Date },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'completed'],
      default: 'todo',
      index: true,
    },
    priority: { type: Number, min: 1, max: 10 },
  },
  { timestamps: true }
)

taskSchema.index({ userId: 1, status: 1 })
taskSchema.index({ userId: 1, deadline: 1 })

export type TaskDocument = InferSchemaType<typeof taskSchema>

// NOTE: Collection name can be controlled by the `model` name in Mongoose.
// We keep model name explicit so collections don't collide with other apps.
export const Task = mongoose.model('tasks_app_final_tasks', taskSchema)


