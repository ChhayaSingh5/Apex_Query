module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        return res.status(401).json({error: "You must be signed in to access chat history"});
    }
    next();
};