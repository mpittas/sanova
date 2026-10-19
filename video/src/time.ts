import { useCurrentFrame as remotionFrame } from "remotion";
import { FPS } from "./theme";

/** The film is rendered at 60fps but timed in 30fps "beats": every frame number in the scenes is a beat. */
export const BEAT = 30;
export const useCurrentFrame = () => (remotionFrame() * BEAT) / FPS;
