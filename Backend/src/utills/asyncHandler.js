const asyncHandler = (requesthandler) => {
    return (req,res,next) => {
        Promise.resolve(requesthandler(req,res,next))
        .catch((error) => next(error))
    }
}

export {asyncHandler}












// const asyncHandler = (fn) => async (req,res,next) => {
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         console.log(error.code || 500);
//         res.status(error.code|| 500).json({
//             success: false,
//             message: error.message,
//         })
        
//     }
// }