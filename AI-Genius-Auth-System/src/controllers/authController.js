const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  findUserByEmail,
  findUserById,
  saveRefreshToken,
  findRefreshToken,
  removeRefreshToken,
} = require("../config/db");
const {
  signAccessToken,
  signRefreshToken,
} = require("../utils/token");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    saveRefreshToken(user.id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: payload,
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    const storedToken = findRefreshToken(token);

    if (!storedToken) {
      return res.status(403).json({
        success: false,
        message: "Refresh token is not valid",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      removeRefreshToken(token);
      return res.status(401).json({
        success: false,
        message: "Refresh token expired or invalid",
      });
    }

    const user = findUserById(decoded.id);

    if (!user) {
      removeRefreshToken(token);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = signAccessToken(newPayload);

    return res.status(200).json({
      success: true,
      message: "Access token refreshed",
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      removeRefreshToken(token);
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  refresh,
  logout,
};