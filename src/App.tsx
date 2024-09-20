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
  {
    composer: "Wolfgang Amadeus Mozart",
    title: "Die Zauberflöte",
    music_link: "https://raw.githubusercontent.com/mariolambe/classical-music-quiz/main/src/music/mozart.mp3",
    image_link: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Wolfgang-amadeus-mozart_1.jpg",
    fun_fact: "Mozart began composing at the age of 5 and wrote over 600 pieces of music!"
  },
  {
    composer: "Antonio Vivaldi",
    title: "The Four Seasons - Summer",
    music_link: "https://raw.githubusercontent.com/mariolambe/classical-music-quiz/main/src/music/vivaldi.mp3",
    image_link: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Vivaldi.jpg",
    fun_fact: "Vivaldi wrote over 500 concertos, with about 230 of them for violin!"
  },
  {
    composer: "Johann Sebastian Bach",
    title: "Cello Suite No. 1 in G",
    music_link: "https://raw.githubusercontent.com/mariolambe/classical-music-quiz/main/src/music/bach.mp3",
    image_link: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Johann_Sebastian_Bach.jpg",
    fun_fact: "Bach had 20 children and many of them became musicians too!"
  },
  {
    composer: "Giuseppe Verdi",
    title: "Requiem",
    music_link: "https://raw.githubusercontent.com/mariolambe/classical-music-quiz/main/src/music/verdi.mp3",
    image_link: "https://upload.wikimedia.org/wikipedia/commons/1/19/Verdi_by_Giovanni_Boldini.jpg",
    fun_fact: "Giuseppe Verdi was so passionate about gardening that he once said if he hadn't been a composer, he would have been a farmer!"
  },
  {
    composer: "Frédéric Chopin",
    title: "Nocturne in E-flat major, Op. 9, No. 2",
    music_link: "https://raw.githubusercontent.com/mariolambe/classical-music-quiz/main/src/music/chopin.mp3",
    image_link: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Frederic_Chopin_photo.jpeg",
    fun_fact: "Chopin's heart is buried in Warsaw, while the rest of him is buried in Paris!"
  }
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

  useEffect(() => {
    startNewGame();
  }, []);

  const getNewSong = (): Song => {
    const availableSongs = classicalMusicQuiz.filter(song => !usedSongs.includes(song));
    if (availableSongs.length === 0) {
      setUsedSongs([]);
      return classicalMusicQuiz[Math.floor(Math.random() * classicalMusicQuiz.length)];
    }
    const newSong = availableSongs[Math.floor(Math.random() * availableSongs.length)];
    setUsedSongs([...usedSongs, newSong]);
    return newSong;
  };

  const startNewGame = (): void => {
    setCurrentSong(getNewSong());
    setScore(0);
    setTotalQuestions(0);
    setQuestionNumber(1);
    setSelectedOption(null);
    setAnswerChecked(false);
    setUsedSongs([]);
    setAudioError(false);
  };

  const checkAnswer = (): void => {
    if (!answerChecked && selectedOption) {
      setAnswerChecked(true);
      setTotalQuestions(totalQuestions + 1);
      if (selectedOption === currentSong?.composer) {
        setScore(score + 1);
      }
    }
  };

  const nextQuestion = (): void => {
    setCurrentSong(getNewSong());
    setAnswerChecked(false);
    setQuestionNumber(questionNumber + 1);
    setSelectedOption(null);
    setAudioError(false);
  };

  const handleAudioError = () => {
    setAudioError(true);
  };

  const uniqueComposers = Array.from(new Set(classicalMusicQuiz.map(song => song.composer)));

  return (
    <div className="App">
      <h1>🎵 Music Quiz 🎹</h1>
      
      <div className="game-area">
        <div className="main-content">
          <p className="medium-font">Question {questionNumber}: Who composed this music?</p>
          <p className="medium-font">Score: {score}/{totalQuestions}</p>
          
          {currentSong && (
            <>
              {audioError ? (
                <p className="error">Error loading audio. Please try again.</p>
              ) : (
                <audio 
                  controls 
                  src={currentSong.music_link}
                  onError={handleAudioError}
                ></audio>
              )}
            </>
          )}
          
          <div className="options">
            {uniqueComposers.map((composer, index) => (
              <label key={index} className={`option ${selectedOption === composer ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="composer"
                  value={composer}
                  checked={selectedOption === composer}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                {composer}
              </label>
            ))}
          </div>
          
          <div className="button-group">
            <button onClick={checkAnswer} disabled={!selectedOption || answerChecked}>Check Answer</button>
            <button onClick={nextQuestion} disabled={!answerChecked}>Next Question</button>
            <button onClick={startNewGame}>Start New Game</button>
          </div>
          
          {answerChecked && currentSong && (
            <div>
              <p className="medium-font">Title: {currentSong.title}</p>
              {selectedOption === currentSong.composer ? (
                <p className="success">Correct! 🎉</p>
              ) : (
                <p className="error">Oops! The correct answer was {currentSong.composer}.</p>
              )}
              <p className="info">Fun Fact: {currentSong.fun_fact}</p>

              {currentSong.image_link && (
                <img src={currentSong.image_link} alt={currentSong.composer} style={{ width: '200px', marginTop: '20px' }} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
