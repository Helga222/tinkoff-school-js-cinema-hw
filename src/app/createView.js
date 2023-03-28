import { clearNode } from "../helpers/clearContainer.js";
import { getDeclension } from "../helpers/getDeclension.js";

const dMovies = getDeclension("фильм", "фильма", "фильмов");

export const createView = () => {
  const resultsContainer = document.querySelector(".grid-container");
  const resultsHeading = document.querySelector(".results__text");
  const resultsCross = document.querySelector(".search__cross");

  const searchTags = document.querySelector(".history");

  const searchForm = document.querySelector(".search__string");
  const searchInput = document.querySelector(".search__input");

  let timer = 0;
  let loader;

  const createLoader = () => {
    let div = document.createElement("div");
    let img = document.createElement("img");
    img.src = "images/loop-loading-loading.gif";
    div.appendChild(img);
    div.classList.add("results__loader-visible");
    resultsHeading.parentNode.insertBefore(div, resultsContainer);
    return div;
  };

  const renderList = (results) => {
    if (results.length === 0) {
      loader?.classList.replace(
        "results__loader-invisible",
        "results__loader-visible"
      );
    } else
      loader?.classList.replace(
        "results__loader-visible",
        "results__loader-invisible"
      );

    const list = document.createDocumentFragment();

    results.forEach((movieData) => {
      const movie = document.createElement("movie-card");

      movie.poster = movieData.poster;
      movie.title = movieData.title;
      movie.year = movieData.year;
      movie.link = movieData.link;

      list.appendChild(movie);
    });

    clearNode(resultsContainer);
    resultsContainer.appendChild(list);
  };

  const renderSearchList = (terms) => {
    const list = document.createDocumentFragment();

    terms.forEach((movie) => {
      const tag = document.createElement("a");
      tag.classList.add("history__item");
      tag.href = `/?search=${movie}`;
      tag.textContent = movie;
      tag.dataset.movie = movie;

      list.appendChild(tag);
    });

    clearNode(searchTags);
    searchTags.appendChild(list);
  };

  resultsCross.addEventListener("click", () => {
    searchInput.value = "";
  });

  const renderCount = (count) => {
    resultsHeading.textContent = `Нашли ${count} ${dMovies(count)}`;
  };

  const renderError = (error) => {
    resultsHeading.textContent = error;
    loader.classList.replace(
      "results__loader-visible",
      "results__loader-invisible"
    );
  };

  // Events
  const onSearchSubmit = (_listener) => {
    const listener = (event) => {
      event.preventDefault();
      if (!loader) {
        loader = createLoader();
      }
      _listener(searchInput.value);
      searchInput.value = "";
    };

    searchForm.addEventListener("submit", listener);

    return () => searchForm.removeEventListener("submit", listener);
  };

  const onTagClick = (_listener) => {
    const listener = (event) => {
      event.preventDefault();

      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        if (event.target.classList.contains("history__item")) {
          _listener(event.target.dataset.movie);
        }
      }, 250);
    };

    searchTags.addEventListener("click", listener);
    return () => searchTags.removeEventListener("click", listener);
  };

  const onTagRemove = (_listener) => {
    const listener = (event) => {
      event.preventDefault();
      clearTimeout(timer);
      if (event.target.classList.contains("history__item")) {
        _listener(event.target.dataset.movie);
      }
    };

    searchTags.addEventListener("dblclick", listener);
    return () => searchTags.removeEventListener("dblclick", listener);
  };

  return {
    renderList,
    renderCount,
    renderError,
    renderSearchList,
    onSearchSubmit,
    onTagClick,
    onTagRemove,
  };
};
