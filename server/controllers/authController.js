
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";


export const registerUser = async (req, res) => {
  try {
    let { fullname, email, mobile, password, confirmPassword ,role} = req.body;

    console.log(fullname, email, mobile, password, confirmPassword)
    
    fullname = fullname?.trim();
    email = email?.toLowerCase().trim();
    mobile = mobile?.toString().trim();

    
    if (!fullname || !email || !mobile || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    /* =========================
       MOBILE VALIDATION
    ========================== */
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Mobile number must be exactly 10 digits",
      });
    }

    /* =========================
       PASSWORD VALIDATION
    ========================== */
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }


    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname,
      email,
      mobile,
      password: hashedPassword,
      confirmPassword:hashedPassword,
      role
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        mobile: user.mobile,
      },
    });

  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while registering user",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login API called");
console.log("Email received:", email);

    // check fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    if(password.length<8){
     return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Not Exist !",
      });
    }

    console.log("user>>>====",user)

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    if(!token){
      return res.status(404).json({message:"Failed to generate Token",success:false})
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role:user.role,
        modile:user.mobile
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllUser = async (req,res)=>{
  try {
       const allUser = await User.find({})
       console.log("All Uses ====:====>",allUser)
       if(!allUser){
           return res.status(404).json({message:"Failed to Get All User",success:false})
       }
      res.status(201).json({message:"Get Alluser Successfully !",success:true,users:allUser})
    
  } catch (error) {
      res.status(404).json({message:"Error While Getting Alluser",success:false})
  }
}

export const deleteUser =async(req,res)=>{
  try {
    const deleteUser =   await User.findOneAndDelete(req.params.id)
    if(!deleteUser){
      return res.status(401).json({message:"Failed to Delete User",success:false})
    }

    res.status(201).json({message:"Delete User Successfully !",success:true})
  } catch (error) {
     res.status(404).json({message:"Error While Deleting User !",success:false})
  }
}

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    let { fullname, email, mobile, password, role } = req.body;

    // Trim & normalize
    fullname = fullname?.trim();
    email = email?.toLowerCase().trim();
    mobile = mobile?.toString().trim();

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

  
    if (mobile && !/^\d{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Mobile number must be exactly 10 digits",
      });
    }

    let hashedPassword = existingUser.password;
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters",
        });
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullname: fullname || existingUser.fullname,
        email: email || existingUser.email,
        mobile: mobile || existingUser.mobile,
        password: hashedPassword,
        role: role || existingUser.role,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        role: updatedUser.role,
      },
    });

  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating user",
    });
  }
};