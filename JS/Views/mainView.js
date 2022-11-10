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

  _openLogSessionForm(e, activities, IdToEdit) {
    const logSessionForm = document.getElementById("logSessionForm");
    const thisActivity = activities[IdToEdit].activity;
    // Create Activity heading
    logSessionForm.insertAdjacentHTML(
      "afterbegin",
      `<h3 class="activity_heading_form">${thisActivity}<h3>`
    );
    // Make form visible
    logSessionForm.style.display = "block";
    logSessionForm.style.visibility = "visible";
    // Insert todays date
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
    // Hide Form
    document.getElementById("logSessionForm").style.visibility = "hidden";
    // Remove old activity heading
    document.querySelector(".activity_heading_form")
      ? (document.querySelector(".activity_heading_form").innerHTML = "")
      : "";
    // Clear Values
    sessionLength.value = "";
    sessionSets.value = "";
    sessionNotes.value = "";
  }
}

export default new MainView();
