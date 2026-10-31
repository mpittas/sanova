import { Composition, Still } from "remotion";
import { Dashboard } from "./Dashboard";
import { Detail, detailLayout, type DetailProps } from "./Detail";
import { Shot, SHOT_H, SHOT_W, type ShotProps } from "./Shot";
import { FPS, HEIGHT, WIDTH, DURATION } from "./theme";

/** The five portfolio stills: a different page and a different camera angle each. */
export const shots: { id: string; props: ShotProps }[] = [
  { id: "Shot1", props: { image: "dashboard", rx: 0, ry: 0, rz: 0, blur: "bottom", amount: 0 } },
  { id: "Shot2", props: { image: "appointments", rx: 0, ry: 0, rz: 0, blur: "left", amount: 0 } },
  { id: "Shot3", props: { image: "reports", rx: 0, ry: 0, rz: 0, blur: "top", amount: 0 } },
  { id: "Shot4", props: { image: "billing", rx: 0, ry: 0, rz: 0, blur: "left", amount: 0 } },
  { id: "Shot5", props: { image: "doctors", rx: 0, ry: 0, rz: 0, blur: "bottom", amount: 0 } },
];

/** Close-ups for the portfolio: one part of a page each, in the order they appear on the project page. */
export const details: { id: string; props: DetailProps }[] = [
  { id: "Detail1", props: { page: "dashboard", crop: { x: 342, y: 527, w: 1161, h: 653 }, blur: "bottom", rotate: -0.6 } },
  { id: "Detail2", props: { page: "dashboard", crop: { x: 1537, y: 527, w: 421, h: 540 }, blur: "bottom", rotate: 0.7 } },
  { id: "Detail3", props: { page: "reports", crop: { x: 1487, y: 512, w: 471, h: 604 }, blur: "bottom", rotate: -0.7 } },
  { id: "Detail4", props: { page: "reports", crop: { x: 342, y: 512, w: 1116, h: 628 }, blur: "bottom", rotate: 0.6 } },
  { id: "Detail5", props: { page: "doctors", crop: { x: 341, y: 515, w: 1118, h: 629 }, blur: "bottom", rotate: -0.6 } },
  { id: "Detail6", props: { page: "billing", crop: { x: 1562, y: 435, w: 396, h: 495 }, blur: "bottom", rotate: 0.7 } },
  { id: "Detail7", props: { page: "telemedicine", crop: { x: 1537, y: 337, w: 421, h: 526 }, blur: "bottom", rotate: -0.7 } },
  { id: "Detail8", props: { page: "telemedicine", crop: { x: 342, y: 337, w: 1161, h: 653 }, blur: "bottom", rotate: 0.6 } },
];

export const Root = () => (
  <>
    <Composition id="Dashboard" component={Dashboard} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
    {shots.map(({ id, props }) => (
      <Still key={id} id={id} component={Shot} width={SHOT_W} height={SHOT_H} defaultProps={props} />
    ))}
    {details.map(({ id, props }) => {
      const size = detailLayout(props.crop);
      return <Still key={id} id={id} component={Detail} width={size.width} height={size.height} defaultProps={props} />;
    })}
  </>
);
