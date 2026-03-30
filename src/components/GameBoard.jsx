import { useState, useEffect, useRef } from "react";

const typeColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD"
};

function Card({id, name, cry, sprite, types, onClick}) {
  const [isHovered, setIsHovered] = useState(false);

  function setColors() {
    const color1 = typeColors[types[0]];
    const color2 = types.length > 1 ? typeColors[types[1]] : typeColors[types[0]];
    return { color1, color2 }
  }

  function getStyle() {
    const { color1, color2 } = setColors();
    const style = {
      background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)) padding-box, linear-gradient(45deg, ${color1} 0%, ${color2} 100%) padding-box, linear-gradient(45deg, ${color1} 0%, ${color2} 100%) border-box`,
      transform: isHovered ? "scale(1.03)" : "scale(1)",
      boxShadow: isHovered
      ? `
        0 10px 25px rgba(0,0,0,0.6),
        0 0 18px ${color1}AA,
        0 0 30px ${color2}66
      `
      : "none",
    }
    return style;
  }

  function getName() {
    return String(name).charAt(0).toUpperCase() + String(name).slice(1);
  }

  function cardClicked() {
    const audio = new Audio(cry);
    audio.play();
    onClick(id);
  }

  return (
    <div 
      className="card"
      id={id} 
      style={getStyle()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => cardClicked()}
    >
      <img src={sprite}></img>
      <div className="name">{getName()}</div>
    </div>
  )
}

// The gameboard that handles card creation and such 
export default function GameBoard({ gameId, numberOfCards, onClick }) {
  const [pokeList, setPokeList] = useState([]);
  const [clickedList, setClickedList] = useState([]);

  // Only fetch when the gameId has changed
  const lastGameId = useRef(null);
  useEffect(() => {
    if (lastGameId.current === gameId) return;

    lastGameId.current = gameId;
    fetchPokemon();
  }, [gameId]);

  async function fetchPokemon() {
    const idList = createIdList();
    const promises = idList.map(async pokeId => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokeId}`,
        );
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        return createPokeData(result);
      } catch (error) {
        console.error(error.message);
      }
    })
    const results = await Promise.all(promises);
    setPokeList(results);
  }

  // Make a list of Pokemon IDs to fetch from the API
  function createIdList() {
    let idList = [];
    while (idList.length < numberOfCards) {
      const newId = Math.floor(Math.random() * 151 + 1);
      if (!idList.includes(newId)) {
        idList.push(newId);
      }
    }
    return idList;
  }

  function createPokeData(data) {
    const pokemon = {
      id: data.id,
      name: data.name,
      cry: data.cries.latest,
      sprite: data.sprites.front_default,
      types: [],
    };
    for (const pokeType of data.types) {
      pokemon.types.push(pokeType.type.name);
    }
    return pokemon;
  }

  function clickCard(cardId) {
    const success = clickedList.includes(cardId) ? false : true;
    if (success) {
      setClickedList(prev => [...prev, cardId]);
      shuffleCards();
    } else {
      setClickedList([]);
    }
    onClick(success);
  }

  function shuffleCards() {
    setPokeList(prev => {
      // Fisher-Yates Shuffle
      const shuffled = [...prev];
      let currentIndex = shuffled.length;

      while (currentIndex !== 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [shuffled[currentIndex], shuffled[randomIndex]] = [
          shuffled[randomIndex],
          shuffled[currentIndex]
        ];
      }

      return shuffled;
    });
  }

  return (
    <div className="gameBoard">
      {pokeList.map(pokemon => 
        <Card key={pokemon.id} id={pokemon.id} name={pokemon.name} cry={pokemon.cry} sprite={pokemon.sprite} types={pokemon.types} onClick={clickCard}/>
      )}
    </div>
  )
}
