const freeModel = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Free AI model accessed successfully",
    user: req.user,
  });
};

const premiumModel = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Premium AI model accessed successfully",
    user: req.user,
  });
};

const purgeCache = (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI cache purged successfully",
    user: req.user,
  });
};

module.exports = {
  freeModel,
  premiumModel,
  purgeCache,
};