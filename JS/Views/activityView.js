import View from "./view.js";

class ActivityView extends View {
  _generateMarkup() {
    const markup = `
    <h3 class="activity_heading_form">${
      this._activities[this._idToEdit].activity
    }</h3>
    
    <h4>Date</h4>
    <input
      type="date"
      class="date_form_input"
      id="dateOnForm"
    />
    <h4>Session length</h4>
    <input
      type="number"
      class="length_form_input"
      placeholder=""
    />
    <h4>Sets</h4>
    <input
      type="number"
      class="sets_form_input"
      placeholder=""
    />
    <h4>Notes</h4>
    <input
      type="text"
      class="notes_form_input"
      placeholder=""
    />
    <div id="variationSelectDiv">
    <h4>Variation</h4>
    <select name="variationSelect" id="variationSelect">
    
    </select>
    </div>



    <button class="btn submit_log_btn"
      <span>Submit</span>
    </button>
    <button class="btn close_activity_view_btn"
      <span>Close</span>
    </button>
    <button class="btn delete_activity_btn">Delete activity</button>
  </form>
</div>`;
    return markup;
  }

  _insertMarkup(markup) {
    this._parentElement.parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _openActivityView(e, activities, idToEdit) {
    this._render(activities, idToEdit);
    const variationSelect = document.getElementById("variationSelect");
    const variationSelectDiv = document.getElementById("variationSelectDiv");
    const closeBtn = document.querySelector(".close_activity_view_btn");

    // Insert todays date
    document.getElementById("dateOnForm").valueAsDate = new Date();

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
      closeBtn.addEventListener("click", (e) => console.log("closing"));
    }
  }

  _closeLogSessionForm(e) {
    // Clear Values
    sessionLength.value = "";
    sessionSets.value = "";
    sessionNotes.value = "";
  }
}

export default new ActivityView();
