import { config } from '@vue/test-utils';
import { vi } from 'vitest';

// Mock global properties or plugins if needed
config.global.mocks = {
    $t: (msg) => msg
};

// Mock axios if needed
vi.mock('axios');