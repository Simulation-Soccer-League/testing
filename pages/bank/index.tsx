import { CloseIcon } from '@chakra-ui/icons';
import {
  Button,
  Checkbox,
  Collapse,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import CreateBankTransaction from '../../components/bank/CreateBankTransaction';
import { TransactionQueryBuilder } from '../../components/bank/TransactionQueryBuilder';
import { PageWrapper } from '../../components/common/PageWrapper';
import { BankTransactionSummaryTable } from '../../components/common/tables/BankTransactionSummaryTable';
import { useSession } from '../../contexts/AuthContext';
import { useCurrentPlayer } from '../../hooks/useCurrentPlayer';
import { BankTransactionSummary } from '../../typings';
import { query } from '../../utils/query';

const setSavedFilters = (filters: string) => {
  if (filters.length > 0) {
    const filtersParams = new URLSearchParams(filters);

    filtersParams.delete('requester');
    filtersParams.delete('reviewer');
    filtersParams.delete('payee');

    localStorage.setItem('bankFilters', `?${filtersParams.toString()}`);
  }
};

const getSavedFilters = () => {
  return localStorage.getItem('bankFilters');
};

export default () => {
  const { loggedIn } = useSession();
  const { player } = useCurrentPlayer();
  const router = useRouter();
  const [filters, setFilters] = useState<string>('');
  const [filtersLoaded, setFiltersLoaded] = useState(false);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    const savedFilters = getSavedFilters();

    if (savedFilters) {
      setFilters(savedFilters);
    }

    setFiltersLoaded(true);
  }, []);

  useEffect(() => {
    if (filtersLoaded) setSavedFilters(filters);
  }, [filters, filtersLoaded]);

  const { data = [], isLoading } = useQuery<BankTransactionSummary[]>({
    queryKey: ['bankTransactionSummaries', filters, showCards],
    queryFn: () =>
      query(
        `api/v1/bank/transactions/summary${filters}${
          showCards ? (filters ? '&showCards=true' : '?showCards=true') : ''
        }`,
      ),
    enabled: filtersLoaded,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const applyFilter = useCallback((value: string) => setFilters(value), []);

  const clearFilters = useCallback(() => {
    setFilters('');
    localStorage.removeItem('bankFilters');
  }, []);

  const [showTransaction, setShowTransaction] = useState(false);

  return (
    <PageWrapper>
      <div className="flex items-center justify-center">
        <div className="my-4 flex w-11/12 flex-col lg:w-3/5">
          <div className="mb-4 bg-grey900 p-2 text-xl text-grey100">Bank</div>
          {loggedIn && (
            <>
              <Collapse in={!showTransaction} animateOpacity>
                <div className="mb-4 grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-2">
                  <Button
                    size="lg"
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => router.push(`/bank/account/${player?.uid}`)}
                    isDisabled={!player}
                  >
                    Your Account
                  </Button>
                  <Button
                    size="lg"
                    colorScheme="whatsapp"
                    variant="outline"
                    onClick={() => setShowTransaction(true)}
                  >
                    Submit Transaction
                  </Button>
                </div>
              </Collapse>
              <Collapse in={showTransaction} animateOpacity>
                <CreateBankTransaction
                  handleCancel={() => setShowTransaction(false)}
                />
              </Collapse>
            </>
          )}

          <div className="mb-2 bg-grey900 p-2 text-grey100">
            <div className="flex items-center justify-between">
              <span className="font-bold">All Transactions</span>
              <div className="flex items-center justify-end space-x-4">
                <Checkbox
                  isChecked={showCards}
                  onChange={(e) => setShowCards(e.target.checked)}
                >
                  Show Cards
                </Checkbox>

                <Button className="text-grey900" onClick={onOpen} size="sm">
                  Filters
                </Button>
                {filters.length > 0 && (
                  <IconButton
                    aria-label="Clear filters"
                    colorScheme="red"
                    size="sm"
                    onClick={clearFilters}
                    icon={<CloseIcon />}
                  />
                )}
              </div>
            </div>
          </div>
          <BankTransactionSummaryTable data={data} isLoading={isLoading} />
        </div>
      </div>
      <TransactionQueryBuilder
        isOpen={isOpen}
        handleClose={onClose}
        applyFilter={applyFilter}
        filters={filters}
      />
    </PageWrapper>
  );
};
