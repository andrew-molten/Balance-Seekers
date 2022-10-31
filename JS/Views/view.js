export default class View {
  _render(activities) {
    activitiesDisplay.innerHTML = "";
    activities.forEach((activity) => {
      const markup = this._generateMarkup(activity, activity.id);
      activitiesDisplay.insertAdjacentHTML("afterbegin", markup);
    });
  }
}
