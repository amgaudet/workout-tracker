const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

const PORT = process.env.PORT || 3000;

const db = require('./models');

const app = express();

app.use(logger('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout",
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

//get all work outs for index.html
app.get('/api/workouts', (req, res) => {
  db.Workout.aggregate([
    {
      //Shows total weight and Duration for work out
      $addFields: {
        totalWeight: { $sum: '$exercises.weight' },
        totalDuration: { $sum: '$exercises.duration' }
      }
    },
    { $sort: { day: 1 } }
  ], (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

//get work outs from past week
app.get('/api/workouts/range', (req, res) => {
  db.Workout.aggregate([
    {
      //Shows total weight and Duration for work out
      $addFields: {
        totalWeight: { $sum: '$exercises.weight' },
        totalDuration: { $sum: '$exercises.duration' }
      }
    },
    { $sort: { day: -1 } }, { $limit: 7 }
  ], (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

//adds exercise to current work out
app.put('/api/workouts/:id', (req, res) => {
  db.Workout.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { exercises: req.body } },
    { new: true },
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
});

//Creates new workout
app.post('/api/workouts', (req, res) => {
  db.Workout.create(req.body, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

app.get('/exercise', (req, res) => {
  res.sendFile(path.join(__dirname, './public/exercise.html'));
});

app.get('/stats', (req, res) => {
  res.sendFile(path.join(__dirname, './public/stats.html'));
});

app.listen(PORT, () => {
  //change log before pushing to server
  console.log(`App running at Port: ${PORT}`);
});