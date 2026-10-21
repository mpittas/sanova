import { Composition, Still } from "remotion";
import { Dashboard } from "./Dashboard";
import { Shot, SHOT_H, SHOT_W, type ShotProps } from "./Shot";
import { FPS, HEIGHT, WIDTH, DURATION } from "./theme";

/** The five portfolio stills: a different page and a different camera angle each. */
export const shots: { id: string; props: ShotProps }[] = [
  { id: "Shot1", props: { image: "dashboard", rx: 0, ry: 0, rz: 0, blur: "right", amount: 0 } },
  { id: "Shot2", props: { image: "appointments", rx: 0, ry: 0, rz: 0, blur: "left", amount: 0 } },
  { id: "Shot3", props: { image: "reports", rx: 0, ry: 0, rz: 0, blur: "top", amount: 0 } },
  { id: "Shot4", props: { image: "billing", rx: 0, ry: 0, rz: 0, blur: "left", amount: 0 } },
  { id: "Shot5", props: { image: "doctors", rx: 0, ry: 0, rz: 0, blur: "right", amount: 0 } },
];

export const Root = () => (
  <>
    <Composition id="Dashboard" component={Dashboard} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
    {shots.map(({ id, props }) => (
      <Still key={id} id={id} component={Shot} width={SHOT_W} height={SHOT_H} defaultProps={props} />
    ))}
  </>
);
