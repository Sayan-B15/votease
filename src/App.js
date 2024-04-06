import React, { useState } from 'react';
import './App.css';

function App() {
  const [numCandidates, setNumCandidates] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleNumCandidatesChange = (event) => {
    const input = event.target.value.trim(); // Trim whitespace
    setNumCandidates(input); // Store input as string
    if (input === '' || (input.length > 0 && !isNaN(input) && parseInt(input) >= 0)) {
      // Check if input is empty or a valid non-negative integer
      const num = parseInt(input);
      setNumCandidates(num.toString()); // Convert back to string to maintain user input
      if (num === 0) {
        // Reset candidates and votes if the number of candidates is 0
        setCandidates([]);
        setVotes([]);
      } else {
        // Update candidates and votes based on the entered number
        setCandidates(Array(num).fill(''));
        setVotes(Array(num).fill(0));
      }
    }
  };

  const handleCandidateNameChange = (index, event) => {
    const newCandidates = [...candidates];
    newCandidates[index] = event.target.value;
    setCandidates(newCandidates);
  };

  const handleVote = (index) => {
    const audio = new Audio('https://soundbible.com/grab.php?id=1242&type=wav');
    audio.play();
    const newVotes = [...votes];
    newVotes[index] += 1;
    setVotes(newVotes);
  };

  const showResult = () => {
    setShowResults(true);
  };

  const calculateTotalVotes = () => {
    return votes.reduce((total, current) => total + current, 0);
  };

  const findWinner = () => {
    let maxVotes = Math.max(...votes);
    let winnerIndex = votes.indexOf(maxVotes);
    return candidates[winnerIndex];
  };

  return (
    <div className="App">
      <h1>Elect Ease</h1>
      {!showResults ? (
        <>
          <label>
            Enter number of candidates:
            <input type="text" value={numCandidates} onChange={handleNumCandidatesChange} />
          </label>
          {numCandidates !== '' && parseInt(numCandidates) > 0 && (
            <>
              {candidates.map((candidate, index) => (
                <div key={index} className="candidate">
                  <label>
                    Candidate {index + 1}:
                    <input type="text" value={candidate} onChange={(e) => handleCandidateNameChange(index, e)} />
                  </label>
                  <button onClick={() => handleVote(index)} className="voteButton">Vote</button>
                </div>
              ))}
              <br />
              <button onClick={showResult} className="showResultButton">Result</button>
            </>
          )}
        </>
      ) : (
        <div>
          <h2>Results:</h2>
          <ul>
            {candidates.map((candidate, index) => (
              <li key={index}>
                {candidate} - Votes: {votes[index]}
              </li>
            ))}
          </ul>
          <h2>Total Votes: {calculateTotalVotes()}</h2>
          <h2>Winner: {findWinner()}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
