const mongoose = require('mongoose');
const { Schema } = mongoose;

const WorkoutSchema = new Schema({
  day: {
    type: Date,
    default: Date.now
  },
  exercises: [{
    type: Schema.Types.ObjectId,
    ref: 'Exercise'
  }]
});

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;