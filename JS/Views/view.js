import config from "../config.js";

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
}
