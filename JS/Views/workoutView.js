import View from "./view.js";

class WorkoutView extends View {
  _generateMarkup(activities) {
    const markup = `<li class="activity_item" id="id1">jdvfjkdfvkj 
    <ol class="sub_category">
    dfv
    </ol>
    </li>`;
    return markup;
  }
}

export default new WorkoutView();
