const activityInput = document.querySelector(".add__activity__input");
const addButton = document.querySelector(".add__btn");
const addActivity = document.querySelector("add__activity");
const clearButton = document.querySelector(".clear_btn");
const activitiesDisplay = document.querySelector(".activities_display");
const upButton = document.querySelector(".push_up_btn");
const downButton = document.querySelector(".push_down_btn");

let id = 0;
// class Activity {
//   constructor(activityName) {
//     this.activityName = activityName;
//     console.log(this.activityName);
//   }
// }

class App {
  #parentEl = document.querySelector(".add__activity");
  #activities = [];

  constructor() {
    // this.reset();
    this.init();
    // Event Handlers
    addButton.addEventListener("click", this._processActivity.bind(this));

    activitiesDisplay.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.closest(".push_up_btn")) {
        console.log(e.target.parentElement.parentElement);
        this._moveActivityUp();
      }
    });
    //Can't get the below button to work - cannot read property of null (reading 'addeventlistener')
    // upButton.addEventListener("click", this._moveActivityUp.bind(this));

    // addButton.addEventListener("click", this.reset());
  }

  // Processing Activity
  _processActivity(e) {
    e.preventDefault();
    if (!activityInput.value) return;

    const activity = activityInput.value;

    this.#clearInputField();
    // this.#activities.push(activity);
    this._storeActivity(activity);
    this._render(this.#activities);

    // RESETTING UI INFO when needed
    // this.reset();

    console.log(this.#activities);
  }

  _generateMarkup(activity) {
    return `
    <li class="activity_item">${activity.activity} 
        <button class="btn done_btn">🔥</button>
        <button class="btn push_up_btn">↑</button>
        <button class="btn push_down_btn">↓</button>
        <button class="btn edit_btn">Edit</button>
        <button class="btn delete_btn">Delete</button>
        </li>
    `;
  }

  _storeActivity(input) {
    this.idGenerator();
    this.#activities.push({
      activity: input,
      id: id,
    });
    this._setLocalStorage();
  }

  idGenerator() {
    id = id + 1;
    console.log(id);
  }

  _render(activities) {
    activitiesDisplay.innerHTML = "";
    activities.forEach((activity) => {
      const markup = this._generateMarkup(activity);
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
    console.log(this.#activities);
  }

  reset() {
    localStorage.removeItem("activities");
  }

  init() {
    this._getLocalStorage();
    if (this.#activities.length === 0) return (id = 0);
    id = Math.max(...this.#activities.map((o) => o.id));
    console.log(id);
  }

  // Adjusting Activities
  _moveActivityUp() {
    console.log("up up up");
    // Need to figure out how to get the indexOf the activity from the button
    // Then use array .splice to delete and insert that into the right place in the array
  }
}

const app = new App();
