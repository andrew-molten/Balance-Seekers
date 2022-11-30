import config from "../config.js";

const categoryInputDiv = document.getElementById("addCategoryInputDiv");
const createCategoryBtn = document.getElementById("createCategoryBtn");
const categoryDropdownDiv = document.getElementById(
  "categorySelectMainViewDiv"
);
const categoryDropdown = document.getElementById("categorySelectMainView");
const categoryInput = document.getElementById("categoryInput");
const categoryViewDiv = document.getElementById("categoryViewDiv");
const categoryViewBtnsDiv = document.getElementById("categoryViewBtnsDiv");

export default class View {
  _parentElement = document.querySelector(".activities_display");
  _activities;
  _idToEdit;

  _render(activities, idToEdit) {
    this._clear();
    this._activities = activities;
    this._idToEdit = idToEdit;
    const markup = this._generateMarkup();
    this._insertMarkup(markup);
  }

  _clearActivityInputField() {
    document.querySelector(".add__activity__input").value = "";
  }

  _clear() {
    this._parentElement.innerHTML = "";
    categoryViewDiv.innerHTML = "";
  }

  _renderCategoryDropMenu(array) {
    let options = "";

    array
      ? array.forEach((element) => {
          const currentOption = `<option value="${element.category}">${element.category}</option>`;
          options = options + currentOption;
        })
      : "";

    this._insertCategoryHTML(options);
  }

  _displayCategoryInputBox(e) {
    e.preventDefault();
    createCategoryBtn.style.display = "none";
    categoryInputDiv.style.display = "block";
  }

  _displayCategoryDropMenu() {
    createCategoryBtn.style.display = "none";
    categoryDropdownDiv.style.display = "block";
  }

  _hideCategoryInputDiv() {
    categoryInput.value = "";
    categoryInputDiv.style.display = "none";
  }

  _insertCategoryHTML(options) {
    categoryDropdown.innerHTML = "";
    categoryDropdown.insertAdjacentHTML("afterbegin", options);
    categoryDropdownDiv.style.display = " block";
  }

  _hideShowAllActivitiesBtn() {
    const showAllActivitiesBtn = document.getElementById(
      "showAllActivitiesBtn"
    );
    showAllActivitiesBtn.style.display = "none";
  }

  _clearCategoryViewBtns() {
    categoryViewBtnsDiv.innerHTML = "";
  }
}
