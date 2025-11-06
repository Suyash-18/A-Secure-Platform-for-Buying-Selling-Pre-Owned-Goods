import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { OAuth2Client } from "google-auth-library";


const generateAccessAndRefreshTokens = async (userId) => {
  try {
        const user = await User.findById(userId);
        const AccessToken = user.generateAccessToken()
        const RefreshToken = user.generateRefreshToken()
        user.refreshToken = RefreshToken;
       await  user.save({ validateBeforeSave:false })

       return {AccessToken,RefreshToken}
  } catch (error) {
        throw new ApiError(500,"something went while generating Access And Refresh Tokens")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  // console.log("Received Files:", req.files);
  // console.log("Received Body:", req.body);

  const { fullname, username, email, password } = req.body;

  // ✅ Check if required fields are empty
  if (!fullname?.trim() || !username?.trim() || !email?.trim() || !password?.trim()) {
    throw new ApiError(400, "All fields should be filled");
  }

  // ✅ Check if user already exists
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User Already Exists");
  }

  // ✅ Ensure req.files exists before accessing files
  const avatarLocalPath = req.files?.avatar?.[0]?.path || null;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // ✅ Upload images to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  let coverImage = null;
  if (coverImageLocalPath) {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
  }

  if (!avatar) {
    throw new ApiError(500, "Failled to upload avatar to Cloudinary");
  }

  // ✅ Create User
  const user = await User.create({
    fullname,
    avatar: avatar?.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // ✅ Fetch user details (excluding password & refreshToken)
  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
});



const loginUser = asyncHandler( async (req,res) => {
//req.body =  data 

const {username,email,password} = req.body

//username or email

if(!username && !email){
  throw new ApiError(400,"username or email is required")
}


//find the user 

const user = await User.findOne({
  $or : [{username},{email}]
})

if(!user){
  throw new ApiError(404,"user does not exits")
}

// password check

const isPasswordValid = await user.isPasswordCorrect(password)
if(!isPasswordValid){
  throw new ApiError(401,"invalid user credential")
}
// access and refresh token 
const {AccessToken,RefreshToken} = await generateAccessAndRefreshTokens(user._id)
// send token through cookies 

 const logedinUser = await  User.findById(user._id).
 select("-password -refreshToken")
 const option = {
  httpOnly : true,
  secure : true,
  sameSite:"strict"
 }
 console.log("user logged in");
 return res.status(200)
 .cookie("AccessToken",AccessToken,option)
 .cookie("RefreshToken",RefreshToken,option)
 .json(
  new ApiResponse(
    200,{user: logedinUser,AccessToken,RefreshToken},
    "user logedin succfully"
  )
 )

})


const logoutUser = asyncHandler(async(req,res)=>{

})
const client = new OAuth2Client("178540745723-jkllm1668tn8tjis51ishui0al180gjl.apps.googleusercontent.com"); 


export const googleLoginUser = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // ✅ Create Google user with defaults for required fields
     user = await User.create({
  username: name || email.split("@")[0],
  fullname: name || "", // ✅ added this line
  email,
  avatar: picture,
  password: "google_auth_user", // or null if not required
  provider: "google",
});

    }

    // If you use JWTs:
    // const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      data: { user },
      // token,
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(400).json({ message: "Invalid Google token" });
  }
};
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { fullname, username, email } = req.body;
  const updates = { fullname, username, email };

  // ✅ Check if username or email already exists (for other users)
  if (username) {
    const existingUser = await User.findOne({ username, _id: { $ne: userId } });
    if (existingUser) {
      throw new ApiError(400, "Username already taken!");
    }
  }
  if (email) {
    const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
    if (existingEmail) {
      throw new ApiError(400, "Email already registered!");
    }
  }

  // ✅ Update user data
  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(
    new ApiResponse(200, updatedUser, "Profile updated successfully")
  );
});

export {
  registerUser,
  loginUser,
  updateProfile
 };