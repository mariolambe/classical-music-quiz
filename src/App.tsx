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
    music_link: "https://upload.wikimedia.org/wikipedia/commons/8/82/W._A._Mozart_-_Die_Zauberfl%C3%B6te_-_02._Zu_hilfe%21_Zu_hilfe%21_%28Ferenc_Fricsay%2C_1953%29.ogg",
    image_link: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Wolfgang-amadeus-mozart_1.jpg",
    fun_fact: "Mozart began composing at the age of 5 and wrote over 600 pieces of music!"
  },
  {
    composer: "Wolfgang Amadeus Mozart",
    title: "Eine kleine Nachtmusik",
    music_link: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Mozart_-_Eine_kleine_Nachtmusik_-_1._Allegro.ogg",
    image_link: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Wolfgang-amadeus-mozart_1.jpg",
    fun_fact: "Mozart had perfect pitch and could write entire compositions in his head before putting them to paper!"
  },
  {
    composer: "Antonio Vivaldi",
    title: "The Four Seasons - Spring",
    music_link: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Vivaldi_-_Four_Seasons_1_Spring_mvt_3_Allegro_-_John_Harrison_violin.oga",
    image_link: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Vivaldi.jpg",
    fun_fact: "Vivaldi was nicknamed 'The Red Priest' because of his red hair!"
  },
  {
    composer: "Antonio Vivaldi",
    title: "The Four Seasons - Summer",
    music_link: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Vivaldi_-_Four_Seasons_2_Summer_mvt_3_Presto_-_John_Harrison_violin.oga3",
    image_link: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Vivaldi.jpg",
    fun_fact: "Vivaldi wrote over 500 concertos, with about 230 of them for violin!"
  },
  {
    composer: "Johann Sebastian Bach",
    title: "Cello Suite No. 1 in G",
    music_link: "https://upload.wikimedia.org/wikipedia/commons/4/43/JOHN_MICHEL_CELLO-J_S_BACH_CELLO_SUITE_1_in_G_Prelude.ogg",
    image_link: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Johann_Sebastian_Bach.jpg",
    fun_fact: "Bach had 20 children and many of them became musicians too!"
  },
  {
    composer: "Johann Sebastian Bach",
    title: "Toccata and Fugue in D minor",
    music_link: "https://upload.wikimedia.org/wikipedia/commons/b/bf/BWV_565_-_Toccata_et_Fuga_-_Dmin_-_Diego_Canale.ogg",
    image_link: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Johann_Sebastian_Bach.jpg",
    fun_fact: "Bach's music was largely forgotten for nearly a century after his death until it was revived by Felix Mendelssohn!"
  },
  {
    composer: "Giuseppe Verdi",
    title: "Il trovatore - Tacea la notte placida",
    music_link: "https://upload.wikimedia.org/wikipedia/commons/d/dc/ICBSA_Verdi_-_Il_trovatore%2C_Tacea_la_notte_placida.ogg",
    image_link: "https://upload.wikimedia.org/wikipedia/commons/1/19/Verdi_by_Giovanni_Boldini.jpg",
    fun_fact: "Giuseppe Verdi was so passionate about gardening that he once said if he hadn't been a composer, he would have been a farmer!"
  },
  {
    composer: "Frédéric Chopin",
    title: "Nocturne in E-flat major, Op. 9, No. 2",
    music_link: "https://raw.githubusercontent.com/mariolambe/classical-music-quiz/main/music/chopin.mp3",
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
  };

  const uniqueComposers = Array.from(new Set(classicalMusicQuiz.map(song => song.composer)));

  return (
    <div className="App">
      <h1>🎵 Music Adventure Quiz 🎹</h1>
      
      <div className="game-area">
        <div className="main-content">
          <p className="medium-font">Question {questionNumber}: Who composed this music?</p>
          <p className="medium-font">Score: {score}/{totalQuestions}</p>
          
          {currentSong && (
            <>
              <p className="medium-font">Title: {currentSong.title}</p>
              <audio controls src={currentSong.music_link}></audio>
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
          
          {answerChecked && (
            <div>
              {selectedOption === currentSong?.composer ? (
                <p className="success">Correct! 🎉</p>
              ) : (
                <p className="error">Oops! The correct answer was {currentSong?.composer}.</p>
              )}
              <p className="info">Fun Fact: {currentSong?.fun_fact}</p>

              {currentSong?.image_link && (
                <img src={currentSong.image_link} alt={currentSong.composer} style={{ width: '200px', marginTop: '20px' }} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
