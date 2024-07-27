const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const { compare } = require("bcrypt");
const { renameSync, unlinkSync } = require("fs");

const maxAge = 3 * 24 * 60 * 60 * 2000;
const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, {
        expiresIn: maxAge
    });
}

const signup = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).send("Email and Password required.");
        }
        const user = await User.create({ email, password });
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return response.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
            },
        });

    }
    catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};

const login = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).send("Email and Password required.");
        }
        const user = await User.findOne({ email });
        if (!user) {
            return response.status(400).send("User with the given email not found");
        }
        const auth = await compare(password, user.password);
        if (!auth) {
            return response.status(400).send("Password is incorrect.");
        }
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return response.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            },
        });

    }
    catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
};

const getUserInfo = async (request, response, next) => {
    try {
        const userData = await User.findById(request.userId);
        if (!userData) {
            return response.status(404).send("User with the given email not found.");
        }

        return response.status(200).json({

            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,

        });

    }
    catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
};

const updateProfile = async (request, response, next) => {
    try {
        const { userId } = request;
        const { firstName, lastName, color } = request.body;

        if (!firstName || !lastName) {
            return response.status(400).send("Firstname and lastname and color is required");
        }
        const userData = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                color,
                profileSetup: true,
            },
            {
                new: true, runValidators: true
            }
        );
        return response.status(200).json({

            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,

        });

    }
    catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
};
const addProfileImage = async (request, response, next) => {
    try {
        if (!request.file) {
            return response.status(400).send("File is required.");
        }
        const date = Date.now();
        let fileName = "uploads/profiles/" + date + request.file.originalname;
        renameSync(request.file.path, fileName);
        const updatedUser = await User.findByIdAndUpdate(request.userId, { image: fileName }, { new: true, runValidators: true });
        return response.status(200).json({

            image: updatedUser.image,

        });

    }
    catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
};
const removeProfileImage = async (request, response, next) => {
    try {
        const { userId } = request;
        const user = await User.findById(userId);
        if (!user) {
            return response.status(404).send("User not found.");
        }
        if (user.image) {
            unlinkSync(user.image);
        }
        user.image = null;
        await user.save();
        return response.status(200).send("Profile image removed successfully");

    }
    catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
};
const logout = async (request, response, next) => {
    try {
        response.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
        return response.status(200).send("Logout successfully");

    }
    catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
};


module.exports = { signup, login, getUserInfo, updateProfile, addProfileImage, removeProfileImage, logout };