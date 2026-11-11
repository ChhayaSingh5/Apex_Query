import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
import { isLoggedIn } from "../../middleware.js";

const router = express.Router();


// Get all threads
router.get("/thread", isLoggedIn, async(req, res) => {
    try {
        const threads = await Thread.find({user: req.user._id}).sort({updatedAt: -1});
        // descending order of updatedAt....most recent data on top
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

// get specific thread
router.get("/thread/:threadId", isLoggedIn, async(req, res) => {
    const {threadId} = req.params;
    try {
        const thread = await Thread.findOne({threadId, user: req.user._id});

        if(!thread) {
            return res.status(404).json({error: "Thread not found"});
        }
        res.json(thread.messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

// del thread
router.delete("/thread/:threadId", isLoggedIn, async(req, res) => {
    const {threadId} = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({threadId, user: req.user._id});

        if(!deletedThread) {
            return res.status(404).json({error: "Thread not found"});
        }
        res.status(200).json({success: "Thread deleted successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to delete thread"});
    }
});

// Guests can chat without creating a database thread.
router.post("/chat", async(req, res) => {
    const {threadId, message} = req.body;

    if(typeof message !== "string" || !message.trim()) {
        return res.status(400).json({error: "missing required fields"});
    }

    const authenticated = req.isAuthenticated();
    if(authenticated && (typeof threadId !== "string" || !threadId)) {
        return res.status(400).json({error: "missing required fields"});
    }

    try {
        let thread;
        let conversation;

        if(authenticated) {
            thread = await Thread.findOne({threadId, user: req.user._id});
            conversation = thread ? thread.messages.map(({role, content}) => ({role, content})) : [];
        } else {
            conversation = Array.isArray(req.body.messages)
                ? req.body.messages
                    .filter((entry) =>
                        entry &&
                        (entry.role === "user" || entry.role === "assistant") &&
                        typeof entry.content === "string"
                    )
                    .map(({role, content}) => ({role, content}))
                    .slice(-20)
                : [];
        }

        const latestMessage = {role: "user", content: message.trim()};
        const lastMessage = conversation[conversation.length - 1];
        if(lastMessage?.role === "user" && lastMessage.content === latestMessage.content) {
            conversation[conversation.length - 1] = latestMessage;
        } else {
            conversation.push(latestMessage);
        }

        const assistantReply = await getOpenAIAPIResponse(conversation.slice(-20));

        if(authenticated) {
            if(!thread) {
                thread = new Thread({
                    user: req.user._id,
                    threadId,
                    title: latestMessage.content,
                    messages: []
                });
            }

            thread.messages.push(latestMessage, {role: "assistant", content: assistantReply});
            thread.updatedAt = new Date();

            await thread.save();
        }

        res.json({reply: assistantReply, authenticated});

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Something went wrong"});
    }
})

export default router;