const activityInput = document.querySelector(".add__activity__input");
const addButton = document.querySelector(".add__btn");
const addActivity = document.querySelector("add__activity");
const clearButton = document.querySelector(".clear_btn");
const activitiesDisplay = document.querySelector(".activities_display");
const upButton = document.querySelector(".push_up_btn");
const downButton = document.querySelector(".push_down_btn");

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
    this._getLocalStorage();

    // Event Handlers
    addButton.addEventListener("click", this._processActivity.bind(this));

    activitiesDisplay.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.closest(".push_up_btn")) {
        console.log(e.target);
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

    console.log(this.#activities);
  }

  _generateMarkup(activity) {
    return `
    <li>${activity}</li>
        <button class="btn done_btn">🔥</button>
        <button class="btn push_up_btn">↑</button>
        <button class="btn push_down_btn">↓</button>
        <button class="btn edit_btn">Edit</button>
        <button class="btn delete_btn>Delete</button>
    `;
  }

  _storeActivity(activity) {
    this.#activities.push(activity);
    this._setLocalStorage();
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

  // Adjusting Activities
  _moveActivityUp() {
    console.log("up up up");
    // Need to figure out how to get the indexOf the activity from the button
    // Then use array .splice to delete and insert that into the right place in the array
  }
}

const app = new App();
