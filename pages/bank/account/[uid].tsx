import { Checkbox } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { useState } from 'react';

import { AccountHeader } from '../../../components/bank/AccountHeader';
import { PageWrapper } from '../../../components/common/PageWrapper';
import { BankTransactionSummaryTable } from '../../../components/common/tables/BankTransactionSummaryTable';
import { BankTransactionSummary } from '../../../typings';
import { query } from '../../../utils/query';

export default ({ userID }: { userID: number }) => {
  const [showCards, setShowCards] = useState(false);

  const { data = [], isLoading } = useQuery<BankTransactionSummary[]>({
    queryKey: ['userTransactionSummaries', showCards, userID],
    queryFn: () =>
      query(
        `api/v1/bank/transactions/summary?payee=${userID}${
          showCards ? '&showCards=true' : ''
        }`,
      ),
  });

  return (
    <PageWrapper>
      <div className="flex items-center justify-center">
        <div className="my-4 flex w-11/12 flex-col lg:w-3/5">
          <div className="mb-4">
            <AccountHeader userID={userID} />
          </div>
          <div className="mb-2 bg-grey900 p-2 text-grey100">
            <div className="flex items-center justify-between">
              <span className="font-bold">Transactions</span>
              <div className="flex items-center justify-end space-x-4">
                <Checkbox
                  isChecked={showCards}
                  onChange={(e) => setShowCards(e.target.checked)}
                >
                  Show Cards
                </Checkbox>
              </div>
            </div>
          </div>
          <BankTransactionSummaryTable data={data} isLoading={isLoading} />
        </div>
      </div>
    </PageWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { uid } = query;

  return {
    props: {
      userID: uid,
    },
  };
};
