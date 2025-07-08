import { defineConfig } from "vitepress";
import { defineTeekConfig } from "vitepress-theme-teek/config";

import Permalink from "vitepress-plugin-permalink";

const teekConfig = defineTeekConfig({
  teekTheme: true,
  vite: {
    plugins: [Permalink(/* options */)],
  },
});

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "植创社",
  description:
    "植创社成立于2025年3月，植根PvZ社区，服务PvZ同人创作，挖掘PvZ文化深度，建设PvZ文化符号",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "社团信息", link: "/society-info/members" },
    ],
    sidebar: {
      "/society-info/": {
        base: "/society-info/",
        items: [
          { text: "人员表", link: "members" },]
      }
    },
    logo: "/logo.png",
    siteTitle: "植创社",
  },
  extends: teekConfig,
});
