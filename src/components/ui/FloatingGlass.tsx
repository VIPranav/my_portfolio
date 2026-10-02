import GlassSurface from "./GlassSurface";

export default function FloatingGlass() {
  return (
    <GlassSurface
      width="100%"
      height="100%"
      borderRadius={28}
      distortionScale={-150}
      redOffset={5}
      greenOffset={15}
      blueOffset={25}
      brightness={60}
      opacity={0.8}
      displace={0.7}
      backgroundOpacity={0.08}
      saturation={1.4}
      mixBlendMode="screen"
      className="floating-glass"
    />
  );
}
