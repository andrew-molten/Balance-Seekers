import View from "./view.js";
import config from "../config.js";

const logSessionForm = document.getElementById("logSessionForm");
const variationSelectDiv = document.getElementById("variationSelectDiv");
const variationSelect = document.getElementById("variationSelect");
const dateOnActivityForm = document.getElementById("dateOnForm");
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

  _setDate(field) {
    let dateNow = new Date();
    field.valueAsDate = new Date(
      Date.UTC(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate())
    );
  }

  _openActivityView(e, activities, idToEdit) {
    logSessionForm.style.display = "block";
    addActivityBox.style.display = "none";
    activityHeading.style.display = "block";
    this._render(activities, idToEdit);

    // Insert todays date
    this._setDate(dateOnActivityForm);

    sessionLength.focus();

    // Creating dropdown menu of variations
    this._variationMenuGenerator(activities, idToEdit);
  }

  _variationMenuGenerator(activities, idToEdit) {
    if (activities[idToEdit].variation.length === 0) {
      variationSelectDiv.innerHTML = "";
    } else {
      let options = "";

      activities[idToEdit].variation
        ? activities[idToEdit].variation.forEach((element) => {
            const currentOption = `<option value="${element.type}">${element.type}</option>`;
            options = options + currentOption;
          })
        : "";
      variationSelect.insertAdjacentHTML("afterbegin", options);
    }
  }

  _generateSession() {
    const date = new Date(dateOnActivityForm.value).toLocaleDateString(
      config.locale
    );
    const length = sessionLength.value;
    const sets = sessionSets.value;
    const notes = sessionNotes.value;
    const currentVariation = variationSelect.value;
    const session = {
      date: date,
      length: length,
      sets: sets,
      notes: notes,
      variation: currentVariation,
    };
    return session;
  }

  _closeLogSessionForm(e) {
    logSessionForm.style.display = "none";
    addActivityBox.style.display = "block";
    activityHeading.style.display = "none";
    // Clear Values
    activityHeading.innerHTML = "";
    dateOnActivityForm.value = "";
    sessionLength.value = "";
    sessionSets.value = "";
    sessionNotes.value = "";
    variationSelect.innerHTML = "";
    this._hideCategoryInputDiv();
  }
}

export default new ActivityView();
