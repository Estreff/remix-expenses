import ExpenseStatistics from '~/components/expenses/ExpenseStatistics';
import Chart from '~/components/expenses/Chart';
import { Link, useLoaderData, useCatch } from '@remix-run/react';
import { getExpenses } from '~/util/expenses.server';
import { requireUserSession } from '~/util/auth.server';
import { json } from '@remix-run/node';
import Error from '~/components/util/Error';

export default function ExpenseAnalysisPage() {
  const expenses = useLoaderData();
  const hasExpenses = expenses && expenses.length > 0;

  return (
    <main>
      {hasExpenses && (
        <>
          <Chart expenses={expenses} />
          <ExpenseStatistics expenses={expenses} />
        </>
      )}
      {!hasExpenses && (
        <div class="no-expenses">
          <h2>No Expenses have been entered</h2>
          <p>
            To analyze your expense,{' '}
            <Link to="/add">Please add some expense</Link>!!
          </p>
        </div>
      )}
    </main>
  );
}

export async function loader({request}) {
  const userId = await requireUserSession(request);
  const expenses = await getExpenses(userId);

  if (!expenses || expenses.length === 0) {
    throw json(
      { message: 'Cound not load Expenses for the requested analysis,' },
      { status: 404, statusText: 'Expenses Not Found' }
    );
  }

  return expenses;
}

export function CatchBoundary({ error }) {
  const caughtResponse = useCatch();
  console.log('catchBoundry error: ', caughtResponse);

  return (
    <main>
      <Error title={caughtResponse.statusText}>
        <p>
          {caughtResponse.data?.message ||
            'Something went wrong, could not load expenses!'}
        </p>
        <Link to="/expenses/add">Enter Expenses</Link>
      </Error>
    </main>
  );
}
