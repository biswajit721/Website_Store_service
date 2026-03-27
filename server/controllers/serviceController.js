
import Service from "../models/service.model.js";
import fileUpload from "../service/Multer.js";

export const createService = async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      category,
      basePrice,
      displayPrice,
      liveDemoUrl,
      packages,
      faqs,
    } = req.body;

    /* =============================
       VALIDATION
    ============================== */
    console.log(req.body)
    console.log(title,description,category,basePrice)
    if (!title || !description || !category || !basePrice) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    /* =============================
       HANDLE FILES
    ============================== */

    const imageFiles = req.files?.image || [];
    const avatarFile = req.files?.avatar?.[0];

    console.log(imageFiles,avatarFile)

    if (!imageFiles.length) {
      return res.status(400).json({
        success: false,
        message: "At least one service image is required",
      });
    }

    /* =============================
       UPLOAD IMAGES TO IMAGEKIT
    ============================== */

    const uploadedImages = [];

    for (const file of imageFiles) {
      const base64File = file.buffer.toString("base64");

      const result = await fileUpload(
        base64File,
        `${Date.now()}-${file.originalname}`
      );

      uploadedImages.push(result.url);
    }

    let avatarUrl = null;

    if (avatarFile) {
      const base64Avatar = avatarFile.buffer.toString("base64");

      const avatarUpload = await fileUpload(
        base64Avatar,
        `${Date.now()}-${avatarFile.originalname}`
      );

      avatarUrl = avatarUpload.url;
    }


    const newService = await Service.create({
      title,
      author,
      description,
      category,
      image: uploadedImages, // make sure schema is array
      avatar: avatarUrl,
      basePrice,
      displayPrice,
      liveDemoUrl,
      packages: packages ? JSON.parse(packages) : {},
      faqs: faqs ? JSON.parse(faqs) : [],
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: newService,
    });
  } catch (error) {
    console.error("Create Service Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllService = async (req,res)=>{
  try {
    const getAllService =  await  Service.find({})
  if(!getAllService){
    return res.status(401).json({message:"Failed to get All Service",success:false})
  }

  res.status(201).json({message:'Get AllServices Successfully !',success:true,service:getAllService})
  } catch (error) {
     res.status(404).json({message:"Error While Getting All Service",success:false})
  }
}

export const deleteService = async (req,res)=>{
  try {
      const {id}=req.params
      if(!id){
        return res.status(404).json({message:"Failed to get Id",success:false})
      }
     const deleteService =  await Service.findByIdAndDelete(id)

     if(!deleteService){
          return res.status(401).json({message:"Failed to delete Service"})
     }

     res.status(201).json({message:"Delete Service Successfully !",success:true})
  } catch (error) {
      res.status(404).json({message:"Error While Deleting Service",success:false})
  }
}

// ─── paste this into your serviceController.js ───────────────────────────────

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Service ID is required" });
    }

    const existingService = await Service.findById(id);
    if (!existingService) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const {
      title, author, description, category,
      basePrice, displayPrice, originalPrice,
      liveDemoUrl, deliveryTime, packages, faqs,
      keepImages,   // existing image URLs the frontend wants to keep
      removeAvatar, // "true" if avatar should be removed
    } = req.body;

    /* ── IMAGES ──────────────────────────────────────────────────────────────
       FIX: multer parses req.body as a null-prototype object, so calling
       req.body.hasOwnProperty() throws TypeError. Use Object.prototype.
       hasOwnProperty.call(req.body, key) — or the even simpler "key in
       req.body" — to safely check presence.
    ──────────────────────────────────────────────────────────────────────── */

    // Normalise keepImages → always an array of strings
    let keptUrls = [];
    if (keepImages !== undefined) {
      keptUrls = Array.isArray(keepImages) ? keepImages : [keepImages];
    }

    // Upload brand-new image files (if any were sent)
    const imageFiles = req.files?.image || [];
    const freshUrls  = [];

    for (const file of imageFiles) {
      const b64    = file.buffer.toString("base64");
      const result = await fileUpload(b64, `${Date.now()}-${file.originalname}`);
      freshUrls.push(result.url);
    }

    // Decide final image array using safe prototype call instead of .hasOwnProperty()
    let finalImages;
    if ("keepImages" in req.body) {
      // Frontend explicitly declared what to keep → kept + new
      finalImages = [...keptUrls, ...freshUrls];
    } else {
      // No keepImages key at all → preserve all originals + append new
      finalImages = [...existingService.image, ...freshUrls];
    }

    if (finalImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one service image is required",
      });
    }

    /* ── AVATAR ─────────────────────────────────────────────────────────── */
    let finalAvatar = existingService.avatar;

    const avatarFile = req.files?.avatar?.[0];
    if (avatarFile) {
      const b64    = avatarFile.buffer.toString("base64");
      const result = await fileUpload(b64, `${Date.now()}-${avatarFile.originalname}`);
      finalAvatar  = result.url;
    } else if (removeAvatar === "true") {
      finalAvatar = null;
    }

    /* ── UPDATE PAYLOAD ─────────────────────────────────────────────────── */
    const updateData = {
      ...(title        && { title }),
      ...(author       && { author }),
      ...(description  && { description }),
      ...(category     && { category }),
      ...(basePrice    && { basePrice: Number(basePrice) }),
      ...(displayPrice !== undefined && { displayPrice }),
      ...(originalPrice !== undefined && originalPrice !== "" && {
        originalPrice: Number(originalPrice),
      }),
      ...(liveDemoUrl  !== undefined && { liveDemoUrl }),
      ...(deliveryTime !== undefined && deliveryTime !== "" && {
        deliveryTime: Number(deliveryTime),
      }),
      image:  finalImages,
      avatar: finalAvatar,
      ...(packages && {
        packages: typeof packages === "string" ? JSON.parse(packages) : packages,
      }),
      ...(faqs && {
        faqs: typeof faqs === "string" ? JSON.parse(faqs) : faqs,
      }),
    };

    const updated = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service: updated,
    });

  } catch (error) {
    console.error("Update Service Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};