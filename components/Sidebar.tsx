// src/components/Sidebar.tsx

import React from "react";

interface SidebarProps {
  level: number;
  score: number;
  totalQuestions: number;
  onNewGame: () => void;
}

export const Sidebar: React.FC<SidebarProps> = React.memo(
  ({ level, score, totalQuestions, onNewGame }) => (
    <div className="sidebar">
      <h2>Game Info</h2>
      <p className="big-font">Level: {level}</p>
      <p className="big-font">
        Score: {score}/{totalQuestions}
      </p>
      <div className="progress-bar">
        <div
          className="progress"
          style={{
            width: `${(score / Math.max(totalQuestions, 1)) * 100}%`,
          }}
        ></div>
      </div>
      <button onClick={onNewGame}>Start New Game</button>
    </div>
  )
);
