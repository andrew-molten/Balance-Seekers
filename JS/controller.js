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
const categoryViewDiv = document.getElementById("categoryViewDiv");
const activityCategorySubtitle = document.getElementById(
  "activityCategorySubtitle"
);
const assignToCategoryBtn = document.getElementById("assignToCategoryBtn");

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
    ////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// Event Handlers ////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    //////////// MAIN VIEW//////////

    addButton.addEventListener("click", this._processActivity.bind(this));

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
        this._storeSortIDs(model.activities);
        mainView._render(model.activities);
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

    ////////// CATEGORY BUTTONS ////////////

    createCategoryBtn.addEventListener(
      "click",
      mainView._displayCategoryInputBox
    );
    createCategoryBtn2.addEventListener(
      "click",
      mainView._displayCategoryInputBox
    );
    submitCategoryBtn.addEventListener("click", this._processCategoryAdd);

    /////////// CATEGORY VIEW /////////////

    categoryViewBtnsDiv.addEventListener("click", (e) => {
      e.preventDefault();
      this._launchCategoryView(e);
    });

    categoryViewDiv.addEventListener("click", (e) => {
      e.preventDefault();
    });

    /////// ACTIVITY VIEW ///////////

    closeForm.addEventListener("click", activityView._closeLogSessionForm());
    submitFormBtn.addEventListener("click", (e) => this._submitForm(e));
    deleteActivityBtn.addEventListener("click", (e) => this._deleteActivity(e));
    activityCategorySubtitle.addEventListener("click", (e) => {
      e.preventDefault();
      this._renderCategoryDropMenuActivityView(model.categories);
    });
    assignToCategoryBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this._renderCategoryDropMenuActivityView(model.categories);
    });
    categoryDropdown.addEventListener("click", (e) => {
      if (logSessionForm.style.display === "block") {
        console.log("ActivityView displaying");
      }
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////// ADD NEW ACTIVITY  //////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////

  // Processing Activity
  _processActivity(e) {
    e.preventDefault();
    if (!activityInput.value) return;

    const activity = activityInput.value;
    const category = categoryDropdown.value;

    mainView._clearActivityInputField();
    model.createActivity(activity, category);
    this._storeSortIDs(model.activities);
    this._pushActivityToCategory(category);
    mainView._render(model.activities);
  }

  _storeSortIDs(array) {
    model.setIDs(array);
    model.setLocalStorage();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////// VARIATIONS  //////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////

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
    const activityObject = model.activities[itemID];
    const input = addVariationInput.value;
    if (input === "") return;
    activityObject.variation.push({ type: input });
    this._storeSortIDs(model.activities);
    mainView._render(model.activities);
    addVariationInputContainer.innerHTML = "";

    if (model.categories.length > 0) {
      model._addVarationToCategory(
        activityObject,
        input,
        activityObject.category
      );
      const categoryObject = model._findCategory(
        model.categories,
        activityObject.category
      );
      this._storeSortIDs(categoryObject.activities);
    }
  }

  _removeVariationInputBox() {
    if (document.querySelector(".add_variation_input")) {
      const existingVariationInputBox = document.querySelector(
        ".add_variation_input"
      );
      existingVariationInputBox.parentElement.innerHTML = "";
    }
  }

  _reOrderVariation(activityObject) {
    const variationsArray = activityObject.variation;
    if (variationsArray.length === 0) return;
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

  //////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////// CATEGORIES  //////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////

  _launchCategoryView(e) {
    if (!e.target.closest("span")) return;
    if (e.target.innerHTML === "All") return this.init();
    console.log(e);
    const category = e.target.closest("span").innerHTML;
    const categoryObject = model._findCategory(model.categories, category);
    // categoryView._render(model.activities);
    categoryView._openCategoryView(categoryObject, model.activities);
  }
  _checkIfCategoryExists() {
    if (model.categories.length < 1) {
      createCategoryBtn.style.display = "block";
      return false;
    }

    return true;
  }

  _renderCategoryDropMenu() {
    mainView._displayCategoryDropMenu();
    mainView._renderCategoryDropMenu(model.categories);
  }

  _pushActivityToCategory(category) {
    if (model.categories.length > 0) {
      model._pushActivityToCategory(model.activities[0], category);
      const categoryObject = model._findCategory(model.categories, category);
      this._storeSortIDs(categoryObject.activities);
    }
  }

  _processCategoryAdd(e) {
    e.preventDefault();
    if (!categoryInput.value) return;
    let input;
    input = categoryInput.value;
    model.addCategory(input);
    mainView._renderCategoryDropMenu(model.categories);
    mainView._hideCategoryInputDiv();
    mainView._generateCategoryTabs();
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////// ACTIVITY VIEW  //////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////

  _goToActivityView(e) {
    this._removeVariationInputBox();
    activityView._openActivityView(e, model.activities, idToEdit);
    mainView._hideCategoryInputDiv();
    this._checkIfCategoryExists();
    if (this._checkIfCategoryExists()) {
      activityView._showActivityCategory(model.activities, idToEdit);
    }
  }

  _renderCategoryDropMenuActivityView(categories) {
    activityView._renderCategoryDropMenu(categories);
    activityView._displayCategoryDropMenu(categories);
    activityCategorySubtitle.style.display = "none";
    assignToCategoryBtn.style.display = "none";
  }

  _deleteActivity(e) {
    e.preventDefault();
    const element = model.activities[idToEdit];
    model.deletedActivities.push(element);
    model.activities.splice(idToEdit, 1);
    activityView._closeLogSessionForm();
    this._storeSortIDs(model.activities);
    mainView._render(model.activities);
  }

  _submitForm(e) {
    e.preventDefault();
    // Create Session and push to state
    const activityObject = model.activities[idToEdit];
    const activityID = model.activities[idToEdit].id;
    const activityCategory = model.activities[idToEdit].category;
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
    this._storeSortIDs(model.activities);
    mainView._render(model.activities);

    if (model.categories > 0 && activityCategory) {
      const categoryHoldingActivity =
        model.categories.activityCategory.activities;
      const categoryActivityObject = model._findActivityObjectByID(
        categoryHoldingActivity,
        activityID
      );
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////// USER INTERFACE  //////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////

  _setIdToEdit(e) {
    // Returns "sortId"
    idToEdit = +e.target.closest(".activity_item").id.slice(6);
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
    /// Test later whether we need the below checkIfCategoryExists
    this._checkIfCategoryExists();
    console.log(model.activities);
    console.log(model.deletedActivities);
    console.log(model.categories);
    //Only keep this setLocalStorage() until 1/1/2023 when the other functions in model are also removed.
    model.setLocalStorage();
    mainView._render(model.activities);
    if (this._checkIfCategoryExists()) {
      mainView._generateCategoryTabs(model.categories);
      this._renderCategoryDropMenu();
    }
  }
}

const app = new App();
