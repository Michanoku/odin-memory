import { useState, useEffect, useRef } from "react";

function Card({id, name, cry, sprite, types}) {

  return (
    <div className="card">
      <img src={sprite}></img>
    </div>
  )
}

// The gameboard that handles card creation and such 
export default function GameBoard({ gameState, numberOfCards, onReady }) {
  const [pokeList, setPokeList] = useState([]);

  // This is used to only fetch from the API once even in DEV with strict mode
  const hasFetched = useRef(false)
  useEffect(() => {
    // If we loaded, return
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchPokemon();
    }
    // The linter does not like this empty array, but i dont want to silence it for now
  }, []);

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
    onReady();
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

  return (
    <div className="gameBoard">
      {pokeList.map(pokemon => 
        <Card key={pokemon.id} id={pokemon.id} name={pokemon.name} cry={pokemon.cry} sprite={pokemon.sprite} types={pokemon.types}/>
      )}
    </div>
  )
}
