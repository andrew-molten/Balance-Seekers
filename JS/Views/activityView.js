import View from "./view.js";

const logSessionForm = document.getElementById("logSessionForm");
const variationSelectDiv = document.getElementById("variationSelectDiv");
const variationSelect = document.getElementById("variationSelect");
const sessionDate = document.querySelector(".date_form_input");
const sessionLength = document.querySelector(".length_form_input");
const sessionSets = document.querySelector(".sets_form_input");
const sessionNotes = document.querySelector(".notes_form_input");
const activityHeading = document.querySelector(".activity_heading_form");
const addActivityBox = document.querySelector(".add__activity");

class ActivityView extends View {
  _generateMarkup() {
    const markup = this._activities[this._idToEdit].activity;
    return markup;
  }

  _insertMarkup(markup) {
    activityHeading.insertAdjacentHTML("afterbegin", markup);
  }

  _openActivityView(e, activities, idToEdit) {
    logSessionForm.style.display = "block";
    addActivityBox.style.display = "none";
    this._render(activities, idToEdit);

    // Insert todays date
    document.getElementById("dateOnForm").valueAsDate = new Date();

    sessionLength.focus();

    // Creating dropdown menu of variations
    if (activities[idToEdit].variation.length === 0) {
      variationSelectDiv.innerHTML = "";
    } else {
      let variations = "";

      activities[idToEdit].variation
        ? activities[idToEdit].variation.forEach(
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
    logSessionForm.style.display = "none";
    addActivityBox.style.display = "block";
    // Clear Values
    activityHeading.innerHTML = "";
    sessionDate.value = "";
    sessionLength.value = "";
    sessionSets.value = "";
    sessionNotes.value = "";
  }
}

export default new ActivityView();
