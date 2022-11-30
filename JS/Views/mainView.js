import View from "./view.js";

const categoryDropdown = document.getElementById("categorySelectMainView");
const categoryViewBtnsDiv = document.getElementById("categoryViewBtnsDiv");

class MainView extends View {
  _render(activities, idToEdit) {
    this._clear();
    this._activities = activities;
    this._idToEdit = idToEdit;
    const markup = this._generateMarkup();
    this._insertMarkup(markup);
    // this._generateCategoryTabs();
  }

  _generateMarkup() {
    let markup = "";
    // let markup = `<ol class="activities_display">`;

    // Create markup for each activity and add it to markup string
    this._activities.forEach((activity) => {
      const individualMarkup = this._activityMarkup(activity, activity.sortId);
      markup = markup + individualMarkup;
    });
    // markup = markup + "</ol>";
    return markup;
  }

  _activityMarkup(activity, sortId) {
    const variations = this._variationsMarkup(activity);
    const activitySessionsLength = activity.sessions.length;
    let lastWorkoutDate = "";
    if (activitySessionsLength > 0) {
      lastWorkoutDate = activity.sessions[activitySessionsLength - 1].date;
    }

    return `
    <li class="activity_item" id="sortId${sortId}">${activity.activity} ${
      activitySessionsLength > 0
        ? `<span class="lastWorkout">${lastWorkoutDate}</span>`
        : ""
    }
        <ol class="sub_category">
        ${variations}
        </ol>
        </li>
    `;
  }

  _generateCategoryTabs(categories) {
    categoryViewBtnsDiv.innerHTML = "";
    let markup = "";
    categories.forEach((el) => {
      const currCategory = `<button class="btn ${el.category}Btn" id="${el.category}Btn">
      <span>${el.category}</span>
      </button>`;
      markup = markup + currCategory;
    });
    markup =
      markup +
      `<button class="btn showAllActivitiesBtn" id="showAllActivitiesBtn">
    <span>All</span>
    </button>`;
    categoryViewBtnsDiv.insertAdjacentHTML("beforeend", markup);
    categoryViewBtnsDiv.style.display = "block";
    this._hideShowAllActivitiesBtn();
  }

  _variationsMarkup(activity) {
    let variationsMarkup = "";

    // Creates the markup for the subcategories
    activity.variation
      ? activity.variation.forEach(
          (element) =>
            (variationsMarkup =
              variationsMarkup + `<li class="sub_item">${element.type}</li>`)
        )
      : "";
    return variationsMarkup;
  }

  _insertMarkup(markup) {
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}

export default new MainView();
