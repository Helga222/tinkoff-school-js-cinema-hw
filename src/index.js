import { createModel } from "./app/createModel.js";
import { createViewModel } from "./app/createViewModel.js";
import { createView } from "./app/createView.js";

import "./components/currentYear.js";
import "./components/movieCard.js";

const model = createModel();
let currentState = JSON.parse(window.localStorage.getItem("model"));

if (currentState) {
  model.setState(currentState);
}

const view = createView();
const viewModel = createViewModel(model);

viewModel.bindCount(view.renderCount);
viewModel.bindError(view.renderError);
viewModel.bindResults(view.renderList);
viewModel.bindSearches(view.renderSearchList);

view.onSearchSubmit(viewModel.handleSearchSubmit);
view.onTagClick(viewModel.handleTagClick);
view.onTagRemove(viewModel.handleTagRemove);

viewModel.init();

model.subscribe(console.log);
