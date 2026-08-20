/**
 * Page Object Model for the TODO application
 * Encapsulates UI interactions and selectors for reusability
 */
class TodoPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to the TODO application
   */
  async navigate() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get the input field for adding new todos
   */
  getTodoInput() {
    return this.page.getByPlaceholder('What needs to be done?');
  }

  /**
   * Get the Add button
   */
  getAddButton() {
    return this.page.getByRole('button', { name: /add/i });
  }

  /**
   * Create a new TODO item
   * @param {string} title - The title of the todo
   */
  async createTodo(title) {
    const input = this.getTodoInput();
    await input.fill(title);
    await this.getAddButton().click();
    // Wait for the todo to appear in the UI (more resilient than waiting for response)
    await this.getTodoItem(title).waitFor({ state: 'visible', timeout: 10000 });
    // Clear the input after successful creation
    await input.clear();
  }

  /**
   * Get a todo item by its title text
   * @param {string} title - The title of the todo to find
   */
  getTodoItem(title) {
    // Find the list item that contains the specific title
    return this.page.locator('li').filter({ hasText: title });
  }

  /**
   * Get the checkbox for a specific todo
   * @param {string} title - The title of the todo
   */
  getTodoCheckbox(title) {
    return this.getTodoItem(title).getByRole('checkbox');
  }

  /**
   * Get the delete button for a specific todo
   * @param {string} title - The title of the todo
   */
  getDeleteButton(title) {
    return this.getTodoItem(title).getByRole('button', { name: /delete/i });
  }

  /**
   * Toggle the completion status of a todo
   * @param {string} title - The title of the todo to toggle
   */
  async toggleTodo(title) {
    const checkbox = this.getTodoCheckbox(title);
    const wasChecked = await checkbox.isChecked();
    await checkbox.click();
    // Wait for the checkbox state to change (more resilient than waiting for response)
    await this.page.waitForTimeout(500); // Small delay for UI update
    const isNowChecked = await checkbox.isChecked();
    // Verify the state actually changed
    if (wasChecked === isNowChecked) {
      throw new Error(`Toggle failed: checkbox state did not change for "${title}"`);
    }
  }

  /**
   * Delete a todo item
   * @param {string} title - The title of the todo to delete
   */
  async deleteTodo(title) {
    const deleteButton = this.getDeleteButton(title);
    await deleteButton.click();
    // Wait for the todo to disappear from the UI
    await this.getTodoItem(title).waitFor({ state: 'hidden', timeout: 10000 });
  }

  /**
   * Check if a todo item is visible
   * @param {string} title - The title of the todo
   */
  async isTodoVisible(title) {
    return await this.getTodoItem(title).isVisible();
  }

  /**
   * Check if a todo is marked as completed
   * @param {string} title - The title of the todo
   */
  async isTodoCompleted(title) {
    const checkbox = this.getTodoCheckbox(title);
    return await checkbox.isChecked();
  }

  /**
   * Get the text of a todo (to verify strikethrough styling)
   * @param {string} title - The title of the todo
   */
  getTodoText(title) {
    return this.getTodoItem(title).locator('p, span, div').filter({ hasText: title }).first();
  }

  /**
   * Get the "items left" chip text
   */
  getItemsLeftChip() {
    return this.page.locator('text=/\\d+ items left/');
  }

  /**
   * Get the "completed" chip text
   */
  getCompletedChip() {
    return this.page.locator('text=/\\d+ completed/');
  }

  /**
   * Get the empty state message
   */
  getEmptyStateMessage() {
    return this.page.getByText(/no todos yet/i);
  }

  /**
   * Get the loading indicator
   */
  getLoadingIndicator() {
    return this.page.getByRole('progressbar');
  }

  /**
   * Wait for todos to load (loading indicator disappears)
   */
  async waitForTodosToLoad() {
    await this.page.waitForLoadState('networkidle');
    // Wait for loading indicator to disappear if present
    const loader = this.getLoadingIndicator();
    if (await loader.isVisible().catch(() => false)) {
      await loader.waitFor({ state: 'hidden' });
    }
  }

  /**
   * Delete all visible todos (for test cleanup)
   */
  async deleteAllTodos() {
    // Keep deleting todos until none are visible
    let attempts = 0;
    const maxAttempts = 20; // Prevent infinite loops
    
    while (attempts < maxAttempts) {
      const todoItems = await this.page.locator('li').filter({ has: this.page.getByRole('button', { name: /delete/i }) }).all();
      if (todoItems.length === 0) {
        break;
      }
      
      // Delete the first todo
      const firstDeleteButton = todoItems[0].getByRole('button', { name: /delete/i });
      await firstDeleteButton.click();
      // Wait a bit for deletion to complete
      await this.page.waitForTimeout(300);
      attempts++;
    }
  }
}

module.exports = { TodoPage };
