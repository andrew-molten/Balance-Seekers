import View from "./view";

const categoryViewDiv = document.getElementById("categoryViewDiv");

class CategoryView extends View {
  _openCategoryView(categoryObject, activities) {
    console.log(categoryObject);
    this._getCategoryActivities();
  }
  _generateMarkup() {
    console.log("generating");
    const markup = `<p>veruvberjvnuernvuoenvunetbknet</p>`;

    return markup;
  }

  _insertMarkup(markup) {
    categoryViewDiv.insertAdjacentHTML("beforebegin", markup);
  }

  _getCategoryActivities(categories, category) {}
}

export default new CategoryView();
