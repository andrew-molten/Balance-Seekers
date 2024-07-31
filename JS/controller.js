import model from './model.js'
import mainView from './views/mainView.js'
import config from './config.js'

import activityView from './views/activityView.js'
import categoryView from './views/categoryView.js'
// import View from "./views/view.js";
// Issue that I was having is that making the class is fine but then you still need to call the class into being i.e - const view = new View(), which can then be exported and called at the same time or called after importing.

const activityInput = document.querySelector('.add__activity__input')
const addButton = document.querySelector('.add__btn')
const activitiesDisplay = document.querySelector('.activities_display')
const closeForm = document.querySelector('.close_session_form')
const submitFormBtn = document.querySelector('.submit_session_form')
const deleteActivityBtn = document.querySelector('.delete_activity_btn')
const createCategoryBtn = document.getElementById('createCategoryBtn')
const createCategoryBtn2 = document.getElementById('createCategoryBtn2')
const variationSelect = document.getElementById('variationSelect')
const submitCategoryBtn = document.getElementById('submitCategoryBtn')
const categoryInput = document.getElementById('categoryInput')
const categoryDropdown = document.getElementById('categorySelectMainView')
const categoryViewBtnsDiv = document.getElementById('categoryViewBtnsDiv')
const categoryViewDiv = document.getElementById('categoryViewDiv')
const activityCategorySubtitle = document.getElementById(
  'activityCategorySubtitle'
)
const assignToCategoryBtn = document.getElementById('assignToCategoryBtn')
const assignCategoryBtn = document.getElementById('assignCategoryBtn')

let idToEdit
let actualIdToEdit

class App {
  touchstartX = 0
  touchendX = 0
  touchstartY = 0
  touchendY = 0
  swipeDirection

