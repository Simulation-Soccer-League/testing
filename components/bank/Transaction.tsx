import {
  Box,
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useBoolean,
} from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { BankTransaction, BankTransactionRecipientTypes } from '../../typings';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDateTime';
import { PermissionGuard } from '../auth/PermissionGuard';
import { Link } from '../common/Link';

import { StatusBadge } from './StatusBadge';

export const Transaction = ({
  transactions,
  recipient,
  isSubmitting,
  submit,
}: {
  transactions: BankTransaction[];
  recipient: BankTransactionRecipientTypes;
  isSubmitting: boolean;
  submit: (action: 'APPROVE' | 'DENY' | 'REVERT', id?: number) => void;
}) => {
  const [denySelected, setDenySelected] = useBoolean();
  const [approveSelected, setApproveSelected] = useBoolean();

  const [revertID, setRevertID] = useState<number | undefined>();

  useEffect(() => {
    if (!isSubmitting) {
      if (revertID) setRevertID(undefined);
    }
  }, [isSubmitting, revertID]);

  const handleRevert = useCallback(
    (id: number) => {
      setRevertID(id);
      submit('REVERT', id);
    },
    [submit],
  );

  const handleSubmit = useCallback(() => {
    submit(approveSelected ? 'APPROVE' : 'DENY');
  }, [approveSelected, submit]);

  const transactionStatus = useMemo(() => {
    if (recipient === 'INDIVIDUAL') {
      return transactions[0].status;
    } else {
      const allCompleted =
        transactions.filter((t) => t.status === 'completed').length ===
        transactions.length;
      if (allCompleted) return 'completed';
      const allPending =
        transactions.filter((t) => t.status === 'pending').length ===
        transactions.length;
      if (allPending) return 'pending';
      const allDenied =
        transactions.filter((t) => t.status === 'denied').length ===
        transactions.length;
      if (allDenied) return 'denied';
      const allReversed =
        transactions.filter((t) => t.status === 'reversed').length ===
        transactions.length;
      if (allReversed) return 'reversed';
    }

    return 'mixed';
  }, [recipient, transactions]);

  const pendingTransaction = useMemo(() => {
    if (recipient === 'INDIVIDUAL') {
      return transactions[0].status === 'pending';
    } else {
      return transactions.some((t) => t.status === 'pending');
    }
  }, [recipient, transactions]);

  return (
    <div>
      <Box className="mb-4 rounded-lg p-4 text-grey100" bgColor="blue.800">
        <div className="flex w-full flex-wrap justify-between space-y-2">
          <div className="flex-col space-y-2 overflow-hidden">
            <h1 className="break-words text-4xl font-bold">
              {recipient === 'GROUP'
                ? transactions[0].groupName
                : transactions[0].description}
            </h1>
            <h2 className="text-xl">
              Submitted By: {transactions[0].submitBy}
            </h2>
          </div>
          <PermissionGuard userPermissions="canProcessBankTransactions">
            {pendingTransaction && (
              <div className="flex min-w-full space-x-2 sm:min-w-fit">
                <div className="w-1/2 flex-col space-y-2">
                  <Button
                    size="sm"
                    width="full"
                    variant={approveSelected ? 'solid' : 'outline'}
                    colorScheme={approveSelected ? 'green' : 'white'}
                    onClick={() => {
                      setApproveSelected.toggle();
                      if (denySelected) setDenySelected.off();
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    width="full"
                    variant={denySelected ? 'solid' : 'outline'}
                    className="w-1/2"
                    colorScheme={denySelected ? 'red' : 'white'}
                    onClick={() => {
                      setDenySelected.toggle();
                      if (approveSelected) setApproveSelected.off();
                    }}
                  >
                    Deny
                  </Button>
                </div>
                <Button
                  size="sm"
                  height="100%"
                  colorScheme="orange"
                  isDisabled={
                    (!denySelected && !approveSelected) || isSubmitting
                  }
                  isLoading={isSubmitting}
                  onClick={handleSubmit}
                >
                  {!denySelected && !approveSelected
                    ? 'Select Status'
                    : 'Submit Review'}
                </Button>
              </div>
            )}
          </PermissionGuard>
        </div>
      </Box>
      <div className="flex w-full flex-wrap">
        <div className="mb-4 mr-0 max-h-fit flex-grow flex-col space-y-2 rounded-lg bg-grey300 p-4 sm:mb-0 sm:mr-4 sm:max-w-fit">
          <div>
            <h3 className="font-bold">Submission Date</h3>
            <span>{formatDateTime(transactions[0].submitDate)}</span>
          </div>
          {recipient === 'INDIVIDUAL' &&
            transactions[0].groupID &&
            transactions[0].groupName && (
              <div>
                <h3 className="font-bold">Group</h3>
                <Link
                  className="!hover:no-underline font-mont hover:text-blue600"
                  aria-label={`View group ${transactions[0].groupName}`}
                  href={{
                    pathname: '/bank/transactions/groups/[id]',
                    query: {
                      id: transactions[0].groupID,
                    },
                  }}
                >
                  {transactions[0].groupName}
                </Link>
              </div>
            )}
          <div>
            <h3 className="font-bold">Status</h3>
            <span>
              <StatusBadge status={transactionStatus} />
            </span>
          </div>
          {transactions[0].approvedByID && (
            <>
              <div>
                <h3 className="font-bold">Reviewed By</h3>
                <span>{transactions[0].approvedBy}</span>
              </div>
              <div>
                <h3 className="font-bold">Reviewed On</h3>
                <span>{formatDateTime(transactions[0].approvedDate)}</span>
              </div>
            </>
          )}
        </div>
        <div className="flex-grow flex-col overflow-x-auto overflow-y-hidden">
          <Box
            className="mb-4 flex-col space-y-2 rounded-t-lg p-4 text-grey100"
            bgColor="blue.800"
          >
            <h3 className="text-xl">Payment Details</h3>
          </Box>
          <TableContainer>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Transaction</Th>
                  <Th>Amount</Th>
                  <Th>Description</Th>
                  {transactionStatus === 'mixed' && <Th>Status</Th>}
                  <PermissionGuard userPermissions="canProcessBankTransactions">
                    <Th></Th>
                  </PermissionGuard>
                </Tr>
              </Thead>
              <Tbody>
                {transactions.map((transaction) => (
                  <Tr key={transaction.id}>
                    <Td>
                      <Link
                        className="!hover:no-underline font-mont hover:text-blue600"
                        aria-label={
                          recipient === 'GROUP'
                            ? 'View Transaction'
                            : 'View Bank'
                        }
                        href={{
                          pathname:
                            recipient === 'GROUP'
                              ? '/bank/transactions/[id]'
                              : '/bank/account/[id]',
                          query: {
                            id:
                              recipient === 'GROUP'
                                ? transaction.id
                                : transaction.uid,
                          },
                        }}
                      >
                        {transaction.username}
                      </Link>
                    </Td>
                    <Td
                      color={transaction.amount > 0 ? 'green' : 'red'}
                      className="font-mont"
                    >
                      {transaction.amount > 0 && '+'}
                      {formatCurrency(transaction.amount)}
                    </Td>
                    <Td>
                      {transaction.description?.startsWith('https://') ? (
                        <Link href={transaction.description}>Graphics</Link>
                      ) : (
                        transaction.description
                      )}
                    </Td>
                    {transactionStatus === 'mixed' && (
                      <Td>
                        <StatusBadge status={transaction.status} />
                      </Td>
                    )}
                    <PermissionGuard userPermissions="canProcessBankTransactions">
                      <Td textAlign="right">
                        {transaction.type !== 'training' &&
                          transaction.type !== 'seasonal coaching' &&
                          transaction.type !== 'change' &&
                          transaction.status === 'completed' && (
                            <Button
                              variant="outline"
                              colorScheme="facebook"
                              isDisabled={isSubmitting}
                              onClick={() => handleRevert(transaction.id)}
                              isLoading={
                                revertID === transaction.id && isSubmitting
                              }
                            >
                              Undo
                            </Button>
                          )}
                      </Td>
                    </PermissionGuard>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};
