import { Composition, Still } from "remotion";
import { Dashboard } from "./Dashboard";
import { Shot, SHOT_H, SHOT_W, type ShotProps } from "./Shot";
import { FPS, HEIGHT, WIDTH, DURATION } from "./theme";

/** The five portfolio stills: a different page and a different camera angle each. */
export const shots: { id: string; props: ShotProps }[] = [
  { id: "Shot1", props: { image: "dashboard", rx: 7, ry: -15, rz: 2.2, blur: "right", amount: 12 } },
  { id: "Shot2", props: { image: "appointments", rx: 9, ry: 14, rz: -2.4, blur: "left", amount: 12 } },
  { id: "Shot3", props: { image: "reports", rx: -8, ry: -11, rz: -1.6, blur: "bottom", amount: 12 } },
  { id: "Shot4", props: { image: "billing", rx: 12, ry: 18, rz: 2.8, blur: "left", amount: 10 } },
  { id: "Shot5", props: { image: "doctors", rx: 6, ry: 9, rz: 1.6, blur: "top", amount: 12 } },
];

export const Root = () => (
  <>
    <Composition id="Dashboard" component={Dashboard} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
    {shots.map(({ id, props }) => (
      <Still key={id} id={id} component={Shot} width={SHOT_W} height={SHOT_H} defaultProps={props} />
    ))}
  </>
);
