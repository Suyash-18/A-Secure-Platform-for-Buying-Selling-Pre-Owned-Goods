import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


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
    avatar: avatar.url,
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







export {
  registerUser,
  loginUser
 };