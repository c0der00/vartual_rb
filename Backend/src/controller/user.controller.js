import { asyncHandler } from "../utills/asyncHandler.js"
import { ApiError } from "../utills/ApiError.js"
import { ApiResponse } from "../utills/ApiResponse.js"
import { User } from "../model/user.model.js"

const generateAccessAndRefereshToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const refreshToken = user.generateRefreshToken()
        const accsessToken = user.generateAccessToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accsessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "somthing want wrrong at generateAccessAndRefereshToken")
    }
}


const registerUser = asyncHandler(async (req, res) => {
    console.log(req.body);
    if (!req.body) {
        console.log("req body is emty",);
        return new ApiError(500, "req bosy is empty")
    }



    const { name, password, email } = req.body

    if (
        [name, password, email].some((field) => field?.trim === "")
    ) {
        return new ApiError(400, "All field is required")
    }

    const existedUser = await User.findOne({
        $or: [{ name }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "user with email and username is already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
    })

    if (password.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters long");
    }


    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(202).json(
        new ApiResponse(200, createdUser, "user register is sccessfuly register")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    console.log("body ",req.body);
    
    const { email, name, password } = req.body

    if (!name && !email) {
        throw new ApiError(400, "username or password is required")
    }

    const user = await User.findOne({
        $or: [{ name }, { email }]
    })

    if (!user) {
        throw new ApiError(400, "user is not exits")
    }

    const isPasswoedValid = await user.isPasswordCorrect(password)

    if (!isPasswoedValid) {
        throw new ApiError(401, "invalid user  credential")
    }

    const { accsessToken,refreshToken } = await generateAccessAndRefereshToken(user?._id)



    const loggrdUser = await User.findById(user._id)
        .select("-password  -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accsessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggrdUser,
                accessToken: accsessToken,
                refreshToken: refreshToken
            },
                "user logged in seccessfully"
            )
        )
})

const logoutUser = asyncHandler(async(req,res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $unset : {
                refreshToken : 1
            }
        },
        {
            new : true
        }
    )
    const options ={
        httpOnly : true,
        secure : true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken")
    .json(new ApiResponse(200,{},'userlogout'))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    .select("-password -refreshToken");
   
    if (!user) {    
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "user profile fetched successfully"
        )
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
};