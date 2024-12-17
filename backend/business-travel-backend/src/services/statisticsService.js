const { createClient } = require('@supabase/supabase-js');
const config = require('../config');
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

exports.getExpenseStatistics = async () => {
    try {
        const { data, error } = await supabase
            .from('expenses')
            .select('trip_id, amount');

        if (error) {
            console.error('Supabase Query Error:', error.message);
            throw new Error('Failed to fetch data from Supabase');
        }

        // Log raw data for debugging
        console.log('Fetched raw data:', data);

        // Grouping logic
        const groupedStatistics = data.reduce((acc, expense) => {
            acc[expense.trip_id] = (acc[expense.trip_id] || 0) + expense.amount;
            return acc;
        }, {});

        // Transform grouped data into an array
        const result = Object.keys(groupedStatistics).map(tripId => ({
            trip_id: tripId,
            total_expenses: groupedStatistics[tripId],
        }));

        // Log final statistics
        console.log('Grouped statistics:', result);

        return result;
    } catch (err) {
        console.error('Error in getExpenseStatistics service:', err.message);
        throw err; // Rethrow the error for the controller to handle
    }
};
