import config from "../config.js";

export default class View {
  _parentElement = document.querySelector(".activities_display");
  _activities;

  _render(activities) {
    this._clear();
    this._activities = activities;
    const markup = this._generateMarkup();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _clearInputField() {
    document.querySelector(".add__activity__input").value = "";
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }
}
