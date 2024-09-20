import React, { useState, useEffect } from 'react';
import './styles.css';

interface Song {
  composer: string;
  title: string;
  music_link: string;
  image_link: string;
  fun_fact: string;
}

const classicalMusicQuiz: Song[] = [
  // ... (keep the existing song data)
];

export default function App(): JSX.Element {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [score, setScore] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerChecked, setAnswerChecked] = useState<boolean>(false);
  const [usedSongs, setUsedSongs] = useState<Song[]>([]);
  const [audioError, setAudioError] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    startNewGame();
  }, []);

  // ... (keep the existing functions)

  const uniqueComposers = Array.from(new Set(classicalMusicQuiz.map(song => song.composer)));

  return (
    <div className="App">
      <h1>🎵 Music Quiz 🎹</h1>
      
      <div className="game-area">
        <div className="main-content">
          <div className="question-area">
            <p className="medium-font">Who composed this music?</p>
            <p className="score">Score: {score}/{totalQuestions}</p>
          </div>
          
          {currentSong && (
            <div className="music-player">
              {audioError ? (
                <p className="error">Error loading audio. Please try again.</p>
              ) : (
                <audio 
                  controls 
                  src={currentSong.music_link}
                  onError={handleAudioError}
                ></audio>
              )}
            </div>
          )}
          
          <div className="options">
            {uniqueComposers.map((composer, index) => {
              const composerData = classicalMusicQuiz.find(song => song.composer === composer);
              return (
                <label key={index} className={`option ${selectedOption === composer ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="composer"
                    value={composer}
                    checked={selectedOption === composer}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  <img src={composerData?.image_link} alt={composer} className="composer-image" />
                  <span className="composer-name">{composer}</span>
                </label>
              );
            })}
          </div>
          
          <div className="button-group">
            <button onClick={checkAnswer} disabled={!selectedOption || answerChecked} className="primary-btn">Check Answer</button>
            <button onClick={nextQuestion} disabled={!answerChecked} className="secondary-btn">Next Question</button>
            <button onClick={startNewGame} className="tertiary-btn">Start New Game</button>
          </div>
          
          {answerChecked && currentSong && (
            <div className="feedback-area">
              <p className="medium-font">Title: {currentSong.title}</p>
              {selectedOption === currentSong.composer ? (
                <p className="success">Correct! 🎉</p>
              ) : (
                <p className="error">Oops! The correct answer was {currentSong.composer}.</p>
              )}
              <p className="info">Fun Fact: {currentSong.fun_fact}</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Game Over!</h2>
            <p>Your final score: {score}/{totalQuestions}</p>
            <button onClick={startNewGame} className="primary-btn">Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}
