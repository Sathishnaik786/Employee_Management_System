const { supabaseAdmin } = require('@lib/supabase');
const logger = require('@lib/logger');

class FeatureFlagService {
    constructor() {
        this.flags = {
            'naac_cycle': true,
            'placement_module': true,
            'phd_admissions': true
        };
        // In a real production system, these would be loaded from a config table or Redis
    }

    isEnabled(flagName) {
        return this.flags[flagName] !== false;
    }

    async toggleFlag(flagName, status, user) {
        if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
            throw new Error('Unauthorized: Only administrators can toggle feature flags.');
        }

        this.flags[flagName] = status;

        logger.info('FEATURE_FLAG_TOGGLED', {
            flag: flagName,
            status: status ? 'ENABLED' : 'DISABLED',
            userId: user.id
        });

        // Optional: Persist to DB
        return { flag: flagName, status: this.flags[flagName] };
    }
}

module.exports = new FeatureFlagService();
