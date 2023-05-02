import { redirect } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';
import ExpenseForm from '~/components/expenses/ExpenseForm';
import Modal from '~/components/util/Modal';
import { updateExpense, deleteExpense } from '~/util/expenses.server';
import { validateExpenseInput } from '~/util/validation.server';

export default function EditExpensePage() {
  const navigate = useNavigate();

  function closeHandler() {
    navigate('..');
  }

  return (
    <Modal onClose={closeHandler}>
      <ExpenseForm />
    </Modal>
  );
}

export async function action({ params, request }) {
  const expenseId = params.expenseId;

  if (request.method === 'PATCH') {
    const formData = await request.formData();
    const expenseData = Object.fromEntries(formData);

    try {
      validateExpenseInput(expenseData);
    } catch (error) {
      return error;
    }

    await updateExpense(expenseId, expenseData);
    return redirect('/expenses');
  } else if (request.method === 'DELETE') {
    await deleteExpense(expenseId);
    return redirect('/expenses');
  }
}

export function meta({matches}) {
  const expenses = matches.find(x => x.id === 'routes/__app/expenses');
  const expense = expenses.data.find(expense => expense.id === expenses.params.expenseId)
  
  return [
    {title: `Remix Expenses | ${expense.title}`},
    {description: `Updating Expense`}
  ]
}
