import { useState } from 'react';
import ScoreBoard from './components/ScoreBoard.jsx'
import GameBoard from './components/GameBoard.jsx'
import titleImg from './assets/title.png';
import './styles/index.css'
import './styles/GameBoard.css'

const numberOfCards = 12;

function App() {
  const [highScore, setHighScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [gameState, setGameState] = useState("start")

  function startGame() {
    setGameState("running");
  }

  function scoring(success) {
    if (success) {
      setCurrentScore(score => score + 1);
    } else {
      if (currentScore > highScore) {
        setHighScore(currentScore);
      }
      setCurrentScore(0);
    }
  }

  return (
    <>
    <header>
      <div className="title">
        <img src={titleImg} width="529" height="130"/>
      </div>
      <ScoreBoard highScore={highScore} currentScore={currentScore}/>
      <div className="explanation"></div>
    </header>
    <main>
      <GameBoard gameState={gameState} numberOfCards={numberOfCards} onReady={startGame}/>
    </main>
    </>
  )
}

export default App
