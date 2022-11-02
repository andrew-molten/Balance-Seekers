export const state = {
  activities: [],
  deletedActivities: [],
};

export const createActivity = function (input) {
  this.activities.push({
    activity: input,
    sessions: [],
    variation: [],
  });
  setLocalStorage();
};

// Storage
export const setLocalStorage = function () {
  localStorage.setItem("activities", JSON.stringify(this.activities));
};
export const getLocalStorage = function () {
  const data = JSON.parse(localStorage.getItem("activities"));

  if (!data) return;

  this.activities = data;
};

// Set ID's
export const setIDs = function (arr) {
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

const reset = function () {
  localStorage.removeItem("activities");
};
