const convertToBlob = (ctx, name) => {
  return new Promise((resolve) => {
    ctx.canvas.toBlob((blob) =>{
      resolve(new File([blob], name, {
        type: 'image/png',
      }));
    }, 'image/png', 1);
  });
}
export async function convertToPng(data) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const arr = data.name.split('.');
        arr[arr.length - 1] = 'png';
        const res = await convertToBlob(ctx, arr.join('.'));
        resolve(res);
      }
      img.src = e.target.result;
    }
    reader.readAsDataURL(data);
  });
}

export async function convertURLToImage(imageURL) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageURL;
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const res = canvas.toDataURL();
      resolve(res);
    }
  });
}

export const getPngName = (name) => {
  const arr = name.split('.');
  arr[arr.length - 1] = 'png';
  return arr.join('.');
}