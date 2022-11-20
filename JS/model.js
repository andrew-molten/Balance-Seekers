import config from "./config.js";

class Model {
  state = {
    activities: [],
    deletedActivities: [],
    categories: [],
  };

  // export const activities = [];
  // export const deletedActivities = [];

  createActivity = function (input) {
    this.activities.splice(0, 0, {
      activity: input,
      sessions: [],
      variation: [],
    });
    this.setLocalStorage();
  };

  addCategory = function (input) {
    this.categories.push({ category: input, activities: [] });
    this.setLocalStorage();
    console.log(this.activities);
    console.log(this.categories);
  };

  // Storage
  setLocalStorage = function () {
    localStorage.setItem("activities", JSON.stringify(this.activities));
    localStorage.setItem("categories", JSON.stringify(this.categories));
    localStorage.setItem(
      "deletedActivities",
      JSON.stringify(this.deletedActivities)
    );
  };
  getLocalStorage = function () {
    const data = JSON.parse(localStorage.getItem("activities"));
    const deletedData = JSON.parse(localStorage.getItem("deletedActivities"));
    const categories = JSON.parse(localStorage.getItem("categories"));

    if (!data) {
      this.activities = [];
    } else {
      this.activities = data;
    }

    if (!deletedData) {
      this.deletedActivities = [];
    } else {
      this.deletedActivities = deletedData;
    }

    if (!categories) {
      this.categories = [];
    } else {
      this.categories = categories;
    }

    // Trying to fix the ID and sortID properties so that both can exist
    // Keep the Below code in until 1/1/2023 - to fix everyones current date - then remove it
    let sortId = -1;

    this.activities.forEach((el) => {
      sortId = sortId + 1;
      el.sortId = sortId;
      delete el.id;
      if (el.variation.length === 0) return;
      let variationSortId = -1;
      // Set sortID for any variations
      el.variation.forEach((va) => {
        variationSortId = variationSortId + 1;
        va.sortId = variationSortId;
        delete va.id;
      });
    });
  };

  // Set ID's
  setIDs = function (arr) {
    let sortId = -1;

    arr.forEach((el) => {
      sortId = sortId + 1;
      el.sortId = sortId;
      if (el.variation.length === 0) return;

      let variationSortId = -1;
      // Set ID for any variations
      el.variation.forEach((va) => {
        variationSortId = variationSortId + 1;
        va.sortId = variationSortId;
      });
    });
  };

  // Adjusting Activities
  _moveActivityUpOrDown = function (e, direction, movingID) {
    // const movingID = +e.target.closest(".activity_item").id.slice(2);
    if (movingID === this.activities.length - 1 && direction === "down") return;
    if (movingID === 0 && direction === "up") return;

    const newID = direction === "up" ? movingID - 1 : movingID + 1;
    const element = this.activities[movingID];

    this._moveActivity(movingID, newID, element);
  };

  _moveActivity = function (oldID, newID, element) {
    this.activities.splice(oldID, 1);
    this.activities.splice(newID, 0, element);
  };

  reset = function () {
    localStorage.removeItem("activities");
  };
}

export default new Model();
