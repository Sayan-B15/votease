import React, { useState, useEffect } from 'react';
import './App.css';
import coinSound from './coin.mp3';

function App() {
  const [numCandidates, setNumCandidates] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [votingDisabled, setVotingDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (votingDisabled) {
      const timeout = setTimeout(() => {
        setVotingDisabled(false);
        setTimeLeft(0);
      }, 10000);
      const interval = setInterval(() => {
        setTimeLeft(prevTimeLeft => (prevTimeLeft > 0 ? prevTimeLeft - 1 : 0));
      }, 1000);
      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
  }, [votingDisabled]);

  const handleNumCandidatesChange = (event) => {
    const input = event.target.value.trim();
    setNumCandidates(input);
    if (input === '' || (input.length > 0 && !isNaN(input) && parseInt(input) >= 0)) {
      const num = parseInt(input);
      setNumCandidates(num.toString());
      if (num === 0) {
        setCandidates([]);
        setVotes([]);
      } else {
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
    if (!votingDisabled) {
      const audio = new Audio(coinSound);
      audio.play();
      const newVotes = [...votes];
      newVotes[index] += 1;
      setVotes(newVotes);
      setVotingDisabled(true);
      setTimeLeft(10);
    }
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
                  <button onClick={() => handleVote(index)} className="voteButton" disabled={votingDisabled}>Vote</button>
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
      {votingDisabled && (
        <div>
          <p>Time left until you can vote again: {timeLeft} seconds</p>
        </div>
      )}
    </div>
  );
}

export default App;
