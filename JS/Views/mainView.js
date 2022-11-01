import View from "./view.js";

class MainView extends View {
  _generateMarkup(activity, id) {
    let subCategories = "";

    activity.variation
      ? activity.variation.forEach(
          (element) =>
            (subCategories =
              subCategories + `<li class="sub_item">${element.type}</li>`)
        )
      : "";

    return `
    <li class="activity_item" id="id${id}">${activity.activity} 
        <ol class="sub_category">
        ${subCategories}
        </ol>
        </li>
    `;
    // Buttons that were on the elements but have been replaced with swipes
    // <button class="btn log_session_btn">🔥</button>
    // <button class="btn push_up_btn">↑</button>
    // <button class="btn push_down_btn">↓</button>
    // <button class="btn edit_btn">Edit</button>
    // <button class="btn add_sub_btn">+</button>
  }
}

export default new MainView();
