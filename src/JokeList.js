import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

const JokeList = () => {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const numJokesToGet = 5;

  useEffect(() => {
    getJokes();
  }, []);

  const getJokes = async () => {
    try {
      let jokesList = [];
      let seenJokes = new Set();

      while (jokesList.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
        let { ...joke } = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          jokesList.push({ ...joke, votes: 0 });
        } else {
          console.log("duplicate found!");
        }
      }

      setJokes(jokesList);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const generateNewJokes = () => {
    setIsLoading(true);
    getJokes();
  };

  const vote = (id, delta) => {
    setJokes((jokesList) =>
      jokesList.map((j) =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      )
    );
  };

  const resetVotes = () => {
    setJokes((jokesList) =>
      jokesList.map((j) => ({ ...j, votes: 0 }))
    );
    // Clear local storage
    localStorage.removeItem("jokeVotes");
  };

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <i className="loading-icon fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  return (
    <div className="joke-list-container">
      <button className="action-button" onClick={generateNewJokes}>
        Get New Jokes
      </button>

      <button className="action-button reset-button" onClick={resetVotes}>
        Reset Votes
      </button>

      {sortedJokes.map((j) => (
        <Joke
          text={j.joke}
          key={j.id}
          id={j.id}
          votes={j.votes}
          vote={vote}
        />
      ))}
    </div>
  );
}

export default JokeList;


