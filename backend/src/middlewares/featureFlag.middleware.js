const FeatureFlagService = require('../services/featureFlag.service');

const checkFeatureFlag = (flagName) => {
    return (req, res, next) => {
        if (!FeatureFlagService.isEnabled(flagName)) {
            return res.status(403).json({
                success: false,
                message: `The ${flagName} feature is currently disabled by system administration.`
            });
        }
        next();
    };
};

module.exports = checkFeatureFlag;
