import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// Mock fetch for tests
global.fetch = jest.fn();

// Helper to render App with QueryClient
const renderApp = () => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('App Component', () => {
  test('renders TODO App heading', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderApp();

    const headingElement = await screen.findByText(/TODO App/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('displays empty state message when no todos exist', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
    });
  });

  test('calculates and displays correct stats for incomplete todos', async () => {
    const mockTodos = [
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: false },
      { id: 3, title: 'Todo 3', completed: true },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTodos,
    });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/2 items left/i)).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText(/1 completed/i)).toBeInTheDocument();
    });
  });

  test('calculates and displays correct stats when all todos are completed', async () => {
    const mockTodos = [
      { id: 1, title: 'Todo 1', completed: true },
      { id: 2, title: 'Todo 2', completed: true },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTodos,
    });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/0 items left/i)).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText(/2 completed/i)).toBeInTheDocument();
    });
  });

  test('deletes a todo when delete button is clicked', async () => {
    const mockTodos = [
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: false },
    ];

    // Initial fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTodos,
    });

    renderApp();

    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByText('Todo 1')).toBeInTheDocument();
    });

    // Mock delete request
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    // Mock refetch after delete
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockTodos[1]], // Only second todo remains
    });

    // Find and click delete button
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await userEvent.click(deleteButtons[0]);

    // Verify delete API was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/todos/1'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  test('displays error message when todos fail to load', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/error loading todos/i)).toBeInTheDocument();
    });
  });

  test('displays error message when server returns error response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Server error' }),
    });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/error loading todos/i)).toBeInTheDocument();
    });
  });

  test('uses relative URL for API calls', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderApp();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/^\/api\/todos$/)
      );
    });
  });
});
