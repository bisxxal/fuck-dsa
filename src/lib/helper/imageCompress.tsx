import Resizer from 'react-image-file-resizer';

export const resizeFile = (file: File): Promise<File> =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1200, // max width
      1200, // max height
      'WEBP', // format
      100, // quality (0-100)
      0, // rotation
      (uri) => {
        // Convert base64 to File if needed
        if (uri instanceof Blob) {
          const compressedFile = new File([uri], file.name, { type: file.type });
          resolve(compressedFile);
        } else {
          // For base64 output
          fetch(uri as string)
            .then((res) => res.blob())
            .then((blob) => {
              const compressedFile = new File([blob], file.name, { type: file.type });
              resolve(compressedFile);
            });
        }
      },
      'blob' // Output type: 'blob' or 'base64'
    );
  });