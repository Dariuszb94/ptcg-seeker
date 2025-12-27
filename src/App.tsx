import { useState } from 'react';
import './App.css';

function App() {
  const [selectedSet, setSelectedSet] = useState('');

  // Sample Pokemon TCG sets
  const ptcgSets = [
    { id: 'base1', name: 'Base Set' },
    { id: 'base2', name: 'Jungle' },
    { id: 'base3', name: 'Fossil' },
    { id: 'base4', name: 'Team Rocket' },
    { id: 'swsh1', name: 'Sword & Shield' },
    { id: 'swsh12', name: 'Silver Tempest' },
    { id: 'sv1', name: 'Scarlet & Violet' },
    { id: 'sv6', name: 'Twilight Masquerade' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Pokemon TCG Card Selector</h1>

      <div style={{ marginTop: '2rem' }}>
        <label
          htmlFor='set-select'
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '1.1rem',
          }}
        >
          Select a Pokemon TCG Set:
        </label>
        <select
          id='set-select'
          value={selectedSet}
          onChange={(e) => setSelectedSet(e.target.value)}
          style={{
            padding: '0.5rem',
            fontSize: '1rem',
            width: '100%',
            maxWidth: '400px',
            borderRadius: '4px',
            border: '2px solid #646cff',
          }}
        >
          <option value=''>-- Choose a set --</option>
          {ptcgSets.map((set) => (
            <option key={set.id} value={set.id}>
              {set.name}
            </option>
          ))}
        </select>
      </div>

      {selectedSet && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
          }}
        >
          <h2>Selected Set:</h2>
          <p style={{ fontSize: '1.2rem', color: '#646cff' }}>
            {ptcgSets.find((set) => set.id === selectedSet)?.name}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
