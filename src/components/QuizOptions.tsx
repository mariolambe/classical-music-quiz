// src/components/QuizOptions.tsx

import React from "react";

interface Song {
  composer: string;
  music_link: string;
  image_link: string;
  fun_fact: string;
}

interface QuizOptionsProps {
  options: Song[];
  selectedOption: string | null;
  onSelect: (composer: string) => void;
}

export const QuizOptions: React.FC<QuizOptionsProps> = React.memo(
  ({ options, selectedOption, onSelect }) => (
    <div className="options">
      {options.map((song, index) => (
        <label
          key={index}
          className={`option ${
            selectedOption === song.composer ? "selected" : ""
          }`}
        >
          <input
            type="radio"
            name="composer"
            value={song.composer}
            checked={selectedOption === song.composer}
            onChange={() => onSelect(song.composer)}
          />
          {song.composer}
        </label>
      ))}
    </div>
  )
);
