import express from 'express';
const router = express.Router();

let workouts = [
  { id: 1, name: 'Pushups', duration: 10 },
];

// GET all
router.get('/', (req, res) => {
  res.json(workouts);
});

// POST new
router.post('/', (req, res) => {
  const { name, duration } = req.body;
  const newWorkout = { id: Date.now(), name, duration: parseInt(duration) };
  workouts.unshift(newWorkout); // Add to beginning of array
  res.status(201).json(newWorkout);
});

// DELETE one (End Workout)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  workouts = workouts.filter(w => w.id !== parseInt(id));
  res.status(200).json({ message: 'Workout ended' });
});

// DELETE all (Clear All)
router.delete('/', (req, res) => {
  workouts = [];
  res.status(200).json({ message: 'All workouts cleared' });
});

export default router;