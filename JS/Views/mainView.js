import View from "./view.js";

const variationSelectDiv = document.getElementById("variationSelectDiv");
const variationSelect = document.getElementById("variationSelect");
const sessionDate = document.querySelector(".date_form_input");
const sessionLength = document.querySelector(".length_form_input");
const sessionSets = document.querySelector(".sets_form_input");
const sessionNotes = document.querySelector(".notes_form_input");

class MainView extends View {
  _generateMarkup() {
    let markup = "";

    // Create markup for each activity and add it to markup string
    this._activities.forEach((activity) => {
      const individualMarkup = this._activityMarkup(activity, activity.id);
      markup = markup + individualMarkup;
    });
    return markup;
  }

  _activityMarkup(activity, id) {
    const variations = this._variationsMarkup(activity);
    const activityLength = activity.sessions.length;
    let lastWorkoutDate = "";
    if (activityLength > 0) {
      lastWorkoutDate = activity.sessions[activityLength - 1].date;
      console.log(lastWorkoutDate);
    }

    return `
    <li class="activity_item" id="id${id}">${activity.activity} ${
      activityLength > 0
        ? `<span class="lastWorkout">Last Workout ${lastWorkoutDate}</span>`
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

  _openLogSessionForm(e, activities, IdToEdit) {
    document.getElementById("logSessionForm").style.display = "block";
    document.getElementById("logSessionForm").style.visibility = "visible";
    document.getElementById("dateOnForm").valueAsDate = new Date();

    // Creating dropdown menu of variations
    if (activities[IdToEdit].variation.length === 0) {
      variationSelectDiv.innerHTML = "";
    } else {
      let variations = "";

      activities[IdToEdit].variation
        ? activities[IdToEdit].variation.forEach(
            (element) =>
              (variations =
                variations +
                `<option value="${element.type}">${element.type}</option>`)
          )
        : "";
      variationSelect.insertAdjacentHTML("afterbegin", variations);
    }
  }

  _closeLogSessionForm(e) {
    document.getElementById("logSessionForm").style.visibility = "hidden";
    sessionLength.value = "";
    sessionSets.value = "";
    sessionNotes.value = "";
  }
}

export default new MainView();

// Buttons that were on the elements but have been replaced with swipes
// <button class="btn log_session_btn">🔥</button>
// <button class="btn push_up_btn">↑</button>
// <button class="btn push_down_btn">↓</button>
// <button class="btn edit_btn">Edit</button>
// <button class="btn add_sub_btn">+</button>
