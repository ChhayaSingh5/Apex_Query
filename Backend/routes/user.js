import express from "express";
import User from "../models/user.js";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";

const router = express.Router();
 
router.get("/api/session", (req, res) => {
    res.json({ authenticated: req.isAuthenticated() });
});

router.get("/signup", (req, res) => {
    res.render("signup", {
        success: req.flash("success"),
        error: req.flash("error"),
    });
});

router.post("/signup", wrapAsync(async(req, res) => {
    let registeredUser;
    try {
        let { username, email, password } = req.body;
        const newUser = new User({email, username});
        registeredUser = await User.register(newUser, password);
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }

    await new Promise((resolve, reject) => {
        req.login(registeredUser, (error) => error ? reject(error) : resolve());
    });
    req.flash("success", "Welcome to ApexQuery!");
    res.redirect("/");
}));

router.get("/login", (req, res) => {
    res.render("login", {
        success: req.flash("success"),
        error: req.flash("error"),
    });
});

router.post("/login", 
    passport.authenticate("local", { 
        failureRedirect: '/login', 
        failureFlash: "Incorrect username or password." 
    }), async (req, res) => {
        req.flash("success", "Welcome back to ApexQuery");
        res.redirect("/");
});

router.get("/api/flash", (req, res) => {
    res.json({
        success: req.flash("success"),
        error: req.flash("error"),
    });
});

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/");
    });
});

export default router; 