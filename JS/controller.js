import * as model from "./model.js";
// import mainView from "./views/mainView.js";

import mainView from "./views/mainView.js";
// const view = new View();
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

    activitiesDisplay.addEventListener("touchstart", (e) => {
      this.touchstartX = e.changedTouches[0].screenX;
      this.touchstartY = e.changedTouches[0].screenY;
    });
    activitiesDisplay.addEventListener("touchend", (e) => {
      this.touchendX = e.changedTouches[0].screenX;
      this.touchendY = e.changedTouches[0].screenY;
      this.handleswipe();
      if (this.swipeDirection === "left") {
        this._moveActivityUpOrDown(e, "down");
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
    activitiesDisplay.addEventListener("dblclick", (e) => {
      console.log("doubleclick");
      this._addSubItem(e);
    });

    // Need to fix so that clicking in the text box brings up a keyboard rather than the logSessionForm
    activitiesDisplay.addEventListener("click", (e) => {
      if (document.querySelector(".add_sub_act_input")) return;
      e.preventDefault();

      if (e.target.closest(".add_sub_act_btn")) {
        this._processAddSub(e);
      } else {
        mainView._openLogSessionForm(e, model.activities);
      }
      // if (e.target.closest(".push_up_btn")) {
      //   this._moveActivityUpOrDown(e, "up");
      // }
      // if (e.target.closest(".push_down_btn")) {
      //   this._moveActivityUpOrDown(e, "down");
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
    submitFormBtn.addEventListener("click", (e) =>
      this._submitForm(e, mainView.logSessionToID)
    );
    deleteActivityBtn.addEventListener("click", (e) => this._deleteActivity(e));
  }

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

  // Adjusting Activities
  _moveActivityUpOrDown(e, direction) {
    // console.log(e.target.parentElement.parentElement);
    const movingID = +e.target.closest(".activity_item").id.slice(2);
    if (movingID === model.activities.length - 1 && direction === "up") return;
    if (movingID === 0 && direction === "down") return;

    const newID = direction === "up" ? movingID + 1 : movingID - 1;
    const element = model.activities[movingID];

    this._moveActivity(movingID, newID, element);
    this._storeIDAndRender();
  }

  _moveActivity(oldID, newID, element) {
    model.activities.splice(oldID, 1);
    model.activities.splice(newID, 0, element);
  }

  _deleteActivity(e) {
    const deleteID = logSessionToID;
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
      this._processAddSub(e, itemID);
    });
  }

  _processAddSub(e, itemID) {
    const addSubInput = document.querySelector(".add_sub_act_input");
    const input = addSubInput.value;
    if (input === "") return;
    model.activities[itemID].variation.push({ type: input });
    this._storeIDAndRender();
  }

  // Uncaught TypeError: Cannot read properties of undefined (reading 'sessions')
  _submitForm(e, logSessionToID) {
    e.preventDefault();
    const date = sessionDate.value;
    const length = sessionLength.value;
    const sets = sessionSets.value;
    const notes = sessionNotes.value;
    const id = logSessionToID;
    const element = model.activities[id];
    sessionDate.value = "";
    sessionLength.value = "";
    const session = {
      date: date,
      length: length,
      sets: sets,
      notes: notes,
    };
    element.sessions.push(session);
    this._moveActivity(id, 0, element);
    this._storeIDAndRender();
    console.log(model.activities[id]);
    mainView._closeLogSessionForm();
  }

  handleswipe() {
    const diffX = this.touchstartX - this.touchendX;
    const diffY = this.touchstartY - this.touchendY;

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
