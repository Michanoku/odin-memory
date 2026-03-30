// A counter keeps track of a score
function Counter({ score, children }) {
  return (
    <div className="scoreTracker">
      <div className="icon">{children}</div>
      <div className="score">{score}</div>
    </div>
  );
}

// The scoreboard keeps track of high and current scores.
export default function ScoreBoard({ highScore, currentScore }) {
  return (
    <div className="scoreBoard">
      <Counter score={highScore}>🏆</Counter>
      <Counter score={currentScore}>🎯</Counter>
    </div>
  );
}
