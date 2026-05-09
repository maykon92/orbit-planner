import { generateUserSuggestion } from "../services/aiService.js";

export const suggest = async (req, res) => {
    try {
        const { prompt, type, context } = req.body;

        if (!prompt) {
            return res.status(400).json({
                message: "Prompt is required.",
            });
        }

        const result = await generateUserSuggestion({
            userId: req.user._id,
            prompt,
            type: type || "general",
            context: context || {},
        });

        res.json({
            result,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};