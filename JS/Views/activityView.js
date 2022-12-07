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
const assignToCategoryBtn = document.getElementById("assignToCategoryBtn");
const categoryDropdown = document.getElementById("categorySelectMainView");
const activityCategorySubtitle = document.getElementById(
  "activityCategorySubtitle"
);
const categoryDropdownDiv = document.getElementById(
  "categorySelectMainViewDiv"
);

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
    this._clearCategoryViewBtns();
    this._render(activities, idToEdit);

    // Insert todays date
    this._setDate(dateOnActivityForm);

    sessionLength.focus();

    // Creating dropdown menu of variations
    this._variationMenuGenerator(activities, idToEdit);
  }

  _showActivityCategory(activities, idToEdit) {
    const activityCategory = activities[idToEdit].category;
    categoryDropdown.style.display = "none";
    activityCategorySubtitle.innerHTML = "";
    if (activityCategory) {
      activityCategorySubtitle.innerHTML = `${activityCategory}`;
      activityCategorySubtitle.style.display = "inline-block";
    } else {
      assignToCategoryBtn.style.display = "block";
      activityCategorySubtitle.style.display = "none";
    }
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

  _displayCategoryDropMenu(categories) {
    createCategoryBtn.style.display = "none";
    categoryDropdownDiv.style.display = "block";
    categoryDropdown.style.display = "inline-block";
    categoryDropdown.size = categories.length > 5 ? 3 : categories.length;
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
    categoryDropdown.size = 0;
    activityCategorySubtitle.style.display = "none";
    assignToCategoryBtn.style.display = "none";
    this._hideCategoryInputDiv();
  }
}

export default new ActivityView();
