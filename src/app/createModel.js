import { createStore } from "../helpers/createStore.js";
import { mapMovie } from "../helpers/mapMovie.js";

export const createModel = () =>
  createStore(
    {
      isLoading: false,
      count: 0,
      results: [],
      error: false,
      searches: [
        "star wars",
        "kung fury",
        "back to the future",
        "matrix",
        "terminator",
      ],
    },
    (store) => ({
      search: async (currentState, searchTerm) => {
        searchTerm = searchTerm.toLowerCase();
        store.setState({
          count: 0,
          results: [],
          error: false,
          searches: [searchTerm].concat(
            currentState.searches.filter((term) => term !== searchTerm)
          ),
        });

        let storedData = JSON.parse(window.localStorage.getItem(searchTerm));
        if (storedData) {
          return storedData.error
            ? { error: storedData.error }
            : {
                count: storedData.count,
                results: storedData.results,
              };
        }
        try {
          const data = await fetch(
            `https://www.omdbapi.com/?type=movie&apikey=12d877ac&s=${searchTerm}`
          ).then((r) => r.json());

          const resultObject =
            data.Response === "True"
              ? {
                  count: data.totalResults,
                  results: data.Search.map(mapMovie),
                }
              : { error: data.Error };
          window.localStorage.setItem(searchTerm, JSON.stringify(resultObject));
          return resultObject;
        } catch (error) {
          return { error };
        }
      },
      removeTag: (currentState, searchTerm) => {
        return {
          searches: currentState.searches.filter((term) => term !== searchTerm),
        };
      },
    })
  );
