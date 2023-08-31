import { Alert, AlertTitle, AlertIcon } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { useContext, useState } from 'react';

import { Transaction } from '../../../../components/bank/Transaction';
import { PageWrapper } from '../../../../components/common/PageWrapper';
import { useSession } from '../../../../contexts/AuthContext';
import { ToastContext } from '../../../../contexts/ToastContext';
import { BankTransaction } from '../../../../typings';
import { mutate, query } from '../../../../utils/query';

export default ({ groupID }: { groupID: number }) => {
  const { session } = useSession();
  const { addToast } = useContext(ToastContext);
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery<BankTransaction[]>({
    queryKey: ['groupTransaction', groupID],
    queryFn: () => query(`api/v1/bank/transactions?groupID=${groupID}`),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const approve = useMutation<
    // TODO: type return type
    unknown,
    { message: string },
    // TODO: type variables a bit stricter
    Record<string, unknown>
  >({
    mutationFn: (variables) =>
      mutate('api/v1/bank/transactions/approve', variables, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      }),
  });

  const deny = useMutation<
    // TODO: type return type
    unknown,
    { message: string },
    // TODO: type variables a bit stricter
    Record<string, unknown>
  >({
    mutationFn: (variables) =>
      mutate('api/v1/bank/transactions/deny', variables, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      }),
  });

  const revert = useMutation<
    // TODO: type return type
    unknown,
    { message: string },
    // TODO: type variables a bit stricter
    Record<string, unknown>
  >({
    mutationFn: (variables) =>
      mutate('api/v1/bank/transactions/reverse', variables, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      }),
  });

  const handleSubmit = async (
    action: 'APPROVE' | 'DENY' | 'REVERT',
    transactionId?: number,
  ) => {
    setIsSubmitting(true);

    const transaction =
      action === 'APPROVE' ? approve : action === 'DENY' ? deny : revert;

    transaction.mutate(
      {
        recipient: transactionId ? 'INDIVIDUAL' : 'GROUP',
        id: transactionId ?? data[0].groupID,
      },
      {
        onError: ({ message }) => {
          addToast({
            title: `Error`,
            description: `Could not ${action.toLowerCase()} transaction. ${
              message ?? 'Please try again.'
            }`,
            status: 'error',
          });
        },
        onSuccess: () => {
          addToast({
            title: `Complete`,
            description: `Successfully ${
              action === 'APPROVE'
                ? 'approved'
                : action === 'DENY'
                ? 'denied'
                : 'reversed'
            } transaction`,
            status: 'success',
          });
          queryClient.invalidateQueries({
            queryKey: ['groupTransaction'],
          });
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      },
    );
  };

  return (
    <PageWrapper loading={isLoading}>
      <div className="flex items-center justify-center">
        <div className="my-4 flex w-11/12 flex-col lg:w-3/5">
          {!data.length ? (
            <Alert
              status="error"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
            >
              <AlertIcon />
              <AlertTitle>Transaction Not Found</AlertTitle>
            </Alert>
          ) : (
            <Transaction
              transactions={data}
              recipient="GROUP"
              isSubmitting={isSubmitting}
              submit={handleSubmit}
            />
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id } = query;

  return {
    props: {
      groupID: id,
    },
  };
};
