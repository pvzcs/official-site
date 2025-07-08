// https://vitepress.dev/guide/custom-theme
import type { Theme } from "vitepress";
import Teek from "vitepress-theme-teek";

import "./style.css";
import "vitepress-theme-teek/index.css";
import "./style/var.css";

import MembersPagination from "./components/MembersPagination.vue";

export default {
  extends: Teek,
  enhanceApp({ app }) {
    app.component('MembersPagination', MembersPagination);
  }
} satisfies Theme;
