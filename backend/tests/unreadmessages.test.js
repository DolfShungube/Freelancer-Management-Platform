import { describe, it, expect, vi, beforeEach } from 'vitest';
import checkUnreadMessages from '../Client/unreadmessages.js';
import supabase from '../config/superbaseClient.js';

vi.mock('../config/superbaseClient.js', () => {
  return {
    default: {
      rpc: vi.fn(),
    },
  };
});

describe('checkUnreadMessages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns data if unread messages exist', async () => {
    supabase.rpc.mockResolvedValue({
      data: [{ id: 1, message: 'Hello' }],
      error: null,
    });

    const result = await checkUnreadMessages('123');
    expect(supabase.rpc).toHaveBeenCalledWith('get_unread_messages_for_client', { user_id: '123' });
    expect(result).toEqual([{ id: 1, message: 'Hello' }]);
  });

  it('returns empty array if no unread messages', async () => {
    supabase.rpc.mockResolvedValue({
      data: [],
      error: null,
    });

    const result = await checkUnreadMessages('456');
    expect(result).toEqual([]);
  });

  it('returns empty array and logs error on supabase error', async () => {
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
    supabase.rpc.mockResolvedValue({
      data: null,
      error: { message: 'Some error occurred' },
    });

    const result = await checkUnreadMessages('789');
    expect(consoleErrorMock).toHaveBeenCalledWith('Error fetching unread messages:', 'Some error occurred');
    expect(result).toEqual([]);
    consoleErrorMock.mockRestore();
  });

  it('returns empty array and logs exception on thrown error', async () => {
    const consoleLogMock = vi.spyOn(console, 'log').mockImplementation(() => {});
    supabase.rpc.mockRejectedValue(new Error('RPC failed'));

    const result = await checkUnreadMessages('101');
    expect(consoleLogMock).toHaveBeenCalledWith('Error checking unread messages', expect.any(Error));
    expect(result).toEqual([]);
    consoleLogMock.mockRestore();
  });
});