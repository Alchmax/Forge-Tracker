import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // ---------------------------------------------------------
  // 1. State Management
  // ---------------------------------------------------------
  const [workouts, setWorkouts] = useState([]);
  const [formData, setFormData] = useState({ name: '', duration: '' });
  const [loading, setLoading] = useState(false);

  // Get API URL from Environment Variables
  const API_URL = import.meta.env.VITE_API_URL;

  // ---------------------------------------------------------
  // 2. API Communication Functions
  // ---------------------------------------------------------
  
  // Fetch all workouts
  const fetchWorkouts = async () => {
    try {
      const response = await fetch(`${API_URL}/workouts`);
      const data = await response.json();
      setWorkouts(data);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Add a new workout
  const handleAddWorkout = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.duration) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newEntry = await response.json();
        setWorkouts([newEntry, ...workouts]); // Update state immediately
        setFormData({ name: '', duration: '' }); // Reset form
      }
    } catch (error) {
      console.error("Error adding workout:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a specific workout (End Workout)
  const handleEndWorkout = async (id) => {
    try {
      const response = await fetch(`${API_URL}/workouts/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setWorkouts(workouts.filter((workout) => workout.id !== id));
      }
    } catch (error) {
      console.error("Error ending workout:", error);
    }
  };

  // Delete all workouts (Clear All)
  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear your entire history?")) return;
    
    try {
      const response = await fetch(`${API_URL}/workouts`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setWorkouts([]);
      }
    } catch (error) {
      console.error("Error clearing workouts:", error);
    }
  };

  // ---------------------------------------------------------
  // 3. UI Rendering
  // ---------------------------------------------------------
  return (
    <div className="app-wrapper">
      <div className="container">
        
        <header className="main-header">
          <h1>Forge Tracker</h1>
          <p>Precision logging for your daily gains.</p>
        </header>

        <section className="form-section">
          <form onSubmit={handleAddWorkout} className="workout-form">
            <div className="input-group">
              <label>Exercise Name</label>
              <input
                type="text"
                placeholder="e.g., Deadlift"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label>Duration (Minutes)</label>
              <input
                type="number"
                placeholder="0"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="add-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Add Session'}
            </button>
          </form>
        </section>

        <section className="list-section">
          <div className="list-header">
            <h2>Recent Activity</h2>
            {workouts.length > 0 && (
              <button onClick={handleClearAll} className="clear-btn">
                Clear All
              </button>
            )}
          </div>

          <div className="workout-list">
            {workouts.length > 0 ? (
              workouts.map((workout) => (
                <div key={workout.id} className="workout-card">
                  <div className="card-content">
                    <h3>{workout.name}</h3>
                    <p>
                      ⏱ <span className="highlight">{workout.duration} mins</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => handleEndWorkout(workout.id)} 
                    className="end-btn"
                    title="Finish and remove this workout"
                  >
                    End Workout
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No activity recorded. Start your first session!</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

export default App;