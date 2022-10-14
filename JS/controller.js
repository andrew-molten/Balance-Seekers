const activityInput = document.querySelector(".add__activity__input");
const addButton = document.querySelector(".add__btn");
const addActivity = document.querySelector("add__activity");
const clearButton = document.querySelector(".clear_btn");
const activitiesDisplay = document.querySelector(".activities_display");
const upButton = document.querySelector(".push_up_btn");
const downButton = document.querySelector(".push_down_btn");

// let id = -1;
// class Activity {
//   constructor(activityName) {
//     this.activityName = activityName;
//     console.log(this.activityName);
//   }
// }

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
    });
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
    return `
    <li class="activity_item" id="id${id}">${activity.activity} 
        <button class="btn done_btn">🔥</button>
        <button class="btn push_up_btn">↑</button>
        <button class="btn push_down_btn">↓</button>
        <button class="btn edit_btn">Edit</button>
        <button class="btn delete_btn">Delete</button>
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
}

const app = new App();
