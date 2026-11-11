import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    permissions: ["tabs"],
    description:  "Search, sort, close and sleep tabs from the side panel. Free up memory by putting tabs you're not using to sleep.",
    name: "Tabbernate – Tab Manager and Memory Saver",
  },
});
