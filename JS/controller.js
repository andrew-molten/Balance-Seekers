import model from "./model.js";
import mainView from "./views/mainView.js";
import config from "./config.js";

import workoutView from "./views/workoutView.js";
// Issue that I was having is that making the class is fine but then you still need to call the class into being i.e - const view = new View(), which can then be exported and called at the same time or called after importing.

const activityInput = document.querySelector(".add__activity__input");
const addButton = document.querySelector(".add__btn");
const addActivity = document.querySelector("add__activity");
const clearButton = document.querySelector(".clear_btn");
const activitiesDisplay = document.querySelector(".activities_display");
const upButton = document.querySelector(".push_up_btn");
const downButton = document.querySelector(".push_down_btn");
const closeForm = document.querySelector(".close_session_form");
const submitFormBtn = document.querySelector(".submit_session_form");
const deleteActivityBtn = document.querySelector(".delete_activity_btn");
const sessionDate = document.querySelector(".date_form_input");
const sessionLength = document.querySelector(".length_form_input");
const sessionSets = document.querySelector(".sets_form_input");
const sessionNotes = document.querySelector(".notes_form_input");
const addSubBtn = document.querySelector(".add_sub_btn");
// const workoutViewBtn = document.querySelector(".workout_view_btn");

let IdToEdit;

class App {
  touchstartX = 0;
  touchendX = 0;
  touchstartY = 0;
  touchendY = 0;
  swipeDirection;

  constructor() {
    // this.reset();
    this.init();
    // Event Handlers
    addButton.addEventListener("click", this._processActivity.bind(this));
    // workoutViewBtn.addEventListener("click", (e) => {
    //   e.preventDefault();
    //   workoutView._render(model.activities);
    // });

    activitiesDisplay.addEventListener("touchstart", (e) => {
      this._setIdToEdit(e);
      this.touchstartX = e.changedTouches[0].screenX;
      this.touchstartY = e.changedTouches[0].screenY;
    });
    activitiesDisplay.addEventListener("touchend", (e) => {
      this.touchendX = e.changedTouches[0].screenX;
      this.touchendY = e.changedTouches[0].screenY;
      this.handleswipe();
      if (this.swipeDirection === "left") {
        model._moveActivityUpOrDown(e, "down", IdToEdit);
        this._storeIDAndRender();
      }
      if (this.swipeDirection === "right") {
        this._addSubItem(e);
      }
      if (this.swipeDirection === "up") {
        console.log("You swiped up");
      }
      if (this.swipeDirection === "down") {
        console.log("You swiped down");
      }
      this.swipeDirection = "";
    });

    // Need to implement a double tap for this
    // activitiesDisplay.addEventListener("dblclick", (e) => {
    //   this._setIdToEdit(e)
    //   console.log("doubleclick");
    //   this._addSubItem(e);
    // });

    activitiesDisplay.addEventListener("click", (e) => {
      e.preventDefault();
      // Guard clauses to stop logSession Form if variation text box exists or button is pressed
      if (
        document.querySelector(".add_sub_act_input") ||
        e.target.classList.contains("add_sub_act_btn")
      )
        return;

      mainView._openLogSessionForm(e, model.activities, IdToEdit);

      // if (e.target.closest(".push_up_btn")) {
      //   model._moveActivityUpOrDown(e, "up");
      // }
      // if (e.target.closest(".push_down_btn")) {
      //   model._moveActivityUpOrDown(e, "down");
      // }
      // if (e.target.closest(".delete_btn")) {
      //   this._deleteActivity(e);
      // }
      // if (e.target.closest(".log_session_btn")) {
      //   this._openLogSessionForm(e);
      // }
      // if (e.target.closest(".add_sub_btn")) {
      //   this._addSubItem(e);
      // }
    });

    closeForm.addEventListener("click", mainView._closeLogSessionForm());
    submitFormBtn.addEventListener("click", (e) => this._submitForm(e));
    deleteActivityBtn.addEventListener("click", (e) => this._deleteActivity(e));
  }

  //controller.js:106 Uncaught TypeError: Cannot read properties of null (reading 'id')
  _setIdToEdit(e) {
    IdToEdit = +e.target.closest(".activity_item").id.slice(2);
  }

  // switchToWorkoutView() {
  //   workoutView._render(model.activities);
  // }

  // Processing Activity
  _processActivity(e) {
    e.preventDefault();
    if (!activityInput.value) return;

    const activity = activityInput.value;

    mainView._clearInputField();
    model.createActivity(activity);
    this._storeIDAndRender();
  }

  _storeIDAndRender() {
    model.setIDs(model.activities);
    model.setLocalStorage();
    mainView._render(model.activities);
  }

  _deleteActivity(e) {
    e.preventDefault();
    const deleteID = IdToEdit;
    const element = model.activities[deleteID];
    model.deletedActivities.push(element);
    model.activities.splice(deleteID, 1);
    this._storeIDAndRender();
  }

  _addSubItem(e) {
    // Guard clause to check for any other text boxes
    if (document.querySelector(".add_sub_act_input")) {
      const existingVariationInputBox =
        document.querySelector(".add_sub_act_input");
      existingVariationInputBox.parentElement.innerHTML = "";
    }

    const subCat = document.getElementById(`id${IdToEdit}`).lastElementChild;

    subCat.insertAdjacentHTML(
      "afterbegin",
      `<div class="add_sub_input_container">
      <input
          type="text"
          class="add_sub_act_input"
          placeholder="add a sub activity"
        />
        <button class="btn add_sub_act_btn">Add</button>
          </div>`
    );

    const subActAddBtn = document.querySelector(".add_sub_act_btn");
    subActAddBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this._processAddSub(e, IdToEdit);
    });
  }

  _processAddSub(e, itemID) {
    const addSubInput = document.querySelector(".add_sub_act_input");
    const addSubInputContainer = document.querySelector(
      ".add_sub_input_container"
    );
    const input = addSubInput.value;
    if (input === "") return;
    model.activities[itemID].variation.push({ type: input });
    addSubInputContainer.innerHTML = "";
    this._storeIDAndRender();
  }

  _submitForm(e) {
    e.preventDefault();
    const date = new Date(sessionDate.value).toLocaleDateString(config.locale);
    const length = sessionLength.value;
    const sets = sessionSets.value;
    const notes = sessionNotes.value;
    const id = IdToEdit;
    const element = model.activities[id];
    const activitiesLength = model.activities.length;
    sessionDate.value = "";
    sessionLength.value = "";
    const session = {
      date: date,
      length: length,
      sets: sets,
      notes: notes,
    };
    element.sessions.push(session);
    model._moveActivity(id, activitiesLength - 1, element);
    this._storeIDAndRender();
    mainView._closeLogSessionForm();
  }

  handleswipe() {
    const diffX = this.touchstartX - this.touchendX;
    const diffY = this.touchstartY - this.touchendY;

    if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10)
      return (this.swipeDirection = "");

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Sliding horizontally
      if (diffX > 0) return (this.swipeDirection = "left");
      if (diffX < 0) return (this.swipeDirection = "right");
    }

    if (Math.abs(diffY) > Math.abs(diffX)) {
      // Sliding vertically
      if (diffY < 0) return (this.swipeDirection = "down");
      if (diffY > 0) return (this.swipeDirection = "up");
    }
  }
  init() {
    model.getLocalStorage();
    console.log(model.activities);
    mainView._render(model.activities);
  }
}

const app = new App();
