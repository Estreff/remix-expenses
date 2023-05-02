import { json } from '@remix-run/node';
import { Outlet, Link, useLoaderData } from '@remix-run/react';
import { FaPlus, FaDownload } from 'react-icons/fa';
import ExpensesList from '~/components/expenses/ExpensesList';
import { requireUserSession } from '~/util/auth.server';
import { getExpenses } from '~/util/expenses.server';

export default function ExpensesLayout() {
  const expenses = useLoaderData();
  const hasExpenses = expenses && expenses.length > 0;

  return (
    <>
      <Outlet />
      <main>
        <section id="expenses-actions">
          <Link to="add">
            <FaPlus />
            <span>Add Expense</span>
          </Link>
          {hasExpenses && (
            <a href="/expenses/raw">
              <FaDownload />
              <span>Load Raw Data</span>
            </a>
          )}
        </section>
        {hasExpenses && <ExpensesList expenses={expenses} />}
        {!hasExpenses && (
          <section className="no-expenses">
            <h2>No Expenses Found</h2>
            <p>
              Start <Link to="add">adding some </Link>today!!
            </p>
          </section>
        )}
      </main>
    </>
  );
}

export async function loader({request}) {
  const userId = await requireUserSession(request);
  const expenses = await getExpenses(userId);
  // return expenses;
  return json(expenses, {
    headers: {
      'Cache-Control': 'max-age=3'  // 3 seconds
    }
  })
}

export function headers({loaderHeaders}) {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control')
  }
}
