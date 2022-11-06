import config from "./config.js";

class Model {
  state = {
    activities: [],
    deletedActivities: [],
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
    console.log(this.activities);
  };

  // Storage
  setLocalStorage = function () {
    localStorage.setItem("activities", JSON.stringify(this.activities));
    localStorage.setItem(
      "deletedActivities",
      JSON.stringify(this.deletedActivities)
    );
  };
  getLocalStorage = function () {
    const data = JSON.parse(localStorage.getItem("activities"));
    const deletedData = JSON.parse(localStorage.getItem("deletedActivities"));
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
  };

  // Set ID's
  setIDs = function (arr) {
    let id = -1;

    arr.forEach((el) => {
      let variationIdDecimal = -1;
      id = id + 1;
      el.id = id;
      if (el.variation.length === 0) return;

      // Set ID for any variations
      el.variation.forEach((va) => {
        variationIdDecimal = variationIdDecimal + 1;
        const variationID = id + "." + variationIdDecimal;
        va.id = +variationID;
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
