export default class View {
  _parentElement = document.querySelector(".activities_display");

  _render(activities) {
    this._parentElement.innerHTML = "";
    activities.forEach((activity) => {
      const markup = this._generateMarkup(activity, activity.id);
      this._parentElement.insertAdjacentHTML("afterbegin", markup);
    });
  }
}

// export const cheese = "silly";
