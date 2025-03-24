type ImageSize = "360x450" | "70x70";
type TargetDir = "resized" | "thumbnail";

export const convertImageSrc = (
  src: string,
  targetDir: TargetDir,
  size: ImageSize
) => {
  return src
    ?.replace("images", targetDir)
    ?.replace(/\/([^/]+)\.webp$/, `/$1_${size}.webp`);
};
