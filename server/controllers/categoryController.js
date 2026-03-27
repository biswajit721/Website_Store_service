import Category from "../models/category.model.js";



export const createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
  console.log(name,description,icon)
    console.log(name,description,icon)

    // 1️⃣ Validation
    if (!name?.trim() || !description?.trim() || !icon?.trim()) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2️⃣ Check for duplicate category
    const existingCategory = await Category.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    // 3️⃣ Create category
    const category = await Category.create({
      name: name.trim(),
      description: description.trim(),
      icon: icon.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });

  } catch (error) {
    console.error("Create Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while creating category",
    });
  }
};

export const deleteCategory = async (req,res)=>{
    try {
        const {id}=req.params
    if(!id){
        return res.status(404).json({message:"Id not Found !",success:false})
    }
    const categoryDelete = await Category.findByIdAndDelete(id)

    res.status(201).json({message:"Category Deleted Successfully !",success:true,category:categoryDelete})
    } catch (error) {
        res.status(500).json({message:"Error While Deleteing Category !",success:false})
    }
}

export const getAllCategory = async (req,res)=>{
       try {
           const allCategory =  await  Category.find({})
           if(!allCategory){
            return res.status(404).json({message:"Failed to get all category!",success:false})
           }
           res.status(201).json({message:"Get All Category Successfully !",success:true,category:allCategory})
       } catch (error) {
          res.status(500).json({message:"Error While Getting All Category",success:false})
       }
}

export const updateCatgory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    const { id } = req.params;
 
    if (!id) {
      return res.status(400).json({ message: "Id Not Found", success: false });
    }
 
    if (!name?.trim() || !description?.trim() || !icon?.trim()) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }
 
    // FIX: use findByIdAndUpdate (not findOneAndUpdate with id as filter object)
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description, icon },
      { new: true, runValidators: true }
    );
 
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found", success: false });
    }
 
    res.status(200).json({
      message: "Category updated successfully!",
      success: true,
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Update Category Error:", error);
    res.status(500).json({ message: "Error while updating category!", success: false });
  }
};
 