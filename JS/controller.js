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
        this._moveActivity(e, "up");
      }
      if (e.target.closest(".push_down_btn")) {
        this._moveActivity(e, "down");
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
    const subCategories = [];

    activity.variation
      ? activity.variation.forEach((element) =>
          subCategories.push(`<li class="sub_item">${input}</li>`)
        )
      : "";
    console.log(activity, subCategories);

    return `
    <li class="activity_item" id="id${id}">${activity.activity} 
        <button class="btn log_session_btn">🔥</button>
        <button class="btn push_up_btn">↑</button>
        <button class="btn push_down_btn">↓</button>
        <button class="btn edit_btn">Edit</button>
        <button class="btn delete_btn">Delete</button>
        <button class="btn add_sub_btn">+</button>
        <ol class="sub_category">
        ${``}
        </ol>
        </li>
    `;
  }
  // ${!activity.activity.variation}

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
      id = id + 1;
      el.id = id;
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
  _moveActivity(e, direction) {
    // console.log(e.target.parentElement.parentElement);
    const movingID = +e.target.closest(".activity_item").id.slice(2);
    if (movingID === this.#activities.length - 1 && direction === "up") return;
    if (movingID === 0 && direction === "down") return;

    const newID = direction === "up" ? movingID + 1 : movingID - 1;
    const element = this.#activities[movingID];

    this.#activities.splice(movingID, 1);
    this.#activities.splice(newID, 0, element);
    this._storeIDAndRender();
  }

  _deleteActivity(e) {
    const deleteID = +e.target.closest(".activity_item").id.slice(2);
    const element = this.#activities[deleteID];
    this.#deletedActivities.push(element);
    this.#activities.splice(deleteID, 1);
    this._storeIDAndRender();
  }

  _addSubItem(e) {
    // const parentActivity = e.target.closest(".activity_item");
    const itemID = +e.target.closest(".activity_item").id.slice(2);
    console.log(e, itemID);
    const subCat = document.getElementById(`id${itemID}`).lastElementChild;
    // console.log(parentActivity);
    // Need to:
    // Guard clause to check for any other text boxes

    // insert text box below activity item,
    subCat.insertAdjacentHTML(
      "afterbegin",
      `<input
          type="text"
          class="add_sub_act_input"
          placeholder="add a sub activity"
        />
        <button class="btn add_sub_act_btn">
          <span>Add</span>`
    );
    const subActAddBtn = document.querySelector(".add_sub_act_btn");

    subActAddBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this._processAddSub(e, subCat, itemID);
    });
    // Process submitting newSubItem with this:
    //  `<li class="sub_item">Legs</li>
    //  <li class="sub_item">Arms</li>`
  }

  _processAddSub(e, subCat, itemID) {
    const addSubInput = document.querySelector(".add_sub_act_input");
    const input = addSubInput.value;
    if (input === "") return;
    this.#activities[itemID].variation.push({ type: input });
    this._setLocalStorage();
    // NEED TO assign id's, and fix the HTML insertion so it happens with the render
    // Possibly see if these functions can be simplified
    subCat.innerHTML = "";
    subCat.insertAdjacentHTML(
      "beforebegin",
      `<li class="sub_item">${input}</li>`
    );
    console.log(this.#activities);
  }

  _submitForm(e) {
    e.preventDefault();
    const date = sessionDate.value;
    const length = sessionLength.value;
    const id = logSessionToID;
    sessionDate.value = "";
    sessionLength.value = "";
    const session = [date, length];
    this.#activities[id].sessions.push(session);
    this._setLocalStorage();
    console.log(this.#activities[id]);
    // document.querySelector(".log_session_form").style.display = "hidden";
    // console.log("Anyone there");
    this._closeLogSessionForm();
    // ^^^^ Why is this function not working
    // console.log(id);
  }
}

const app = new App();
