import View from "./view";

const categoryViewDiv = document.getElementById("categoryViewDiv");
const showAllActivitiesBtn = document.getElementById("showAllActivitiesBtn");

class CategoryView extends View {
  _openCategoryView(category, activities) {
    // categoryViewDiv.innerHTML = "";
    this._clear();
    const markup = this._generateMarkup(category.activities);
    this._insertMarkup(markup);
    this._displayShowAllActivitiesBtn();
  }
  _generateMarkup(activities) {
    let markup = `<ol class="category_view_list">`;

    // Create markup for each activity and add it to markup string
    activities.forEach((activity) => {
      const individualMarkup = this._activityMarkup(activity, activity.sortId);
      markup = markup + individualMarkup;
    });
    markup = markup + "</ol>";
    return markup;
  }

  _displayShowAllActivitiesBtn() {
    const showAllActivitiesBtn = document.getElementById(
      "showAllActivitiesBtn"
    );
    showAllActivitiesBtn.style.display = "block";
  }

  _activityMarkup(activity, sortId) {
    const variations = this._variationsMarkup(activity);
    // const activitySessionsLength = activity.sessions.length;
    let lastWorkoutDate = "";
    // if (activitySessionsLength > 0) {
    //   lastWorkoutDate = activity.sessions[activitySessionsLength - 1].date;
    // }
    // ${
    //   activitySessionsLength > 0
    //     ? `<span class="lastWorkout">${lastWorkoutDate}</span>`
    //     : ""
    // }

    return `
    <li class="activity_item" id="sortId${sortId}" data-sortId="${sortId}" data-actualId="${activity.id}">${activity.activity} 
        <ol class="sub_category">
        ${variations}
        </ol>
        </li>
    `;
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
    categoryViewDiv.insertAdjacentHTML("afterbegin", markup);
  }
}

export default new CategoryView();
