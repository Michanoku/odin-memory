import { useState, useEffect, useRef } from "react";

// This is the color coding used for each type
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
  fairy: "#D685AD",
};

// One card of the game
function Card({ id, name, sprite, types, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  function getStyle() {
    const { color1, color2 } = setColors();

    // Change the style for the card, background colors depend on pokemon type
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
    };
    return style;
  }

  // Set the colors of the type of the pokemon, set 2 colors if there are two types
  function setColors() {
    const color1 = typeColors[types[0]];
    const color2 =
      types.length > 1 ? typeColors[types[1]] : typeColors[types[0]];
    return { color1, color2 };
  }

  // Names of pokemon are stored in lower case in the api, so uppercase the first character
  function getName() {
    return String(name).charAt(0).toUpperCase() + String(name).slice(1);
  }

  return (
    <div
      className="card"
      id={id}
      style={getStyle()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(id)}
    >
      <img src={sprite}></img>
      <div className="name">{getName()}</div>
    </div>
  );
}

// The gameboard that handles card creation and such
export default function GameBoard({ gameId, numberOfCards, audio, onClick }) {
  // pokeList is the list resolved by the API, clickedList has the user clicked card ids
  const [masterList, setMasterList] = useState([]);
  const [pokeList, setPokeList] = useState([]);
  const [clickedList, setClickedList] = useState([]);

  // Only fetch when the gameId has changed
  const lastGameId = useRef(null);
  useEffect(() => {
    if (lastGameId.current === gameId) return;

    lastGameId.current = gameId;
    fetchPokemon();
    /* The linter wants fetchPokemon as a dependency. This quickly got out of hand with more demands
    from the linter. Since it works, I will ignore it here. Maybe someday I will have a better
    educated way of dealing with it. */
  }, [gameId]);

  // Create a map of pokemon cries to load when the list is changed
  const cryMap = useRef({});
  useEffect(() => {
    const map = {};

    pokeList.forEach((pokemon) => {
      const pokemonCry = new Audio(pokemon.cry);
      pokemonCry.preload = "auto";
      pokemonCry.volume = 0.2;
      pokemonCry.load();
      map[pokemon.id] = pokemonCry;
    });

    cryMap.current = map;
  }, [pokeList]);

  // Fetch the pokemon data from the PokéAPI
  async function fetchPokemon() {
    // Get a list of random pokemon IDs
    const idList = createIdList();
    // Check which ones have been loaded to the cache
    const { cached, uncached } = checkCache(idList);
    // Fetch uncached pokemon from the API
    const promises = uncached.map(async (pokeId) => {
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
    });
    const results = await Promise.all(promises);
    // Save new pokemon to the master list
    setMasterList((prev) => [...prev, ...results]);
    // Create the new list from cached pokemon and new results
    const newList = [...cached, ...results];
    // Set the list
    setPokeList(newList);
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

  // Don't reload already loaded Pokemon to ease load on the PokéAPI
  function checkCache(idList) {
    const cached = masterList.filter((pokemon) => idList.includes(pokemon.id));
    const uncached = idList.filter(
      (id) => !masterList.some((pokemon) => pokemon.id === id),
    );
    return { cached, uncached };
  }

  // Create the needed data from the API response data
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

  // When clicking on a card
  function clickCard(cardId) {
    // If audio isn't muted, play it
    if (audio) {
      playCry(cardId);
    }
    // Check if the card clicked was clicked before
    const success = clickedList.includes(cardId) ? false : true;
    // If not, add it to the list and shuffle the cards
    if (success) {
      setClickedList((prev) => [...prev, cardId]);
      shuffleCards();
    } else {
      // If yes, reset the list (the game is over)
      setClickedList([]);
    }
    // Report back to the app
    onClick(success);
  }

  // Play the cry for this pokemon
  function playCry(id) {
    const pokemonCry = cryMap.current[id];
    if (!pokemonCry) return;

    pokemonCry.currentTime = 0;
    pokemonCry.play().catch(() => {});
  }

  // Shuffle the cards (after each click)
  function shuffleCards() {
    setPokeList((prev) => {
      // Fisher-Yates Shuffle
      const shuffled = [...prev];
      let currentIndex = shuffled.length;

      while (currentIndex !== 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [shuffled[currentIndex], shuffled[randomIndex]] = [
          shuffled[randomIndex],
          shuffled[currentIndex],
        ];
      }

      return shuffled;
    });
  }

  return (
    <div className="gameBoard">
      {pokeList.map((pokemon) => (
        <Card
          key={pokemon.id}
          id={pokemon.id}
          name={pokemon.name}
          sprite={pokemon.sprite}
          types={pokemon.types}
          onClick={clickCard}
        />
      ))}
    </div>
  );
}
