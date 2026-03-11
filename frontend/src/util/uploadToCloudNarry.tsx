export const  uploadToCloudiniary=async(file:any)=>{
    const cloud_name=import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const upload_preset=import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const url=`https://api.cloudinary.com/v1_1/${cloud_name}/upload`;
    const formData=new FormData();
    formData.append("file",file);
    formData.append("upload_preset",upload_preset);
}