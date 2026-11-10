export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async () => {
    browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    let tabs = await browser.tabs.query({});
    console.log(tabs);
   });
});
