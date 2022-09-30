const activityInput = document.querySelector(".add__activity__input");
const addButton = document.querySelector(".add__btn");
const addActivity = document.querySelector("add__activity");

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
  }

  _processActivity(e) {
    e.preventDefault();
    const activity = activityInput.value;
    this.#clearInputField();
    this.#activities.push(activity);
    this._setLocalStorage();
    console.log(this.#activities);
  }

  #clearInputField() {
    this.#parentEl.querySelector(".add__activity__input").value = "";
  }

  _setLocalStorage() {
    localStorage.setItem("activities", JSON.stringify(this.#activities));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("activities"));

    if (!data) return;

    this.#activities = data;

    this.#activities.forEach((activity) => console.log(activity));
  }

  reset() {
    localStorage.removeItem("activities");
  }
}

const app = new App();
