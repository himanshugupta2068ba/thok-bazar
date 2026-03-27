type OptimizeImageOptions = {
  fit?: "crop" | "fill" | "max";
  height?: number;
  quality?: number | "auto";
  width?: number;
};

const CLOUDINARY_UPLOAD_SEGMENT = "/image/upload/";

const normalizeDimension = (value?: number) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue > 0
    ? Math.round(numericValue)
    : null;
};

export const optimizeImageUrl = (
  source?: string,
  { fit = "max", height, quality = "auto", width }: OptimizeImageOptions = {},
) => {
  const normalizedSource = String(source || "").trim();

  if (!normalizedSource) {
    return "";
  }

  const normalizedWidth = normalizeDimension(width);
  const normalizedHeight = normalizeDimension(height);

  if (normalizedSource.includes("res.cloudinary.com") && normalizedSource.includes(CLOUDINARY_UPLOAD_SEGMENT)) {
    const transformations = ["f_auto"];

    if (quality === "auto") {
      transformations.push("q_auto:good");
    } else {
      transformations.push(`q_${quality}`);
    }

    if (normalizedWidth) {
      transformations.push(`w_${normalizedWidth}`);
    }

    if (normalizedHeight) {
      transformations.push(`h_${normalizedHeight}`);
      transformations.push(`c_${fit === "max" ? "fill" : fit}`);
    }

    const [prefix, suffix] = normalizedSource.split(CLOUDINARY_UPLOAD_SEGMENT);
    return `${prefix}${CLOUDINARY_UPLOAD_SEGMENT}${transformations.join(",")}/${suffix}`;
  }

  if (normalizedSource.includes("images.unsplash.com") || normalizedSource.includes("plus.unsplash.com")) {
    try {
      const url = new URL(normalizedSource);
      url.searchParams.set("auto", "format");
      url.searchParams.set("q", quality === "auto" ? "75" : String(quality));
      url.searchParams.set("fit", normalizedHeight ? "crop" : fit);

      if (normalizedWidth) {
        url.searchParams.set("w", String(normalizedWidth));
      }

      if (normalizedHeight) {
        url.searchParams.set("h", String(normalizedHeight));
      }

      return url.toString();
    } catch {
      return normalizedSource;
    }
  }

  return normalizedSource;
};
