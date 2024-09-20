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
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  const getNewSong = (): Song | null => {
    const availableSongs = classicalMusicQuiz.filter(song => !usedSongs.includes(song));
    if (availableSongs.length === 0) {
      return null;
    }
    const newSong = availableSongs[Math.floor(Math.random() * availableSongs.length)];
    setUsedSongs([...usedSongs, newSong]);
    return newSong;
  };

  const startNewGame = (): void => {
    const newSong = getNewSong();
    setCurrentSong(newSong);
    setScore(0);
    setTotalQuestions(0);
    setQuestionNumber(1);
    setSelectedOption(null);
    setAnswerChecked(false);
    setUsedSongs(newSong ? [newSong] : []);
    setAudioError(false);
    setShowModal(false);
    setShowFeedback(false);
  };

  const checkAnswer = (): void => {
    if (!answerChecked && selectedOption) {
      setAnswerChecked(true);
      setTotalQuestions(totalQuestions + 1);
      if (selectedOption === currentSong?.composer) {
        setScore(score + 1);
      }
      setShowFeedback(true);
    }
  };

  const nextQuestion = (): void => {
    const newSong = getNewSong();
    if (newSong) {
      setCurrentSong(newSong);
      setAnswerChecked(false);
      setQuestionNumber(questionNumber + 1);
      setSelectedOption(null);
      setAudioError(false);
      setShowFeedback(false);
    } else {
      setShowModal(true);
    }
  };

  const handleAudioError = () => {
    setAudioError(true);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const uniqueComposers = Array.from(new Set(classicalMusicQuiz.map(song => song.composer)));

  return (
    <div className="App">
      <h1>🎵 Music Quiz 🎹</h1>
      
      <div className="game-area">
        <div className="main-content">
          <div className="question-score">
            <p className="medium-font">Who composed this music?</p>
            <p className="medium-font">Score: {score}/{totalQuestions}</p>
          </div>
          
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
                  {selectedOption === composer && !answerChecked && (
                    <button onClick={checkAnswer} className="confirm-button">Confirm</button>
                  )}
                </label>
              );
            })}
          </div>
          
          <div className="control-area">
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
            
            <div className="button-group">
              <button onClick={startNewGame}>Start New Game</button>
            </div>
          </div>
        </div>
      </div>

      {showFeedback && currentSong && (
        <div className="modal-overlay">
          <div className="modal-content feedback-modal">
            <h2>{selectedOption === currentSong.composer ? "Correct! 🎉" : "Oops!"}</h2>
            <p>The correct answer was {currentSong.composer}.</p>
            <p className="medium-font">Title: {currentSong.title}</p>
            <p className="info">Fun Fact: {currentSong.fun_fact}</p>
            <button onClick={nextQuestion}>Next Question</button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Game Over!</h2>
            <p>Your final score: {score}/{totalQuestions}</p>
            <button onClick={startNewGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}
