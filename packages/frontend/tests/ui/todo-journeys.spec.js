/**
 * Critical User Journey Tests for TODO Application
 * Tests cover: Create, Toggle, Delete, Error handling, and Complete workflow
 */
const { test, expect } = require('@playwright/test');
const { TodoPage } = require('../pages/TodoPage');

test.describe('TODO Application - Critical User Journeys', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.navigate();
    await todoPage.waitForTodosToLoad();
  });

  test.afterEach(async ({ page }) => {
    // Clean up: Delete all todos to ensure test isolation
    await todoPage.deleteAllTodos();
  });

  test('Journey 1: User creates a new TODO item', async ({ page }) => {
    // Arrange: Define the todo title
    const todoTitle = 'Buy groceries for the week';

    // Act: Create a new todo
    await todoPage.createTodo(todoTitle);

    // Assert: Verify the todo appears in the list
    await expect(todoPage.getTodoItem(todoTitle)).toBeVisible();
    
    // Assert: Verify the checkbox is unchecked (not completed)
    const checkbox = todoPage.getTodoCheckbox(todoTitle);
    await expect(checkbox).not.toBeChecked();
    
    // Assert: Verify stats are updated
    await expect(todoPage.getItemsLeftChip()).toContainText('1 items left');
    await expect(todoPage.getCompletedChip()).toContainText('0 completed');
  });

  test('Journey 2: User toggles TODO completion status', async ({ page }) => {
    // Arrange: Create a todo first
    const todoTitle = 'Complete homework assignment';
    await todoPage.createTodo(todoTitle);

    // Act: Toggle the todo to completed
    await todoPage.toggleTodo(todoTitle);

    // Assert: Verify the checkbox is checked
    await expect(todoPage.getTodoCheckbox(todoTitle)).toBeChecked();
    
    // Assert: Verify the text has strikethrough styling
    const todoText = todoPage.getTodoText(todoTitle);
    await expect(todoText).toHaveCSS('text-decoration', /line-through/);
    
    // Assert: Verify stats reflect completion
    await expect(todoPage.getItemsLeftChip()).toContainText('0 items left');
    await expect(todoPage.getCompletedChip()).toContainText('1 completed');

    // Act: Toggle back to incomplete
    await todoPage.toggleTodo(todoTitle);

    // Assert: Verify it's unchecked again
    await expect(todoPage.getTodoCheckbox(todoTitle)).not.toBeChecked();
    
    // Assert: Verify stats are updated
    await expect(todoPage.getItemsLeftChip()).toContainText('1 items left');
    await expect(todoPage.getCompletedChip()).toContainText('0 completed');
  });

  test('Journey 3: User deletes a TODO item', async ({ page }) => {
    // Arrange: Create a todo first
    const todoTitle = 'Meeting with team at 3 PM';
    await todoPage.createTodo(todoTitle);
    
    // Verify it's visible before deletion
    await expect(todoPage.getTodoItem(todoTitle)).toBeVisible();

    // Act: Delete the todo
    await todoPage.deleteTodo(todoTitle);

    // Assert: Verify the todo is no longer visible
    await expect(todoPage.getTodoItem(todoTitle)).not.toBeVisible();
    
    // Assert: Verify empty state message appears
    await expect(todoPage.getEmptyStateMessage()).toBeVisible();
    
    // Assert: Verify stats show zero items
    await expect(todoPage.getItemsLeftChip()).toContainText('0 items left');
  });

  test('Journey 4: User attempts to create TODO with empty title (Error Path)', async ({ page }) => {
    // Arrange: Start with empty input
    const input = todoPage.getTodoInput();
    
    // Get initial count of todos
    const initialTodoCount = await page.locator('li').filter({ has: page.getByRole('checkbox') }).count();
    
    // Act: Try to submit with empty title
    await input.fill('');
    await todoPage.getAddButton().click();

    // Assert: Verify no new todo is created
    await page.waitForTimeout(1000);
    const afterEmptyCount = await page.locator('li').filter({ has: page.getByRole('checkbox') }).count();
    expect(afterEmptyCount).toBe(initialTodoCount);

    // Act: Try with only whitespace
    await input.fill('   ');
    await todoPage.getAddButton().click();

    // Assert: Verify still no new todo is created
    await page.waitForTimeout(1000);
    const afterWhitespaceCount = await page.locator('li').filter({ has: page.getByRole('checkbox') }).count();
    expect(afterWhitespaceCount).toBe(initialTodoCount);
  });

  test('Journey 5: Complete workflow - Create, Toggle, and Delete', async ({ page }) => {
    // This test validates the complete user journey from creation to deletion
    
    // Step 1: Create multiple todos
    const todo1 = 'Write project documentation';
    const todo2 = 'Review pull requests';
    const todo3 = 'Update dependencies';

    await todoPage.createTodo(todo1);
    await todoPage.createTodo(todo2);
    await todoPage.createTodo(todo3);

    // Assert: All three todos are visible
    await expect(todoPage.getTodoItem(todo1)).toBeVisible();
    await expect(todoPage.getTodoItem(todo2)).toBeVisible();
    await expect(todoPage.getTodoItem(todo3)).toBeVisible();
    
    // Assert: Stats show 3 incomplete items
    await expect(todoPage.getItemsLeftChip()).toContainText('3 items left');
    await expect(todoPage.getCompletedChip()).toContainText('0 completed');

    // Step 2: Mark first and third todos as complete
    await todoPage.toggleTodo(todo1);
    await todoPage.toggleTodo(todo3);

    // Assert: Stats updated correctly
    await expect(todoPage.getItemsLeftChip()).toContainText('1 items left');
    await expect(todoPage.getCompletedChip()).toContainText('2 completed');
    
    // Assert: Verify correct todos are checked
    await expect(todoPage.getTodoCheckbox(todo1)).toBeChecked();
    await expect(todoPage.getTodoCheckbox(todo2)).not.toBeChecked();
    await expect(todoPage.getTodoCheckbox(todo3)).toBeChecked();

    // Step 3: Delete the completed todos
    await todoPage.deleteTodo(todo1);
    await todoPage.deleteTodo(todo3);

    // Assert: Only the incomplete todo remains
    await expect(todoPage.getTodoItem(todo1)).not.toBeVisible();
    await expect(todoPage.getTodoItem(todo2)).toBeVisible();
    await expect(todoPage.getTodoItem(todo3)).not.toBeVisible();
    
    // Assert: Stats reflect remaining incomplete todo
    await expect(todoPage.getItemsLeftChip()).toContainText('1 items left');
    await expect(todoPage.getCompletedChip()).toContainText('0 completed');

    // Step 4: Complete and delete the final todo
    await todoPage.toggleTodo(todo2);
    await expect(todoPage.getTodoCheckbox(todo2)).toBeChecked();
    
    await todoPage.deleteTodo(todo2);

    // Assert: All todos are gone, empty state appears
    await expect(todoPage.getTodoItem(todo2)).not.toBeVisible();
    await expect(todoPage.getEmptyStateMessage()).toBeVisible();
    await expect(todoPage.getItemsLeftChip()).toContainText('0 items left');
  });
});
