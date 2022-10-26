const activityInput = document.querySelector(".add__activity__input");
const addButton = document.querySelector(".add__btn");
const addActivity = document.querySelector("add__activity");
const clearButton = document.querySelector(".clear_btn");
const activitiesDisplay = document.querySelector(".activities_display");
const upButton = document.querySelector(".push_up_btn");
const downButton = document.querySelector(".push_down_btn");
const closeForm = document.querySelector(".close_session_form");
const submitFormBtn = document.querySelector(".submit_session_form");
const sessionDate = document.querySelector(".date_form_input");
const sessionLength = document.querySelector(".length_form_input");
const addSubBtn = document.querySelector(".add_sub_btn");

// let id = -1;
// class Activity {
//   constructor(activityName) {
//     this.activityName = activityName;
//     console.log(this.activityName);
//   }
// }
let logSessionToID;

class App {
  #parentEl = document.querySelector(".add__activity");
  #activities = [];
  #deletedActivities = [];

  constructor() {
    // this.reset();
    this.init();
    // Event Handlers
    addButton.addEventListener("click", this._processActivity.bind(this));

    activitiesDisplay.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.closest(".push_up_btn")) {
        this._moveActivityUpOrDown(e, "up");
      }
      if (e.target.closest(".push_down_btn")) {
        this._moveActivityUpOrDown(e, "down");
      }
      if (e.target.closest(".delete_btn")) {
        this._deleteActivity(e);
      }
      if (e.target.closest(".log_session_btn")) {
        this._openLogSessionForm(e);
      }
      if (e.target.closest(".add_sub_btn")) {
        this._addSubItem(e);
      }
      // if (e.target.closest(".add_sub_act_btn")) {
      //   this._processAddSub(e);
      // }
    });
    closeForm.addEventListener("click", this._closeLogSessionForm());
    submitFormBtn.addEventListener("click", (e) => this._submitForm(e));
  }

  // Processing Activity
  _processActivity(e) {
    e.preventDefault();
    if (!activityInput.value) return;

    const activity = activityInput.value;

    this.#clearInputField();
    this._createActivity(activity);
    this._storeIDAndRender();
  }

  _generateMarkup(activity, id) {
    let subCategories = "";

    /////////////////////////////////////////////// NEED TO MAKE THE BELOW CODE WORK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    activity.variation
      ? activity.variation.forEach(
          (element) =>
            (subCategories =
              subCategories + `<li class="sub_item">${element.type}</li>`)
        )
      : "";

    return `
    <li class="activity_item" id="id${id}">${activity.activity} 
        <button class="btn log_session_btn">🔥</button>
        <button class="btn push_up_btn">↑</button>
        <button class="btn push_down_btn">↓</button>
        <button class="btn edit_btn">Edit</button>
        <button class="btn delete_btn">Delete</button>
        <button class="btn add_sub_btn">+</button>
        <ol class="sub_category">
        ${subCategories}
        </ol>
        </li>
    `;
  }

  _storeIDAndRender() {
    this._setIDs(this.#activities);
    this._setLocalStorage();
    this._render(this.#activities);
  }

  _createActivity(input) {
    this.#activities.push({
      activity: input,
      sessions: [],
      variation: [],
    });
    this._setLocalStorage();
  }

  _setIDs(arr) {
    let id = -1;

    arr.forEach((el) => {
      let variationIdDecimal = -1;
      id = id + 1;
      el.id = id;
      if (el.variation.length === 0) return;
      // Set ID for any variations
      el.variation.forEach((va) => {
        variationIdDecimal = variationIdDecimal + 1;
        const variationID = id + "." + variationIdDecimal;
        va.id = +variationID;
      });
    });
  }

  _render(activities) {
    activitiesDisplay.innerHTML = "";
    activities.forEach((activity) => {
      const markup = this._generateMarkup(activity, activity.id);
      activitiesDisplay.insertAdjacentHTML("afterbegin", markup);
    });
  }

  #clearInputField() {
    this.#parentEl.querySelector(".add__activity__input").value = "";
  }

  //Storage
  _setLocalStorage() {
    localStorage.setItem("activities", JSON.stringify(this.#activities));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("activities"));

    if (!data) return;

    this.#activities = data;

    this._render(this.#activities);
  }

  reset() {
    localStorage.removeItem("activities");
  }

  init() {
    this._getLocalStorage();
    console.log(this.#activities);
  }

  _openLogSessionForm(e) {
    console.log(e.target.closest(".activity_item"));
    logSessionToID = +e.target.closest(".activity_item").id.slice(2);
    document.getElementById("logSessionForm").style.display = "block";
    document.getElementById("logSessionForm").style.visibility = "visible";
  }

  _closeLogSessionForm(e) {
    document.getElementById("logSessionForm").style.visibility = "hidden";
  }

  // Adjusting Activities
  _moveActivityUpOrDown(e, direction) {
    // console.log(e.target.parentElement.parentElement);
    const movingID = +e.target.closest(".activity_item").id.slice(2);
    if (movingID === this.#activities.length - 1 && direction === "up") return;
    if (movingID === 0 && direction === "down") return;

    const newID = direction === "up" ? movingID + 1 : movingID - 1;
    const element = this.#activities[movingID];

    this._moveActivity(movingID, newID, element);
    this._storeIDAndRender();
  }

  _moveActivity(oldID, newID, element) {
    this.#activities.splice(oldID, 1);
    this.#activities.splice(newID, 0, element);
  }

  _deleteActivity(e) {
    const deleteID = +e.target.closest(".activity_item").id.slice(2);
    const element = this.#activities[deleteID];
    this.#deletedActivities.push(element);
    this.#activities.splice(deleteID, 1);
    this._storeIDAndRender();
  }

  _addSubItem(e) {
    // Guard clause to check for any other text boxes
    if (document.querySelector(".add_sub_act_input")) {
      const existingVariationInputBox =
        document.querySelector(".add_sub_act_input");
      existingVariationInputBox.parentElement.innerHTML = "";
    }

    const itemID = +e.target.closest(".activity_item").id.slice(2);
    const subCat = document.getElementById(`id${itemID}`).lastElementChild;

    subCat.insertAdjacentHTML(
      "afterbegin",
      `<div>
      <input
          type="text"
          class="add_sub_act_input"
          placeholder="add a sub activity"
        />
        <button class="btn add_sub_act_btn">
          <span>Add</span>
          </div>`
    );
    const subActAddBtn = document.querySelector(".add_sub_act_btn");

    subActAddBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this._processAddSub(e, subCat, itemID);
    });
  }

  _processAddSub(e, subCat, itemID) {
    const addSubInput = document.querySelector(".add_sub_act_input");
    const input = addSubInput.value;
    if (input === "") return;
    this.#activities[itemID].variation.push({ type: input });
    this._storeIDAndRender();
  }

  _submitForm(e) {
    e.preventDefault();
    const date = sessionDate.value;
    const length = sessionLength.value;
    const id = logSessionToID;
    const element = this.#activities[id];
    sessionDate.value = "";
    sessionLength.value = "";
    const session = {
      date: date,
      length: length,
    };
    element.sessions.push(session);
    this._moveActivity(id, 0, element);
    this._storeIDAndRender();
    console.log(this.#activities[id]);
    this._closeLogSessionForm();
  }
}

const app = new App();
