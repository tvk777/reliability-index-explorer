import { ReliabilityView } from './components/reliability/ReliabilityView';
import { TransactionsView } from './components/transactions/TransactionsView';
import { getScoringWindow } from './utils/scoringWindow';



export const App = () => {
  const userId = 'user_1001';
  const endDate = '2026-02-20';

  const scoringWindow = getScoringWindow(endDate);


  return (
    <main>
      <ReliabilityView userId={userId} scoringWindow={scoringWindow} />
      <TransactionsView userId={userId} scoringWindow={scoringWindow} />
    </main>
  );
};
