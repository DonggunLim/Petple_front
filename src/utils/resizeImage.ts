const resizeImage = (file: File, maxWidth = 300): Promise<File> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject("canvas 읽기 실패하였습니다.");
        return;
      }
      const aspectRatio = image.height / image.width;
      const newWidth = maxWidth;
      const newHeight = newWidth * aspectRatio;

      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.drawImage(image, 0, 0, newWidth, newHeight);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject("이미지 변환에 실패하였습니다.");
            return;
          }
          const resizedFile = new File(
            [blob],
            file.name.replace(/\.\w+$/, ".webp"),
            {
              lastModified: Date.now(),
              type: "image/webp",
            }
          );
          resolve(resizedFile);
        },
        "image/webp",
        0.8
      );
    };
  });
};

export default resizeImage;
