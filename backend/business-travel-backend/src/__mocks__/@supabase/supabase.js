// src/__mocks__/@supabase/supabase.js
const mockFrom = jest.fn().mockReturnValue({
    select: jest.fn().mockResolvedValue({ data: [], error: null }),
    insert: jest.fn().mockResolvedValue({ data: [], error: null }),
});

const createClient = jest.fn().mockReturnValue({
    from: mockFrom,
});

module.exports = { createClient };
