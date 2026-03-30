function Counter({score, icon}) {
    const emoji = icon === "high" ? "🏆" : "🎯";
    return (
        <div className="scoreTracker">
            <div className="icon">{emoji}</div>
            <div className="score">{score}</div>
        </div>
    )
}

export default function ScoreBoard({highScore, currentScore}) {
    return <div className="scoreBoard">
        <Counter score={highScore} icon="high"></Counter>
        <Counter score={currentScore} icon="score"></Counter>
    </div>
};