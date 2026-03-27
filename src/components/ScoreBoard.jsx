function Counter({className, score}) {
    return (
        <div className={className}>
            <div className="icon"></div>
            <div className="score">{score}</div>
        </div>
    )
}

export default function ScoreBoard({highScore, currentScore}) {
    return <div className="scoreBoard">
        <Counter className="highScore" score={highScore}></Counter>
        <Counter className="currentScore" score={currentScore}></Counter>
    </div>
};