import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import gamini from "../utills/gamini.js";
import moment from 'moment'

const gaminiResponse = async (req, res) => {
    try {
        const { prompt, assistentName, name } = req.body;
         
        const response = await gamini(prompt, assistentName, name);

        if (!response) {
            throw new ApiError(500, "No response from Gemini API.");
        }

        const textResponse = response?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textResponse) {
            throw new ApiError(500, "No valid response from Gemini.");
        }

        const cleanResponse = textResponse.replace(/```json|```/g, '').trim();

        let parsedJson;
        try {
            parsedJson = JSON.parse(cleanResponse);
        } catch (parseError) {
            throw new ApiError(500, "Failed to parse JSON from Gemini response.");
        }

        console.log("Parsed Gemini response:", parsedJson);
        

        const {type} = parsedJson;


        if(!type){
            throw new ApiError(400,"type is requird")
        }

        switch(type){
            case 'get_date' : {
                return res.status(200).json(
                    new ApiResponse(
                        200,
                        {
                            type: "get_date",
                            userinput:parsedJson.userinput,
                            response: `Today's date is ${moment().format("YYYY-MM-DD")} `
                        },
                    )
                )
            }

            case 'get_month' : {
                return res.status(200).json(
                    new ApiResponse(
                        200,
                        {
                            type: "get_time",
                            userinput:parsedJson.userinput,
                            response: `Today's date is ${moment().format("MMMM")} `
                        },
                    )
                )
            }

            case 'get_time' : {
                return res.status(200).json(
                    new ApiResponse(
                        200,
                        {
                            type: "get_time",
                            userinput:parsedJson.userinput,
                            response: `current time is ${moment().format("hh:mm A")} `
                        },
                    )
                )
            }

            case 'get_day' : {
                return res.status(200).json(
                    new ApiResponse(
                        200,
                        {
                            type: "get_time",
                            userinput:parsedJson.userinput,
                            response: `Today's day is ${moment().format("DDDD")} `
                        },
                    )
                )
            }

            case 'google_search':
            case 'youtube_search':
            case 'youtube_play':
            case 'general':
            case "calculator_open":
            case "instagram_open":
            case "facebook_open":
            case "weather-show" :
                return res.status(200).json(
                    new ApiResponse(
                        200,
                        {
                            type: type,
                            userInput: parsedJson.userInput,
                            response: parsedJson.response,
                            sources: parsedJson.sources
                        },
                    )
                );

            default:
                return res.status(400).json(
                    new ApiError(
                        400,
                        "I don't understand that request.",
                    )
                );
        }

        // return res.status(200).json(
        //     new ApiResponse(
        //         200,
        //         parsedJson,
        //         "Gemini response retrieved successfully"
        //     )
        // );

    } catch (error) {
        console.error("Gemini error:", error.message || error);
        return res.status(error.statusCode || 500).json(
            new ApiError(
                error.statusCode ,
                error.message || "Internal Server Error"
            )
        );
    }
};

export { gaminiResponse };
