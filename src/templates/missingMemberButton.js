export default (buttonSettings) => {
    `<div class="btn-filter state-button background-color-${buttonSettings.count}" data-filter=".${buttonSettings.categoryID}">
    <a>${buttonSettings.Category}</a>
  </div>`
}