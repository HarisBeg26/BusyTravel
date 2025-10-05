const config = require('../config');
const { createClient } = require('@supabase/supabase-js');
const Trip = require('../models/tripModel');

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

exports.createTrip = async (tripData) => {
    console.log("Trip data received in service:", tripData);

    // Map camelCase to snake_case
    const dbTrip = {
        destination: tripData.destination,
        start_date: tripData.startDate,
        end_date: tripData.endDate,
        purpose: tripData.purpose,
    };

    // Insert into Supabase
    const { data, error } = await supabase
        .from('trips')
        .insert([dbTrip]);

    if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
    }
    return data;
};


exports.getTrips = async () => {
    console.log("Fetching all trips from Supabase"); // Debugging log

    const { error, data } = await supabase.from('trips').select('*');

    if (error) {
        console.error("Error fetching trips from Supabase:", error);
        throw error;
    }

    // Log raw data for debugging
    console.log("Raw trip data from Supabase:", data);

    // Map raw data to the Trip model
    return data.map(trip => ({
        ...trip,
        startDate: trip.start_date || null, // Convert field name
        endDate: trip.end_date || null,     // Convert field name
    }));
};


exports.getTripById = async (id) => {
    // Ensure id is a number
    if (isNaN(id)) throw new Error("Invalid ID: Must be a number.");

    const { error, data } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id) // Ensure 'id' matches the primary key type
        .single();

    if (error) throw error;

    return new Trip(
        data.id,
        data.destination,
        data.start_date,
        data.end_date,
        data.purpose
    );
};


exports.updateTrip = async (id, data) => {
    const { start_date, end_date, destination, purpose } = data;
    const { error, data: updatedTrip } = await supabase
        .from('trips')
        .update({ start_date, end_date, destination, purpose })
        .eq('id', id)
        .single();

    if (error) throw error;
    return updatedTrip;
};


exports.deleteTrip = async (id) => {
    const { error } = await supabase.from('trips').delete().eq('id', id);
    if (error) throw error;
};
