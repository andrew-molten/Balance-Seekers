import View from "./view.js";

class MainView extends View {
  _generateMarkup() {
    let markup = "";
    // let markup = `<ol class="activities_display">`;

    // Create markup for each activity and add it to markup string
    this._activities.forEach((activity) => {
      const individualMarkup = this._activityMarkup(activity, activity.id);
      markup = markup + individualMarkup;
    });
    // markup = markup + "</ol>";
    return markup;
  }

  _activityMarkup(activity, id) {
    const variations = this._variationsMarkup(activity);
    const activitySessionsLength = activity.sessions.length;
    let lastWorkoutDate = "";
    if (activitySessionsLength > 0) {
      lastWorkoutDate = activity.sessions[activitySessionsLength - 1].date;
    }

    return `
    <li class="activity_item" id="id${id}">${activity.activity} ${
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
