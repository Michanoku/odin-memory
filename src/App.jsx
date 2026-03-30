import { useState } from "react";
import Options from "./components/Options.jsx";
import ScoreBoard from "./components/ScoreBoard.jsx";
import GameBoard from "./components/GameBoard.jsx";
import titleImg from "./assets/title.png";
import "./styles/index.css";
import "./styles/Options.css";
import "./styles/GameBoard.css";
import "./styles/ScoreBoard.css";

// This setting determines how many cards are used
const numberOfCards = 12;

function App() {
  // High score and current score are used for the scoreboard
  const [highScore, setHighScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  // GameID is used to signify the gameboard when a new game starts
  const [gameId, setGameId] = useState(0);
  // Audio can be muted by setting this to false
  const [audio, setAudio] = useState(true);

  // Evaluate the users click. if success is true, just raise score, else reset the game
  function scoring(success) {
    if (success) {
      setCurrentScore((score) => score + 1);
      return;
    }
    resetGame();
  }

  // Reset the game
  function resetGame() {
    // Set the current score to 0 and the highscore to the current IF highscore was beaten
    setCurrentScore((prevScore) => {
      setHighScore((prevHigh) => Math.max(prevHigh, prevScore));
      return 0;
    });
    // Set a new game ID
    setGameId((prev) => prev + 1);
  }

  // Mute or unmute audio
  function toggleAudio() {
    setAudio((prevAudio) => !prevAudio);
  }

  return (
    <>
      <header>
        {/* The upper bar has the title, explanation and option buttons as well as scoring */}
        <div className="upperBar">
          <div className="title">
            <img src={titleImg} width="529" height="130" />
            <div className="explanation">
              Click all Pokemon, but don&apos;t click the same one twice!
            </div>
          </div>
          <div className="meta">
            <Options
              audio={audio}
              onRefresh={resetGame}
              onVolume={toggleAudio}
            />
            <ScoreBoard highScore={highScore} currentScore={currentScore} />
          </div>
        </div>
      </header>
      <main>
        {/* The gameboard only has the cards used for the game */}
        <GameBoard
          gameId={gameId}
          numberOfCards={numberOfCards}
          audio={audio}
          onClick={scoring}
        />
      </main>
    </>
  );
}

export default App;
