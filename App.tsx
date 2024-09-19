import React, { useState, useEffect, useCallback, useMemo } from "react";
import { QuizOptions } from "./components/QuizOptions";
import { Sidebar } from "./components/Sidebar";
import "./styles.css";

interface Song {
  composer: string;
  music_link: string;
  image_link: string;
  fun_fact: string;
}

const classicalMusicQuiz: Song[] = [
  {
    composer: "Wolfgang Amadeus Mozart",
    music_link:
      "https://upload.wikimedia.org/wikipedia/commons/8/82/W._A._Mozart_-_Die_Zauberfl%C3%B6te_-_02._Zu_hilfe%21_Zu_hilfe%21_%28Ferenc_Fricsay%2C_1953%29.ogg",
    image_link:
      "https://upload.wikimedia.org/wikipedia/commons/1/1e/Wolfgang-amadeus-mozart_1.jpg",
    fun_fact:
      "Mozart began composing at the age of 5 and wrote over 600 pieces of music!",
  },
  {
    composer: "Antonio Vivaldi",
    music_link:
      "https://upload.wikimedia.org/wikipedia/commons/d/d9/Vivaldi_-_Four_Seasons_1_Spring_mvt_3_Allegro_-_John_Harrison_violin.oga",
    image_link:
      "https://upload.wikimedia.org/wikipedia/commons/b/bd/Vivaldi.jpg",
    fun_fact: "Vivaldi was nicknamed 'The Red Priest' because of his red hair!",
  },
  {
    composer: "Johann Sebastian Bach",
    music_link:
      "https://upload.wikimedia.org/wikipedia/commons/4/43/JOHN_MICHEL_CELLO-J_S_BACH_CELLO_SUITE_1_in_G_Prelude.ogg",
    image_link:
      "https://upload.wikimedia.org/wikipedia/commons/6/6a/Johann_Sebastian_Bach.jpg",
    fun_fact: "Bach had 20 children and many of them became musicians too!",
  },
  {
    composer: "Frédéric Chopin",
    music_link:
      "https://raw.githubusercontent.com/mariolambe/classical-music-quiz/main/music/chopin.mp3",
    image_link:
      "https://upload.wikimedia.org/wikipedia/commons/e/e8/Frederic_Chopin_photo.jpeg",
    fun_fact:
      "Chopin's heart is buried in Warsaw, while the rest of him is buried in Paris!",
  },
];

export default function App(): JSX.Element {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [score, setScore] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [level, setLevel] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerChecked, setAnswerChecked] = useState<boolean>(false);
  const [usedSongs, setUsedSongs] = useState<Song[]>([]);

  const getNewSong = useCallback((): Song => {
    const availableSongs = classicalMusicQuiz.filter(
      (song) => !usedSongs.includes(song)
    );
    if (availableSongs.length === 0) {
      setUsedSongs([]);
      return classicalMusicQuiz[
        Math.floor(Math.random() * classicalMusicQuiz.length)
      ];
    }
    const newSong =
      availableSongs[Math.floor(Math.random() * availableSongs.length)];
    setUsedSongs((prevUsedSongs) => [...prevUsedSongs, newSong]);
    return newSong;
  }, [usedSongs]);

  const startNewGame = useCallback((): void => {
    setCurrentSong(getNewSong());
    setScore(0);
    setTotalQuestions(0);
    setQuestionNumber(1);
    setLevel(1);
    setSelectedOption(null);
    setAnswerChecked(false);
    setUsedSongs([]);
  }, [getNewSong]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const checkAnswer = useCallback((): void => {
    if (!answerChecked && selectedOption) {
      setAnswerChecked(true);
      setTotalQuestions((prev) => prev + 1);
      if (selectedOption === currentSong?.composer) {
        setScore((prev) => prev + 1);
      }
    }
  }, [answerChecked, selectedOption, currentSong]);

  const nextQuestion = useCallback((): void => {
    setCurrentSong(getNewSong());
    setAnswerChecked(false);
    setQuestionNumber((prev) => prev + 1);
    setLevel((prev) => (questionNumber % 5 === 0 ? prev + 1 : prev));
    setSelectedOption(null);
  }, [getNewSong, questionNumber]);

  const memoizedOptions = useMemo(() => classicalMusicQuiz, []);

  return (
    <div className="App">
      <h1>🎵 Music Adventure Quiz 🎹</h1>

      <div className="game-area">
        <div className="main-content">
          <p className="medium-font">
            Question {questionNumber}: Who composed this music?
          </p>

          {currentSong && (
            <audio controls src={currentSong.music_link}>
              Your browser does not support the audio element.
            </audio>
          )}

          <QuizOptions
            options={memoizedOptions}
            selectedOption={selectedOption}
            onSelect={setSelectedOption}
          />

          <div className="button-group">
            <button
              onClick={checkAnswer}
              disabled={!selectedOption || answerChecked}
            >
              Check Answer
            </button>
            <button onClick={nextQuestion} disabled={!answerChecked}>
              Next Question
            </button>
          </div>

          {answerChecked && (
            <div>
              {selectedOption === currentSong?.composer ? (
                <p className="success">Correct! 🎉</p>
              ) : (
                <p className="error">
                  Oops! The correct answer was {currentSong?.composer}.
                </p>
              )}
              <p className="info">Fun Fact: {currentSong?.fun_fact}</p>
            </div>
          )}
        </div>

        <Sidebar
          level={level}
          score={score}
          totalQuestions={totalQuestions}
          onNewGame={startNewGame}
        />
      </div>
    </div>
  );
}
