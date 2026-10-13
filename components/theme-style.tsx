import { buildThemeCss } from "@/lib/tokens";

/** Injects design-token CSS variables and type-scale classes generated from lib/tokens.ts. */
export function ThemeStyle() {
  return <style dangerouslySetInnerHTML={{ __html: buildThemeCss() }} />;
}
