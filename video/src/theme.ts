import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/MartianMono";

export const FPS = 60;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION = 17 * FPS;

export const sans = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] }).fontFamily;
export const mono = loadMono("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

/** The Sanova palette, trimmed to what the film uses. */
export const c = {
  ink: "#333333",
  text: "#27332d",
  muted: "#6b7a72",
  line: "#eef1ef",
  bg: "#eeeff1",
  green: { 50: "#EDF9F3", 100: "#D5F1E3", 200: "#AEE3C9", 300: "#7BCFAA", 400: "#3FB583", 500: "#139A68", 600: "#0E8157", 700: "#0A6B49", 800: "#084630" },
  blue: { 50: "#EFF5FF", 100: "#DEE9FF", 300: "#92B3FF", 500: "#2F6BF2" },
  violet: { 50: "#F5F3FF", 100: "#EDE9FE", 300: "#C4B5FD", 500: "#8B5CF6" },
  amber: { 50: "#FFFBEB", 100: "#FEF3C7", 300: "#FCD34D", 500: "#F59E0B" },
  coral: { 50: "#FFF1EE", 100: "#FFE0DA", 300: "#FF9C8A", 500: "#F0563A" },
};
