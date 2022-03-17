import { render, screen } from '@testing-library/react';
import App from '../components/App';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
  render(<App />);
});

it('renders the App component', () => {
  const titleElement = screen.getByText(/Todo App/i);
  expect(titleElement).toBeInTheDocument();
});

it('shows the default todos', () => {
  const todoOne = screen.getByText(/Finish React Series/i);
  const todoTwo = screen.getByText(/Go Grocery/i);
  const todoThree = screen.getByText(/Take over world/i);
  expect(todoOne).toBeInTheDocument();
  expect(todoTwo).toBeInTheDocument();
  expect(todoThree).toBeInTheDocument();
});

it('can add todos', () => {
  const todoInput = screen.getByPlaceholderText(/what do you need to do\?/i);

  userEvent.type(todoInput, 'New Todo{enter}');
  const newItem = screen.getByText(/New Todo/i);
  expect(newItem).toBeInTheDocument();
});

it('shows the line through completed todo', () => {
  const todoOne = screen.getByText(/Finish React Series/i);
  const todoTwo = screen.getByText(/Go Grocery/i);

  expect(todoOne).not.toHaveClass('line-through');
  expect(todoOne.previousElementSibling).not.toBeChecked();

  expect(todoTwo).toHaveClass('line-through');
  expect(todoTwo.previousElementSibling).toBeChecked();
});

it('can complete a todo', () => {
  const todoOne = screen.getByText(/Finish React Series/i);

  expect(todoOne).not.toHaveClass('line-through');
  expect(todoOne.previousElementSibling).not.toBeChecked();

  userEvent.click(todoOne.previousElementSibling);

  expect(todoOne).toHaveClass('line-through');
  expect(todoOne.previousElementSibling).toBeChecked();
});

it('can incomplete a todo', () => {
  const todoTwo = screen.getByText(/Go Grocery/i);

  expect(todoTwo).toHaveClass('line-through');
  expect(todoTwo.previousElementSibling).toBeChecked();

  userEvent.click(todoTwo.previousElementSibling);

  expect(todoTwo).not.toHaveClass('line-through');
  expect(todoTwo.previousElementSibling).not.toBeChecked();
});

it('can put a todo into edit mode', () => {
  const todoOne = screen.getByText(/Finish React Series/i);

  userEvent.dblClick(todoOne);

  expect(todoOne).not.toBeInTheDocument();

  const todoOneEditInput = screen.getByDisplayValue(/Finish React Series/i);

  expect(todoOneEditInput).toBeInTheDocument();
});

it('can put a todo into edit mode and commit a change by pressing enter', () => {
  const todoOne = screen.getByText(/Finish React Series/i);

  userEvent.dblClick(todoOne);

  expect(todoOne).not.toBeInTheDocument();

  const todoOneEditInput = screen.getByDisplayValue(/Finish React Series/i);

  expect(todoOneEditInput).toBeInTheDocument();

  userEvent.type(todoOneEditInput, ' today{enter}');

  expect(todoOneEditInput).not.toBeInTheDocument();

  const todoOneUpdated = screen.getByText(/Finish React Series today/i);
  expect(todoOneUpdated).toBeInTheDocument();
});

it('can delete a todo', () => {
  const todoOne = screen.getByText(/Finish React Series/i);

  expect(todoOne).toBeInTheDocument();

  const todoOneDeleteButton = todoOne.parentElement.nextElementSibling;

  expect(todoOneDeleteButton).toBeInTheDocument();

  userEvent.click(todoOneDeleteButton);

  expect(todoOne).not.toBeInTheDocument();
});

it('shows the number of remaining todos', () => {
  const itemsRemaining = screen.getByText(/2 items remaining/i);

  expect(itemsRemaining).toBeInTheDocument();

  const todoOne = screen.getByText(/Finish React Series/i);

  expect(todoOne).not.toHaveClass('line-through');
  expect(todoOne.previousElementSibling).not.toBeChecked();

  userEvent.click(todoOne.previousElementSibling);

  expect(todoOne).toHaveClass('line-through');
  expect(todoOne.previousElementSibling).toBeChecked();

  const itemsRemainingAfter = screen.getByText(/1 items remaining/i);

  expect(itemsRemainingAfter).toBeInTheDocument();
});

it('can check all todos', () => {
  const checkAllTodosButton = screen.getByRole('button', {
    name: /check all/i,
  });

  userEvent.click(checkAllTodosButton);

  const todoOne = screen.getByText(/Finish React Series/i);
  const todoTwo = screen.getByText(/Go Grocery/i);
  const todoThree = screen.getByText(/Take over world/i);

  expect(todoOne).toHaveClass('line-through');
  expect(todoTwo).toHaveClass('line-through');
  expect(todoThree).toHaveClass('line-through');
});
