import ScoreBoard from './components/ScoreBoard'
import './styles/index.css'
import titleImg from './assets/title.png';

function App() {
  return (
    <>
    <header>
      <div className="title">
        <img src={titleImg} width="529" height="130"/>
      </div>
      <div className="explanation"></div>
      <ScoreBoard/>
    </header>
    <main></main>
    </>
  )
}

export default App
