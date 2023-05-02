import { redirect } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';

import ExpenseForm from '~/components/expenses/ExpenseForm';
import Modal from '~/components/util/Modal';
import { requireUserSession } from '~/util/auth.server';
import { addExpense } from '~/util/expenses.server';
import { validateExpenseInput } from '~/util/validation.server';

export default function AddExpensePage() {
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

export async function action({ request }) {
  const userId = await requireUserSession(request);
  const formData = await request.formData();
  const expenseData = Object.fromEntries(formData);
  try {
    validateExpenseInput(expenseData);
  } catch(error) {
    return error
  }

  await addExpense(expenseData, userId);
  return redirect('/expenses');
}
