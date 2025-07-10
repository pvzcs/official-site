// https://vitepress.dev/guide/custom-theme
import type { Theme } from "vitepress";
import Teek from "vitepress-theme-teek";

import "./style.css";
import "vitepress-theme-teek/index.css";
import "./style/var.css";

import MembersPagination from "./components/MembersPagination.vue";
import CountdownTimer from "./components/CountdownTimer.vue";

export default {
  extends: Teek,
  enhanceApp({ app }) {
    app.component('MembersPagination', MembersPagination);
    app.component("CountdownTimer", CountdownTimer)
  }
} satisfies Theme;
