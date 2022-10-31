export const wedge = "beef";

export class View {
  cheese = "silly cheese";

  cheesey() {
    console.log(this.cheese);
  }

  _render(activities) {
    activitiesDisplay.innerHTML = "";
    activities.forEach((activity) => {
      const markup = this._generateMarkup(activity, activity.id);
      activitiesDisplay.insertAdjacentHTML("afterbegin", markup);
    });
  }
}

// export const cheese = "silly";
