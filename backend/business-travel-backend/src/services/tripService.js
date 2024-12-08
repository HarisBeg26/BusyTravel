const config = require('../config');
const { createClient } = require('@supabase/supabase-js');
const Trip = require('../models/tripModel');

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

exports.createTrip = async (data) => {
    try {
        const { destination, start_date, end_date, purpose } = data;
        const { data: trip, error } = await supabase
            .from('trips')
            .insert([{ destination, start_date, end_date, purpose }])
            .single();

        if (error) throw error;

        return trip;
    } catch (err) {
        console.error('Error in createTrip service:', err.message);
        throw err;
    }
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
    return data.map(trip => new Trip(
        trip.id,
        trip.destination,
        trip.start_date,
        trip.end_date,
        trip.purpose // Ensure this matches your database column
    ));
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
    const { destination, start_date, end_date, purpose } = data;

    // Prepare the updated trip object
    const updatedTrip = {
        destination,
        start_date: new Date(start_date).toISOString(), // Ensure the correct date format
        end_date: new Date(end_date).toISOString(), // Same as above
        purpose,
    };

    const { error, data: trip } = await supabase
        .from('trips')
        .update(updatedTrip)
        .eq('id', id)
        .single();

    if (error) throw error;

    // Return the updated trip as a plain object
    return trip;
};

exports.deleteTrip = async (id) => {
    const { error } = await supabase.from('trips').delete().eq('id', id);
    if (error) throw error;
};
