import config from "../config.js";
const categoryDropdown = document.getElementById("categorySelectMainView");
const categoryInputDiv = document.getElementById("addCategoryInputDiv");
const createCategoryBtn = document.getElementById("createCategoryBtn");
const categoryDropdownDiv = document.getElementById(
  "categorySelectMainViewDiv"
);

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

  _clearInputField() {
    document.querySelector(".add__activity__input").value = "";
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  _renderCategoryDropMenu(array) {
    const categories = this._fillDropMenu(array);
    console.log(array);
    console.log(categories);
    categoryDropdown.insertAdjacentHTML("afterbegin", categories);
  }

  _fillDropMenu(array, object) {
    let options = "";

    array
      ? array.forEach(
          (element) =>
            (options =
              options + `<option value="${element}">${element}</option>`)
        )
      : "";
    return options;
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
    categoryInputDiv.style.display = "none";
  }
}
