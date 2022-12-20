import config from "./config.js";

class Model {
  state = {
    activities: [],
    deletedActivities: [],
    categories: [],
    currentHighestID: 0,
  };

  // export const activities = [];
  // export const deletedActivities = [];
  ///////////////////////////////////////////////
  ////////////// STORAGE ////////////////////////
  ///////////////////////////////////////////////
  setLocalStorage = function () {
    localStorage.setItem("activities", JSON.stringify(this.state.activities));
    localStorage.setItem("categories", JSON.stringify(this.state.categories));
    localStorage.setItem(
      "deletedActivities",
      JSON.stringify(this.state.deletedActivities)
    );
    localStorage.setItem(
      "currentHighestID",
      JSON.stringify(this.state.currentHighestID)
    );
  };
  getLocalStorage = function () {
    const data = JSON.parse(localStorage.getItem("activities"));
    const deletedData = JSON.parse(localStorage.getItem("deletedActivities"));
    const categories = JSON.parse(localStorage.getItem("categories"));
    const currentHighestID = JSON.parse(
      localStorage.getItem("currentHighestID")
    );

    if (!currentHighestID) {
      this.state.currentHighestID = 0;
    } else {
      this.state.currentHighestID = +currentHighestID;
    }

    if (!data) {
      this.state.activities = [];
    } else {
      this.state.activities = data;
      // Trying to fix the ID and sortID properties so that both can exist
      // Keep the Below code in until 1/1/2023 - to fix everyones current date - then remove it
      this.checkForSortIdAndAssign(this.state.activities);
      this.checkIfIDExistsAndCreate(this.state.activities);
    }

    if (!deletedData) {
      this.state.deletedActivities = [];
    } else {
      this.state.deletedActivities = deletedData;
      // Trying to fix the ID and sortID properties so that both can exist
      // Keep the Below code in until 1/1/2023 - to fix everyones current date - then remove it
      this.checkForSortIdAndAssign(this.state.deletedActivities);
      this.checkIfIDExistsAndCreate(this.state.deletedActivities);
    }

    if (!categories) {
      this.state.categories = [];
    } else {
      this.state.categories = categories;
    }
  };

  // _oldSetLocalStorage() {
  //   localStorage.setItem("activities", JSON.stringify(this.activities));
  //   localStorage.setItem("categories", JSON.stringify(this.categories));
  //   localStorage.setItem(
  //     "deletedActivities",
  //     JSON.stringify(this.deletedActivities)
  //   );
  //   localStorage.setItem(
  //     "currentHighestID",
  //     JSON.stringify(this.currentHighestID)
  //   );
  // }

  ///////////////////////////////////////////////
  //////////////  CREATE  ////////////////////////
  ///////////////////////////////////////////////

  createActivity = function (activity, category) {
    this.state.activities.splice(0, 0, {
      activity: activity,
      sessions: [],
      variation: [],
      id: this.assignID(),
    });
    if (this.state.categories.length < 1) return this.setLocalStorage();
    this.state.activities[0].category = category;
  };

  checkIfIDExistsAndCreate(arr) {
    if (arr.length < 1) return;
    if (arr[0].hasOwnProperty("sortId") && !arr[0].hasOwnProperty("id")) {
      let id = this.state.currentHighestID;
      arr.forEach((el) => {
        id = id + 1;
        el.id = id;
      });
      this.state.currentHighestID = id;
    }
  }

  addCategory = function (input) {
    this.state.categories.push({ category: input, activities: [] });
    this.setLocalStorage();
  };

  assignID() {
    this.state.currentHighestID = this.state.currentHighestID + 1;
    return this.state.currentHighestID;
  }

  _addVarationToCategory(activityObject, newVariation, categoryObject) {
    const id = activityObject.id;

    const activityToEdit = this._findActivityObjectByID(
      categoryObject.activities,
      id
    );
    activityToEdit.variation.push({ type: newVariation });
  }

  ///////////////////////////////////////////////
  ////////////////  ID'S  ////////////////////////
  ///////////////////////////////////////////////

  checkForSortIdAndAssign(arr) {
    // Trying to fix the ID and sortID properties so that both can exist
    // Keep the Below code in until 1/1/2023 - to fix everyones current date - then remove it
    if (arr.length < 1) return;
    if (!arr[0].hasOwnProperty("sortId")) {
      let sortId = -1;

      arr.forEach((el) => {
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
    }
  }

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

  ///////////////////////////////////////////////////
  ////////////////  FIND DATA  ////////////////////////
  ///////////////////////////////////////////////////

  _findVariationObject(array, variationName) {
    return array.find((element) => element.type === variationName);
  }

  _findCategory(array, categoryName) {
    return array.find((element) => element.category === categoryName);
  }

  _findActivityObjectByID(array, activityID) {
    return array.find((element) => element.id === activityID);
  }

  //////////////////////////////////////////////////
  ////////////////  MANIPULATE  ////////////////////////
  //////////////////////////////////////////////////

  // Adjusting Activities
  _moveActivityUpOrDown = function (e, direction, movingID) {
    // const movingID = +e.target.closest(".activity_item").id.slice(2);
    if (movingID === this.state.activities.length - 1 && direction === "down")
      return;
    if (movingID === 0 && direction === "up") return;

    const newID = direction === "up" ? movingID - 1 : movingID + 1;
    const element = this.state.activities[movingID];

    this._moveActivity(this.state.activities, movingID, newID, element);
  };

  _pushActivityToCategory(activityObject, categoryName) {
    if (this.state.categories.length < 1) return;

    const categoryObject = this._findCategory(
      this.state.categories,
      categoryName
    );
    const checkIfInCategory = this._findActivityObjectByID(
      categoryObject.activities,
      activityObject.id
    );
    let latestSessionDate = "";
    if (activityObject.sessions[0]) {
      const sessionsLength = activityObject.sessions.length;
      latestSessionDate = activityObject.sessions[sessionsLength - 1].date;
    }

    // Guard clause in case category already contains the activityObject
    if (checkIfInCategory) return;

    categoryObject.activities.splice(0, 0, {
      activity: activityObject.activity,
      id: activityObject.id,
      variation: activityObject.variation,
      latestSessionDate: latestSessionDate,
    });
  }

  _moveActivity = function (array, oldID, newID, element) {
    array.splice(oldID, 1);
    array.splice(newID, 0, element);
  };

  _changeActivityCategory(idToEdit, category, previousCategory) {
    this.state.activities[idToEdit].category = category;
    const activityID = this.state.activities[idToEdit].id;
    const prevCategoryObject = this._findCategory(
      this.state.categories,
      previousCategory
    );
    this._deleteFromCategory(prevCategoryObject, activityID);
  }

  _reOrderActivities(array, idToEdit, activityObject) {
    const arrayLength = array.length;
    this._moveActivity(array, idToEdit, arrayLength - 1, activityObject);
  }

  //////////////////////////////////////////////////
  ////////////////  DELETE  ////////////////////////
  //////////////////////////////////////////////////

  _deleteFromCategory(categoryObject, activityID) {
    const objectToDelete = this._findActivityObjectByID(
      categoryObject.activities,
      activityID
    );
    const arrayIndex = objectToDelete.sortId;
    this._removeActivityFromArray(categoryObject.activities, arrayIndex);
  }

  _removeActivityFromArray(array, idToEdit) {
    array.splice(idToEdit, 1);
  }

  reset = function () {
    localStorage.removeItem("activities");
  };
}

export default new Model();
