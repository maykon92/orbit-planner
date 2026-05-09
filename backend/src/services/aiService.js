import OpenAI from "openai";
import Item from "../models/Item.js";
import Tab from "../models/Tab.js";

const getOpenAIClient = () => {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is missing in backend .env file.");
    }

    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
};

export const generateUserSuggestion = async ({userId, prompt, type, context = {}}) => {
    const tabs = await Tab.find({ userId }).select("name type");

    const itemQuery = { userId };

    if (context.currentTabId) {
        itemQuery.tabId = context.currentTabId;
    }

    const items = await Item.find(itemQuery)
    .select("title description type status data createdAt tabId")
    .sort({ createdAt: -1 })
    .limit(40);

    const userContext = {
        currentContext: context,
        tabs,
        items,
    };

    const response = await getOpenAIClient().responses.create({
        model: "gpt-5.5",
        input: [
        {
            role: "system",
            content:
              "You are Orbit Planner AI, a helpful assistant inside a personal life planning app. Use the current screen context when provided. If the user is inside a specific tab, focus your answer on that tab and its items. Give practical, personalised suggestions based only on the user's saved data. If data is limited, say that clearly and suggest next steps.",
        },
        {
            role: "user",
            content: JSON.stringify({
            requestType: type,
            userPrompt: prompt,
            userContext,
            }),
        },
        ],
    });

    return response.output_text;
};