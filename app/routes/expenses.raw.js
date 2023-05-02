import { getExpenses } from '~/util/expenses.server';
import { requireUserSession } from '~/util/auth.server';

export async function loader({ request }) {
  const userId = await requireUserSession(request);
  return getExpenses(userId);
}
