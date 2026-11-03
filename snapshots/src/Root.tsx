import { Still, staticFile, type CalculateMetadataFunction } from "remotion";
import { getImageDimensions } from "@remotion/media-utils";
import { Snapshot, computeLayout, type SnapshotProps } from "./Snapshot";

const defaultProps: SnapshotProps = { items: [{ image: "captures/example.png" }] };

/** Size the canvas from the image proportions, so every snapshot gets exactly the room it needs. */
const calculateMetadata: CalculateMetadataFunction<SnapshotProps> = async ({ props }) => {
  const items = await Promise.all(props.items.map(async (item) => ({ ...item, natural: await getImageDimensions(staticFile(item.image)) })));
  const layout = computeLayout({ ...props, items });
  return { width: layout.width, height: layout.height, props: { ...props, items } };
};

export const Root = () => <Still id="Snapshot" component={Snapshot} width={2560} height={1440} defaultProps={defaultProps} calculateMetadata={calculateMetadata} />;
