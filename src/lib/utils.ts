export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const loadImage = (src: string): Promise<HTMLImageElement | null> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
};

export const compressImageForCloud = async (base64: string, maxWidth = 600): Promise<string> => {
  if (typeof window === 'undefined') return base64;
  
  const img = await loadImage(base64);
  if (!img) return base64;
  
  const canvas = document.createElement('canvas');
  let width = img.width;
  let height = img.height;
  
  if (width > maxWidth) {
    height *= maxWidth / width;
    width = maxWidth;
  }
  
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return base64;
  
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', 0.6);
};

export const copyToClipboard = (text: string) => {
  if (typeof window === 'undefined') return;
  
  if (navigator.clipboard) {
     navigator.clipboard.writeText(text).catch(err => {
        console.error('Failed to copy: ', err);
     });
  } else {
    // Fallback
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Unable to copy', err);
    }
    document.body.removeChild(textArea);
  }
};
