import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Otp } from "../models/otp.model.js";

import { sendEmail } from "../utils/sendMail.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {

    const user = await User.findById(userId);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
 
    return { accessToken, refreshToken };
  } catch (
    err
)
  {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    throw new ApiError(400, "Confirm Password should match with password");
  }
  if (!fullName) {
    throw new ApiError(400, "Full Name is required");
  }
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with this Email already existed");
  }
  //  console.log(req.files);

  const user = await User.create({
    fullName,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-email -password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, "email is required");
  }
  if (!password) {
    throw new ApiError(400, "password is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  // console.log("acc ", accessToken);
  // console.log("ref ", refreshToken);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // loggedInUser.password;
  // const options = {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "lax"
  // };
  //  res.cookie('test', '12345', {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: 'none',
  //   maxAge: 1000 * 60 * 60 * 24
  // });
  
  // const options = {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "none",
  //   maxAge: 1000 * 60 * 60 * 24 * 7
  // };
  // const options={
  //    httpOnly: true,
  //     secure: process.env.NODE_ENV === 'production', // true in production
  //     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  //     maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  // }
  // for development purpose only
//  const options  ={
//   httpOnly: true,
//   secure: true,
//   sameSite: 'none',
//   domain: 'your-frontend.com',
//   maxAge: 24 * 60 * 60 * 1000,
// }
// const options={
//   httpOnly: true,            // Prevent access by JS in the browser
//   secure: true,              // Send cookie only over HTTPS
//   sameSite: 'none',          // Required for cross-origin requests
//   domain: 'inventoryapp122.netlify.app', // Set your frontend domain
//   path: '/',                 // Default path
//   maxAge: 24 * 60 * 60 * 1000, // Example: cookie valid for 1 day
// }
// const options = {
//     httpOnly: true,
//     secure: true,
//     sameSite: 'none',
//     path: '/',
//     maxAge: 24 * 60 * 60 * 1000,
//   }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          user: { loggedInUser, password },
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
  // return res
  //   .status(200)
  //   .cookie("accessToken", accessToken, options)
  //   .cookie("refreshToken", refreshToken, options)
  //   .json(
  //     new ApiResponse(
  //       200,
  //       {
  //         user: { loggedInUser, password },
  //         accessToken,
  //         refreshToken,
  //       },
  //       "User logged In Successfully"
  //     )
  //   );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  // const options = {
  //   httpOnly: true,
  //   secure: true,
  // };

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged Out Succesfully"));
  // return res
  //   .status(200)
  //   .clearCookie("accessToken", options)
  //   .clearCookie("refreshToken", options)
  //   .json(new ApiResponse(200, {}, "User logged Out Succesfully"));
});

const sendMail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  //   console.log(email)
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(500, "Invalid user email");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await sendEmail({
    to: email,
    subject: "OTP for Password Reset",
    html: `Your otp is ${otp}`,
  });
  await Otp.create({ email, otp });
  return res
    .status(200)
    .json(new ApiResponse(200, { userId: user._id }, "OTP sent successfully"));
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  console.log(email)
  console.log(otp)
  if (!otp) {
    new ApiError(400, "Otp is not recieved");
  }
  const OTP = await Otp.findOne({ email });
  if (!OTP) {
    throw new ApiError(400, "No otp for this mail ");
  } 
   console.log(OTP.otp)
  if (Number(otp) !== OTP.otp) {
    throw new ApiError(400, "Invalid OTP");
  }
  return res.status(200).json(new ApiResponse(200, {}, "OTP Matched"));
});

const createNewPassword = asyncHandler(async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (!password || !confirmPassword) {
    throw new ApiError(400, "Both passwords are required");
  }
  if (password !== confirmPassword) {
    throw new ApiError(400, "Both passwords didnot matched");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "Invalid User");
  }
  user.password = password;
  await user.save();
  await Otp.deleteOne({ email });
  return res.status(200).json((new ApiResponse(200, {}, "New Password Created")));
});

const editUserInfo = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  //validations
  const userID = req.user._id;

  const user = await User.findById(userID); 
  if (!user) throw new ApiError(404, "User not found");

  if (password !== confirmPassword) {
    throw new ApiError(400, "Both passwords didnot matched");
  }
  if (email && email !== user.email) {
    const existedMail = await User.findOne({ email });
    if (existedMail) {
      throw new ApiError(400, "Email is already taken by another user");
    }
    user.email = email;
  }


  user.fullName = `${firstName} ${lastName}`;
  if (password) user.password = password;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User info gets updated"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  sendMail,
  verifyOTP,
  createNewPassword,
  editUserInfo,
};
