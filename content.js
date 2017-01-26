const $ = (selector) => document.querySelector(selector);
// Set quality to auto
const auto = () => {
  $('.ytp-settings-button').click();
  $('.ytp-settings-menu .ytp-menuitem:last-child').click();
  $('.ytp-quality-menu .ytp-menuitem:last-child').click();
};
// Set quality to lowest
const low = () => {
  $('.ytp-settings-button').click();
  $('.ytp-settings-menu .ytp-menuitem:last-child').click();
  $('.ytp-quality-menu .ytp-menuitem:nth-last-child(2)').click();
};
// Listen for when document is hidden
document.addEventListener('visibilitychange', () => {
	document.hidden ? low() : auto();
}, false);