  constructor() {
    this.init()
    ////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// Event Handlers ////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    //////////// MAIN VIEW//////////

    addButton.addEventListener('click', this._processActivity.bind(this))

    activitiesDisplay.addEventListener('touchstart', (e) => {
      this._setIdToEdit(e)
      this.touchstartX = e.changedTouches[0].screenX
      this.touchstartY = e.changedTouches[0].screenY
    })

    activitiesDisplay.addEventListener('touchend', (e) => {
      this.touchendX = e.changedTouches[0].screenX
      this.touchendY = e.changedTouches[0].screenY
      this.handleswipe()
      if (this.swipeDirection === 'left') {
        model._moveActivityUpOrDown(e, 'down', idToEdit)
        this._storeSortIDs(model.state.activities)
        mainView._render(model.state.activities)
      }
      if (this.swipeDirection === 'right') {
        this._addVariation(e)
      }
      if (this.swipeDirection === 'up') {
        console.log('You swiped up')
      }
      if (this.swipeDirection === 'down') {
        console.log('You swiped down')
      }
      this.swipeDirection = ''
    })

    activitiesDisplay.addEventListener('click', (e) => {
      e.preventDefault()
      // Guard clauses to stop logSession Form if variation text box exists or button is pressed

      if (
        e.target.classList.contains('add_variation_input') ||
        e.target.classList.contains('add_variation_btn')
      )
        return
      console.log(e.target)
      this._setIdToEdit(e)

      if (e.target.closest('.log_session_btn')) {
        this._goToActivityView(e)
      } else if (e.target.closest('.push_up_btn')) {
        model._moveActivityUpOrDown(e, 'up', idToEdit)
        this._storeSortIDs(model.state.activities)
        mainView._render(model.state.activities)
      } else if (e.target.closest('.push_down_btn')) {
        model._moveActivityUpOrDown(e, 'down', idToEdit)
        this._storeSortIDs(model.state.activities)
        mainView._render(model.state.activities)
      } else if (e.target.closest('.new_variation_btn')) {
        this._addVariation(e)
      } else {
        this._goToActivityView(e)
      }
    })

    categoryViewDiv.addEventListener('touchstart', (e) => {
      this._setIdToEdit(e)
      console.log(this.idToEdit)
      console.log(e)
      this.touchstartX = e.changedTouches[0].screenX
      this.touchstartY = e.changedTouches[0].screenY
    })

    categoryViewDiv.addEventListener('click', (e) => {
      // Guard clauses to stop logSession Form if variation text box exists or button is pressed
      if (
        e.target.classList.contains('add_variation_input') ||
        e.target.classList.contains('add_variation_btn')
      )
        return

      this._goToActivityView(e)
    })

    ////////// CATEGORY BUTTONS ////////////

    createCategoryBtn.addEventListener(
      'click',
      mainView._displayCategoryInputBox
    )
    createCategoryBtn2.addEventListener(
      'click',
      mainView._displayCategoryInputBox
    )
    submitCategoryBtn.addEventListener('click', this._processCategoryAdd)

    /////////// CATEGORY VIEW /////////////

    categoryViewBtnsDiv.addEventListener('click', (e) => {
      e.preventDefault()
      this._launchCategoryView(e)
    })

    categoryViewDiv.addEventListener('click', (e) => {
      e.preventDefault()
    })

    /////// ACTIVITY VIEW ///////////

    closeForm.addEventListener('click', (e) => {
      activityView._closeLogSessionForm()
      this.init()
    })
    submitFormBtn.addEventListener('click', (e) => this._submitForm(e))
    deleteActivityBtn.addEventListener('click', (e) => this._deleteActivity(e))
    activityCategorySubtitle.addEventListener('click', (e) => {
      e.preventDefault()
      this._renderCategoryDropMenuActivityView(model.state.categories)
    })
    assignToCategoryBtn.addEventListener('click', (e) => {
      e.preventDefault()
      this._renderCategoryDropMenuActivityView(model.state.categories)
    })
    assignCategoryBtn.addEventListener('click', (e) => {
      e.preventDefault()
      if (logSessionForm.style.display === 'none') return
      if (logSessionForm.style.display === 'block')
        return this._updateActivityCategory(e)
    })

    // categoryDropdown.addEventListener("click", (e) => {
    //   if (logSessionForm.style.display === "none") return;
    //   if (logSessionForm.style.display === "block")
    //     return this._updateActivityCategory(e);
    // });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////// ADD NEW ACTIVITY  //////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////

  // Processing Activity Add
  _processActivity(e) {
    e.preventDefault()
    if (!activityInput.value) return

    const activity = activityInput.value
    const category = categoryDropdown.value
    const categoryObject = model._findCategory(model.state.categories, category)

    mainView._clearActivityInputField()
    model.createActivity(activity, category)
    this._pushActivityToCategory(category, model.state.activities[0])
    this._storeSortIDs(model.state.activities)
    //Have had to swap mainview.render for init() because it was adding the variation twice for the first activity - and some how this has fixed the iss
    // mainView._render(model.state.activities);
    this.init()
  }

  _storeSortIDs(array) {
    model.setIDs(array)
    model.setLocalStorage()
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////// VARIATIONS  //////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////

  _addVariation(e) {
    // Guard clause to check for any other text boxes
    this._removeVariationInputBox()

    const variationBlock = document.getElementById(
      `sortId${idToEdit}`
    ).lastElementChild

    variationBlock.insertAdjacentHTML(
      'afterbegin',
      `<div class="add_variation_input_container">
      <input
          type="text"
          class="add_variation_input"
          placeholder="add a variation"
          onkeydown = "if (event.keyCode == 13)
                        document.querySelector('.add_variation_btn').click()"
        />
        <button class="btn add_variation_btn">Add</button>
          </div>`
    )

    const addVariationBtn = document.querySelector('.add_variation_btn')

    addVariationBtn.addEventListener('click', (e) => {
      e.preventDefault()
      this._processAddVariation(e, idToEdit)
    })
  }

  _processAddVariation(e, itemID) {
    const addVariationInput = document.querySelector('.add_variation_input')
    const addVariationInputContainer = document.querySelector(
      '.add_variation_input_container'
    )
    const activityObject = model.state.activities[itemID]
    const input = addVariationInput.value
    addVariationInputContainer.innerHTML = ''
    if (input === '') return

    activityObject.variation.push({ type: input })
    this._storeSortIDs(model.state.activities)
    mainView._render(model.state.activities)

    if (model.state.categories.length > 0 && activityObject.category) {
      const categoryObject = model._findCategory(
        model.state.categories,
        activityObject.category
      )
      model._addVarationToCategory(activityObject, input, categoryObject)
      this._storeSortIDs(categoryObject.activities)
    }
  }

  _removeVariationInputBox() {
    if (document.querySelector('.add_variation_input')) {
      const existingVariationInputBox = document.querySelector(
        '.add_variation_input'
      )
      existingVariationInputBox.parentElement.innerHTML = ''
    }
  }

  _reOrderVariation(activityObject) {
    const variationsArray = activityObject.variation
    if (variationsArray.length === 0) return
    const currentVariation = variationSelect.value
    const variationObject = model._findVariationObject(
      variationsArray,
      currentVariation
    )
    const currVariationIndex = variationsArray.indexOf(variationObject)
    const variationsLength = variationsArray.length
    model._moveActivity(
      variationsArray,
      currVariationIndex,
      variationsLength - 1,
      variationObject
    )
    if (activityObject.category) {
      const category = activityObject.category
      const categoryObject = model._findCategory(
        model.state.categories,
        category
      )
      const activityID = activityObject.id
      const activityInCategory = model._findActivityObjectByID(
        categoryObject.activities,
        activityID
      )
      const categoryVariationObject = model._findVariationObject(
        activityInCategory.variation,
        currentVariation
      )
      model._moveActivity(
        activityInCategory.variation,
        currVariationIndex,
        variationsLength - 1,
        categoryVariationObject
      )
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////// CATEGORIES  //////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////

  _launchCategoryView(e) {
    if (!e.target.closest('span')) return
    if (e.target.innerHTML === 'All') return this.init()
    console.log(e)
    const category = e.target.closest('span').innerHTML
    const categoryObject = model._findCategory(model.state.categories, category)
    // categoryView._render(model.state.activities);
    categoryView._openCategoryView(categoryObject, model.state.activities)
  }
  _checkIfCategoryExists() {
    if (model.state.categories.length < 1) {
      createCategoryBtn.style.display = 'block'
      return false
    }

    return true
  }

  _renderCategoryDropMenu() {
    mainView._displayCategoryDropMenu()
    mainView._renderCategoryDropMenu(model.state.categories)
  }

  _pushActivityToCategory(category, activityInModel) {
    if (model.state.categories.length > 0) {
      model._pushActivityToCategory(activityInModel, category)
      const categoryObject = model._findCategory(
        model.state.categories,
        category
      )
      console.log('_pushActivityToCategory')
      this._storeSortIDs(categoryObject.activities)
    }
  }

  _processCategoryAdd(e) {
    e.preventDefault()
    if (!categoryInput.value) return
    let input
    input = categoryInput.value
    model.addCategory(input)
    mainView._renderCategoryDropMenu(model.state.categories)
    mainView._hideCategoryInputDiv()
    mainView._generateCategoryTabs(model.state.categories)
  }

  _updateActivityCategory(e) {
    // const category = e.target.innerHTML;
    const category = categoryDropdown.value
    const activityInModel = model.state.activities[this.idToEdit]
    // If there is not already a category then
    if (!activityInModel.category) {
      this._pushActivityToCategory(category, activityInModel)
      activityInModel.category = category
      model.setLocalStorage()
      activityView._showActivityCategory(model.state.activities, this.idToEdit)
      return
    }

    if (activityInModel.category === category) {
      //Hide the dropMenu & display category
      activityView._showActivityCategory(model.state.activities, this.idToEdit)
      return
    }

    if (activityInModel.category !== category) {
      const previousCategory = activityInModel.category
      this._pushActivityToCategory(category, activityInModel)

      //Remove this activity from the category that it is currently in
      model._changeActivityCategory(this.idToEdit, category, previousCategory)
      activityView._showActivityCategory(model.state.activities, this.idToEdit)
      model.setLocalStorage()
      return
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////// ACTIVITY VIEW  //////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////

  _goToActivityView(e) {
    this._removeVariationInputBox()
    const activityObject = model._findActivityObjectByID(
      model.state.activities,
      actualIdToEdit
    )
    // console.log(actualIdToEdit)
    // console.log(model.state.activities)
    // console.log(activityObject)
    activityView._openActivityView(
      e,
      model.state.activities,
      activityObject.sortId,
      actualIdToEdit,
      activityObject
    )
    this.idToEdit = activityObject.sortId
    mainView._hideCategoryInputDiv()
    this._checkIfCategoryExists()
    if (this._checkIfCategoryExists()) {
      activityView._showActivityCategory(model.state.activities, this.idToEdit)
    }
  }

  _renderCategoryDropMenuActivityView(categories) {
    activityView._renderCategoryDropMenu(categories)
    activityView._displayCategoryDropMenu(categories)
    activityCategorySubtitle.style.display = 'none'
    assignToCategoryBtn.style.display = 'none'
  }

  _deleteActivity(e) {
    e.preventDefault()
    const element = model.state.activities[this.idToEdit]
    const activityID = element.id
    const activityCategory = element.category
    const categoryObject = model._findCategory(
      model.state.categories,
      activityCategory
    )
    model.state.deletedActivities.push(element)
    model._removeActivityFromArray(model.state.activities, this.idToEdit)
    model._deleteFromCategory(categoryObject, activityID)
    activityView._closeLogSessionForm()
    this._storeSortIDs(model.state.activities)
    mainView._render(model.state.activities)
  }

  _submitForm(e) {
    e.preventDefault()
    // Create Session and push to state
    const activityObject = model.state.activities[this.idToEdit]
    console.log(activityObject)
    const activityID = model.state.activities[this.idToEdit].id
    const activityCategory = model.state.activities[this.idToEdit].category
    const session = activityView._generateSession()
    activityObject.sessions.push(session)

    // Re-order activities & variations
    model._reOrderActivities(
      model.state.activities,
      this.idToEdit,
      activityObject
    )
    this._reOrderVariation(activityObject)

    // Return to MainView
    activityView._closeLogSessionForm()
    this._storeSortIDs(model.state.activities)

    mainView._render(model.state.activities)
    if (this._checkIfCategoryExists()) {
      mainView._generateCategoryTabs(model.state.categories)
      this._renderCategoryDropMenu()
    }

    // Re-order activities in it's category array
    if (model.state.categories.length > 0 && activityCategory) {
      const categoryObject = model._findCategory(
        model.state.categories,
        activityCategory
      )
      const activityObjectInCategory = model._findActivityObjectByID(
        categoryObject.activities,
        activityID
      )
      const sortIDInCategory = activityObjectInCategory.sortId
      model._reOrderActivities(
        categoryObject.activities,
        sortIDInCategory,
        activityObjectInCategory
      )
      this._storeSortIDs(categoryObject.activities)
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////// USER INTERFACE  //////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////

  _setIdToEdit(e) {
    // Returns "sortId"
    idToEdit = +e.target.closest('.activity_item').getAttribute('data-sortId')
    actualIdToEdit = +e.target
      .closest('.activity_item')
      .getAttribute('data-actualId')
  }

  handleswipe() {
    const diffX = this.touchstartX - this.touchendX
    const diffY = this.touchstartY - this.touchendY

    if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10)
      return (this.swipeDirection = '')

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Swiping horizontally
      if (diffX > 0) return (this.swipeDirection = 'left')
      if (diffX < 0) return (this.swipeDirection = 'right')
    }

    if (Math.abs(diffY) > Math.abs(diffX)) {
      // Swiping vertically
      if (diffY < 0) return (this.swipeDirection = 'down')
      if (diffY > 0) return (this.swipeDirection = 'up')
    }
  }
  init() {
    model.getLocalStorage()
    // console.log(model.state.activities)
    // console.log(model.state.deletedActivities)
    // console.log(model.state.categories)
    //Only keep this setLocalStorage() until 1/1/2023 when the other functions in model are also removed.
    model.setLocalStorage()
    mainView._render(model.state.activities)
    if (this._checkIfCategoryExists()) {
      mainView._generateCategoryTabs(model.state.categories)
      this._renderCategoryDropMenu()
    }
  }
}

const app = new App()
