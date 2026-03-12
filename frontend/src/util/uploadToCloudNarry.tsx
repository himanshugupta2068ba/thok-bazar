export const uploadToCloudiniary = async (file: File) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error(
            "Missing Cloudinary config. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in frontend/.env and restart Vite."
        );
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(url, {
        method: "POST",
        body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
        const errorMessage = data?.error?.message || "Cloudinary upload failed";
        throw new Error(errorMessage);
    }

    if (!data?.secure_url) {
        throw new Error("Cloudinary response missing secure_url");
    }

    return data.secure_url as string;
};