const { supabase } = require('@lib/supabase');

class UpdatesService {
    /**
     * Create a new update
     */
    async createUpdate(updateData, visibleToUserIds = []) {
        const { data: update, error: updateError } = await supabase
            .from('employee_updates')
            .insert([updateData])
            .select()
            .single();

        if (updateError) throw updateError;

        // Add visibility if provided
        if (visibleToUserIds.length > 0) {
            const visibilityData = visibleToUserIds.map(userId => ({
                update_id: update.id,
                visible_to_user_id: userId
            }));

            const { error: visError } = await supabase
                .from('employee_update_visibility')
                .insert(visibilityData);

            if (visError) {
                console.error('Error adding visibility:', visError);
                // We don't fail the whole request but log it
            }
        }

        return update;
    }

    /**
     * Get updates created by the user
     */
    async getMyUpdates(userId, type = null) {
        let query = supabase
            .from('employee_updates')
            .select(`
        *,
        feedback:employee_update_feedback(*)
      `)
            .eq('user_id', userId)

        if (type) {
            query = query.eq('update_type', type);
        }

        const { data, error } = await query.order('created_at', { ascending: false });


        if (error) throw error;
        return data;
    }

    /**
     * Get updates visible to the user
     */
    async getVisibleUpdates(userId, type = null) {
        let query = supabase
            .from('employee_updates')
            .select(`
        *,
        author:user_id (
          id
        ),
        feedback:employee_update_feedback(*)
      `)
            .not('user_id', 'eq', userId) // Don't include my own updates here (they are in getMyUpdates)

        if (type) {
            query = query.eq('update_type', type);
        }

        const { data, error } = await query.order('created_at', { ascending: false });


        // Note: RLS will handle the filtering by visibility table
        if (error) throw error;
        return data;
    }

    /**
     * Get analytics for the current user
     */
    async getAnalyticsMe(userId) {
        const { data, error } = await supabase
            .from('employee_updates')
            .select('update_type, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Basic aggregation logic
        const dailyUpdates = data.filter(u => u.update_type === 'DAILY');

        // Calculate Streak
        let streak = 0;
        if (dailyUpdates.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let currentDate = today;
            const updateDates = dailyUpdates.map(u => {
                const d = new Date(u.created_at);
                d.setHours(0, 0, 0, 0);
                return d.getTime();
            });

            // Check if latest update is today or yesterday
            const latestUpdateDate = new Date(dailyUpdates[0].created_at);
            latestUpdateDate.setHours(0, 0, 0, 0);

            const diffInDays = Math.floor((today.getTime() - latestUpdateDate.getTime()) / (1000 * 60 * 60 * 24));

            if (diffInDays <= 1) {
                // Potential streak
                streak = 1;
                let checkDate = new Date(latestUpdateDate);

                for (let i = 1; i < dailyUpdates.length; i++) {
                    checkDate.setDate(checkDate.getDate() - 1);
                    const prevUpdateDate = new Date(dailyUpdates[i].created_at);
                    prevUpdateDate.setHours(0, 0, 0, 0);

                    if (prevUpdateDate.getTime() === checkDate.getTime()) {
                        streak++;
                    } else if (prevUpdateDate.getTime() > checkDate.getTime()) {
                        continue; // Multiple updates on same day
                    } else {
                        break;
                    }
                }
            }
        }

        const stats = {
            total: data.length,
            daily: dailyUpdates.length,
            weekly: data.filter(u => u.update_type === 'WEEKLY').length,
            monthly: data.filter(u => u.update_type === 'MONTHLY').length,
            streak: streak,
            recent: data.slice(0, 10)
        };


        return stats;
    }

    /**
     * Get analytics for the manager's team
     */
    async getAnalyticsTeam(userId) {
        // RLS will ensure the manager only sees their team's updates
        const { data, error } = await supabase
            .from('employee_updates')
            .select('user_id, update_type, created_at')
            .not('user_id', 'eq', userId);

        if (error) throw error;

        return {
            totalUpdates: data.length,
            byType: {
                DAILY: data.filter(u => u.update_type === 'DAILY').length,
                WEEKLY: data.filter(u => u.update_type === 'WEEKLY').length,
                MONTHLY: data.filter(u => u.update_type === 'MONTHLY').length
            },
            uniqueContributors: new Set(data.map(u => u.user_id)).size
        };
    }

    /**
     * Get analytics for the entire organization
     */
    async getAnalyticsOrg() {
        // RLS for Admin will allow seeing everything
        const { data: updates, error: updatesError } = await supabase
            .from('employee_updates')
            .select('update_type, created_at, user_id');

        if (updatesError) throw updatesError;

        return {
            totalUpdates: updates.length,
            byType: {
                DAILY: updates.filter(u => u.update_type === 'DAILY').length,
                WEEKLY: updates.filter(u => u.update_type === 'WEEKLY').length,
                MONTHLY: updates.filter(u => u.update_type === 'MONTHLY').length
            },
            uniqueContributors: new Set(updates.map(u => u.user_id)).size
        };
    }

    /**
     * Add feedback to an update
     */
    async addFeedback(feedbackData) {
        const { data, error } = await supabase
            .from('employee_update_feedback')
            .insert([feedbackData])
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}

module.exports = new UpdatesService();
