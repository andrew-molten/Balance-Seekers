import View from "./view.js";

const variationSelectDiv = document.getElementById("variationSelectDiv");
const variationSelect = document.getElementById("variationSelect");
const sessionDate = document.querySelector(".date_form_input");
const sessionLength = document.querySelector(".length_form_input");
const sessionSets = document.querySelector(".sets_form_input");
const sessionNotes = document.querySelector(".notes_form_input");

let logSessionToID;

class MainView extends View {
  _generateMarkup(activity, id) {
    let subCategories = "";

    activity.variation
      ? activity.variation.forEach(
          (element) =>
            (subCategories =
              subCategories + `<li class="sub_item">${element.type}</li>`)
        )
      : "";

    return `
    <li class="activity_item" id="id${id}">${activity.activity} 
        <ol class="sub_category">
        ${subCategories}
        </ol>
        </li>
    `;
    // Buttons that were on the elements but have been replaced with swipes
    // <button class="btn log_session_btn">🔥</button>
    // <button class="btn push_up_btn">↑</button>
    // <button class="btn push_down_btn">↓</button>
    // <button class="btn edit_btn">Edit</button>
    // <button class="btn add_sub_btn">+</button>
  }

  _openLogSessionForm(e, activities) {
    console.log(e.target.closest(".activity_item"));
    logSessionToID = +e.target.closest(".activity_item").id.slice(2);
    document.getElementById("logSessionForm").style.display = "block";
    document.getElementById("logSessionForm").style.visibility = "visible";
    document.getElementById("dateOnForm").valueAsDate = new Date();

    // Creating dropdown menu of variations
    if (activities[logSessionToID].variation.length === 0) {
      variationSelectDiv.innerHTML = "";
    } else {
      let variations = "";

      activities[logSessionToID].variation
        ? activities[logSessionToID].variation.forEach(
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
