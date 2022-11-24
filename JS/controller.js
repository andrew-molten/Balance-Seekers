import model from "./model.js";
import mainView from "./views/mainView.js";
import config from "./config.js";

import activityView from "./views/activityView.js";
import categoryView from "./views/categoryView.js";
import View from "./views/view.js";
// Issue that I was having is that making the class is fine but then you still need to call the class into being i.e - const view = new View(), which can then be exported and called at the same time or called after importing.

const activityInput = document.querySelector(".add__activity__input");
const addButton = document.querySelector(".add__btn");
const activitiesDisplay = document.querySelector(".activities_display");
const closeForm = document.querySelector(".close_session_form");
const submitFormBtn = document.querySelector(".submit_session_form");
const deleteActivityBtn = document.querySelector(".delete_activity_btn");
const createCategoryBtn = document.getElementById("createCategoryBtn");
const createCategoryBtn2 = document.getElementById("createCategoryBtn2");
const variationSelect = document.getElementById("variationSelect");
const submitCategoryBtn = document.getElementById("submitCategoryBtn");
const categoryInput = document.getElementById("categoryInput");
const categoryDropdown = document.getElementById("categorySelectMainView");
const categoryViewBtnsDiv = document.getElementById("categoryViewBtnsDiv");

let idToEdit;

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
    createCategoryBtn.addEventListener(
      "click",
      mainView._displayCategoryInputBox
    );
    createCategoryBtn2.addEventListener(
      "click",
      mainView._displayCategoryInputBox
    );
    submitCategoryBtn.addEventListener("click", this._processCategoryAdd);

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
        model._moveActivityUpOrDown(e, "down", idToEdit);
        this._storeIDAndRender();
      }
      if (this.swipeDirection === "right") {
        this._addVariation(e);
      }
      if (this.swipeDirection === "up") {
        console.log("You swiped up");
      }
      if (this.swipeDirection === "down") {
        console.log("You swiped down");
      }
      this.swipeDirection = "";
    });

    categoryViewBtnsDiv.addEventListener("click", (e) => {
      e.preventDefault();
      if (!e.target.closest("span")) return;
      const category = e.target.closest("span").innerHTML;
      const categoryObject = model._findCategory(model.categories, category);
      categoryView._render(model.activities);
      categoryView._openCategoryView(categoryObject, model.activities);
    });

    // Need to implement a double tap for this
    // activitiesDisplay.addEventListener("dblclick", (e) => {
    //   this._setIdToEdit(e)
    //   console.log("doubleclick");
    //   this._addVariation(e);
    // });

    activitiesDisplay.addEventListener("click", (e) => {
      e.preventDefault();
      // Guard clauses to stop logSession Form if variation text box exists or button is pressed
      if (
        e.target.classList.contains("add_variation_input") ||
        e.target.classList.contains("add_variation_btn")
      )
        return;

      this._goToActivityView(e);
    });

    closeForm.addEventListener("click", activityView._closeLogSessionForm());
    submitFormBtn.addEventListener("click", (e) => this._submitForm(e));
    deleteActivityBtn.addEventListener("click", (e) => this._deleteActivity(e));
  }

  _checkIfCategoryExists() {
    if (model.categories.length < 1) {
      createCategoryBtn.style.display = "block";
      return;
    }
    mainView._displayCategoryDropMenu();
    mainView._renderCategoryDropMenu(model.categories);
    mainView._generateCategoryTabs(model.categories);
  }

  _goToActivityView(e) {
    this._removeVariationInputBox();
    activityView._openActivityView(e, model.activities, idToEdit);
    mainView._hideCategoryInputDiv();
    this._checkIfCategoryExists();
  }

  _setIdToEdit(e) {
    // Returns "sortId"
    idToEdit = +e.target.closest(".activity_item").id.slice(6);
  }

  // Processing Activity
  _processActivity(e) {
    e.preventDefault();
    if (!activityInput.value) return;

    const activity = activityInput.value;

    mainView._clearActivityInputField();
    model.createActivity(activity);
    this._storeIDAndRender();
    this._pushActivityToCategory(model.activities[0]);
  }

  _pushActivityToCategory(activityObject) {
    if (model.categories.length < 1) return;
    const categoryName = categoryDropdown.value;
    const categoryObject = model._findCategory(model.categories, categoryName);
    const newActivity = {
      activity: activityObject.activity,
      id: activityObject.id,
    };
    categoryObject.activities.push(newActivity);
    console.log(categoryObject);
  }

  _processCategoryAdd(e) {
    e.preventDefault();
    if (!categoryInput.value) return;
    let input;
    input = categoryInput.value;
    model.addCategory(input);
    mainView._renderCategoryDropMenu(model.categories);
    mainView._hideCategoryInputDiv();
  }

  _storeIDAndRender() {
    model.setIDs(model.activities);
    model.setLocalStorage();
    mainView._render(model.activities);
  }

  _deleteActivity(e) {
    e.preventDefault();
    const element = model.activities[idToEdit];
    model.deletedActivities.push(element);
    model.activities.splice(idToEdit, 1);
    activityView._closeLogSessionForm();
    this._storeIDAndRender();
  }

  _removeVariationInputBox() {
    if (document.querySelector(".add_variation_input")) {
      const existingVariationInputBox = document.querySelector(
        ".add_variation_input"
      );
      existingVariationInputBox.parentElement.innerHTML = "";
    }
  }

  _addVariation(e) {
    // Guard clause to check for any other text boxes
    this._removeVariationInputBox();

    const variationBlock = document.getElementById(
      `sortId${idToEdit}`
    ).lastElementChild;

    variationBlock.insertAdjacentHTML(
      "afterbegin",
      `<div class="add_variation_input_container">
      <input
          type="text"
          class="add_variation_input"
          placeholder="add a variation"
          onkeydown = "if (event.keyCode == 13)
                        document.querySelector('.add_variation_btn').click()"
        />
        <button class="btn add_variation_btn">Add</button>
          </div>`
    );

    const addVariationBtn = document.querySelector(".add_variation_btn");

    addVariationBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this._processAddVariation(e, idToEdit);
    });
  }

  _processAddVariation(e, itemID) {
    const addVariationInput = document.querySelector(".add_variation_input");
    const addVariationInputContainer = document.querySelector(
      ".add_variation_input_container"
    );
    const input = addVariationInput.value;
    if (input === "") return;
    model.activities[itemID].variation.push({ type: input });
    model._addVarationToCategory(model.activities[itemID], input);
    addVariationInputContainer.innerHTML = "";
    this._storeIDAndRender();
  }

  _submitForm(e) {
    e.preventDefault();
    // Create Session and push to state
    const activityObject = model.activities[idToEdit];
    const activitiesLength = model.activities.length;
    const session = activityView._generateSession();
    activityObject.sessions.push(session);

    // Re-order activities & variations
    model._moveActivity(
      model.activities,
      idToEdit,
      activitiesLength - 1,
      activityObject
    );
    this._reOrderVariation(activityObject);

    // Return to MainView
    activityView._closeLogSessionForm();
    this._storeIDAndRender();
  }

  _reOrderVariation(activityObject) {
    const variationsArray = activityObject.variation;
    const currentVariation = variationSelect.value;
    const variationObject = model._findVariationObject(
      variationsArray,
      currentVariation
    );
    const currVarId = variationsArray.indexOf(variationObject);
    const variationsLength = variationsArray.length;
    model._moveActivity(
      variationsArray,
      currVarId,
      variationsLength - 1,
      variationObject
    );
  }

  handleswipe() {
    const diffX = this.touchstartX - this.touchendX;
    const diffY = this.touchstartY - this.touchendY;

    if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10)
      return (this.swipeDirection = "");

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Swiping horizontally
      if (diffX > 0) return (this.swipeDirection = "left");
      if (diffX < 0) return (this.swipeDirection = "right");
    }

    if (Math.abs(diffY) > Math.abs(diffX)) {
      // Swiping vertically
      if (diffY < 0) return (this.swipeDirection = "down");
      if (diffY > 0) return (this.swipeDirection = "up");
    }
  }
  init() {
    model.getLocalStorage();
    this._checkIfCategoryExists();
    console.log(model.activities);
    console.log(model.deletedActivities);
    console.log(model.categories);
    //Only keep this setLocalStorage() until 1/1/2023 when the other functions in model are also removed.
    model.setLocalStorage();
    mainView._render(model.activities);
  }
}

const app = new App();
