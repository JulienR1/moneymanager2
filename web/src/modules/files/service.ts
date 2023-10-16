type Resolution = { width: number; height: number };

export async function compressImage(
  file: File,
  targetSize: number,
): Promise<File> {
  if (file.size <= targetSize) {
    return file;
  }

  const resolution = await getImageResolution(file);
  const ratio = resolution.width / resolution.height;
  const compressedResolution: Resolution = {
    width: Math.sqrt(ratio * targetSize),
    height: Math.sqrt(targetSize / ratio),
  };

  const canvas = document.createElement("canvas");
  canvas.width = compressedResolution.width;
  canvas.height = compressedResolution.height;
  document.body.appendChild(canvas);

  const context = canvas.getContext("2d");

  const img = new Image();
  img.src = window.URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    img.onload = function () {
      context?.drawImage(
        img,
        0,
        0,
        compressedResolution.width,
        compressedResolution.height,
      );

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], file.name, { type: blob.type }));
        } else {
          reject();
        }
        canvas.remove();
      }, "image/jpeg");
    };

    img.onerror = function () {
      reject();
      canvas.remove();
    };
  });
}

export async function encodeFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = function () {
      if (typeof reader.result === "string") {
        return resolve(reader.result);
      }
      return reject("Invalid return type: '" + typeof reader.result + "'");
    };

    reader.readAsDataURL(file);
  });
}

async function getImageResolution(imgFile: File): Promise<Resolution> {
  const img = document.createElement("img");
  img.src = window.URL.createObjectURL(imgFile);
  document.body.appendChild(img);

  return new Promise((resolve, reject) => {
    img.onload = function () {
      resolve({ width: img.width, height: img.height });
      img.remove();
    };

    img.onerror = function () {
      reject();
      img.remove();
    };
  });
}
