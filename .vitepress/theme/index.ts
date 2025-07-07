// https://vitepress.dev/guide/custom-theme
import type { Theme } from "vitepress";
import Teek from "vitepress-theme-teek";

import "./style.css";
import "vitepress-theme-teek/index.css";
import "./style/var.css";

import { h } from "vue";
import { useData } from "vitepress";

export default {
  extends: Teek,
} satisfies Theme;
