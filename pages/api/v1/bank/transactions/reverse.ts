import type { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { checkUserAuthorization } from '../../../../../lib/checkUserAuthorization';
import { CAN_PROCESS_BANK_TRANSACTIONS } from '../../../../../lib/constants';
import { endTransaction, query, transaction } from '../../../../../lib/db';
import { BankTransactionRecipientTypes } from '../../../../../typings';
import { InternalBankTransactions } from '../../../../../typings/portal-db';

interface ExtendedRequest extends NextApiRequest {
  body: {
    recipient: BankTransactionRecipientTypes;
    id: string;
  };
}

const getTransactionsQuery = (
  recipient: BankTransactionRecipientTypes,
  id: string,
) => {
  if (recipient === 'GROUP') {
    return SQL`SELECT * FROM bankTransactions WHERE groupID=${id};`;
  }
  return SQL`SELECT * FROM bankTransactions WHERE id=${id};`;
};

export default async function handler(
  req: ExtendedRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  if (
    !(await checkUserAuthorization(req, {
      validRoles: CAN_PROCESS_BANK_TRANSACTIONS,
    }))
  ) {
    res.status(401).end(`Not authorized`);
    return;
  }

  const transactions = await query<InternalBankTransactions>(
    getTransactionsQuery(req.body.recipient, req.body.id),
  );

  if ('error' in transactions) {
    res.status(500).end('Server connection failed');
    return;
  }

  if (
    !transactions.length ||
    transactions.some(
      (transaction) =>
        transaction.status !== 'completed' ||
        transaction.type === 'seasonal coaching' ||
        transaction.type === 'training',
    )
  ) {
    res.status(400).end('Invalid request');
    return;
  }

  const reversedTransactions = transactions.filter(
    (transaction) => transaction.status === 'reversed',
  );

  if (reversedTransactions.length) {
    res
      .status(400)
      .end(
        `Transactions already reversed. Relevant reversal IDs: ${reversedTransactions
          .map((transaction) => transaction.id)
          .join(', ')}`,
      );
    return;
  }

  const results = await transaction()
    .query(
      SQL`
      UPDATE bankTransactions
      SET status = 'reversed',
      reversedDate = CURRENT_TIMESTAMP(),
      reversedByID = ${req.cookies.userid}
      WHERE id IN (${transactions.map((transaction) => transaction.id)})
      `,
    )
    .rollback((_e: any) => {})
    .commit();

  await endTransaction();

  if ('error' in results) {
    res.status(500).end('Server connection failed');
    return;
  }

  if (!results.length) {
    res.status(400).end('Invalid request');
    return;
  }

  res.status(200).json({
    status: 'success',
  });
}
