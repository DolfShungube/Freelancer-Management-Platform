import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the `addNewPayment` function only
vi.mock('../database/utils.js', async () => {
  const actual = await vi.importActual('../database/utils.js');
  return {
    ...actual,
    addNewPayment: vi.fn().mockResolvedValue(''),
  };
});

// Mock the Supabase client
import {supabase} from '../config/superbaseClient.js';
vi.mock('../config/superbaseClient.js', () => ({
  supabase: {
    from: vi.fn(),
  }
}));

// Import after mocks
import {
  addNewJob,
  userProfile,
  aplicantCount,
  progressCalculator,
  clientJobs,
  getFreelancer,
} from '../database/utils.js';

describe('Job Service Functions', () => {
  let mockFrom;

  beforeEach(() => {
    mockFrom = {
      insert: vi.fn(),
      select: vi.fn(),
      eq: vi.fn(),
    };
    supabase.from.mockImplementation(() => mockFrom);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });


  it('userProfile - returns user data', async () => {
    mockFrom.select.mockReturnValueOnce({
      eq: vi.fn().mockResolvedValueOnce({
        data: [{ id: 'user1', name: 'John' }],
        error: null
      })
    });

    const result = await userProfile('user1', 'Client');
    expect(result).toEqual([{ id: 'user1', name: 'John' }]);
  });

  it('aplicantCount - returns correct count', async () => {
    mockFrom.select.mockReturnValueOnce({
      eq: vi.fn().mockResolvedValueOnce({
        data: [{}, {}, {}],
        error: null
      })
    });

    const result = await aplicantCount('job123');
    expect(result).toBe(3);
  });

  it('progressCalculator - returns 0 if totalTasks is 0', () => {
    const result = progressCalculator(0, 5);
    expect(result).toBe(0);
  });

  it('progressCalculator - returns correct percentage', () => {
    const result = progressCalculator(10, 4);
    expect(result).toBe(40);
  });

  it('clientJobs - returns jobs for a user', async () => {
    mockFrom.select.mockReturnValueOnce({
      eq: vi.fn().mockResolvedValueOnce({
        data: [{ id: 1, jobName: 'Test Job' }],
        error: null
      })
    });

    const result = await clientJobs('client1');
    expect(result).toEqual([{ id: 1, jobName: 'Test Job' }]);
  });

  it('getFreelancer - returns freelancer data', async () => {
    mockFrom.select.mockReturnValueOnce({
      eq: vi.fn().mockResolvedValueOnce({
        data: [{ id: 'freelancer1', name: 'Jane' }],
        error: null
      })
    });

    const result = await getFreelancer('freelancer1');
    expect(result).toEqual([{ id: 'freelancer1', name: 'Jane' }]);
  });
});
