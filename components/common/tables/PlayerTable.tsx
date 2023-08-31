import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Button, Progress } from '@chakra-ui/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { startCase } from 'lodash';
import { HTMLAttributeAnchorTarget, useMemo } from 'react';

import { Player } from '../../../typings';
import { Link } from '../Link';

import { simpleGlobalFilterFn } from './shared';
import { Table } from './Table';
import { PLAYER_TABLE } from './tableBehavioralFlags';
import { TableHeader } from './TableHeader';

const columnHelper = createColumnHelper<Player>();

export const PlayerTable = ({
  data,
  linkTarget,
  actionConfig,
  isLoading,
}: {
  data: Array<Player>;
  isLoading?: boolean;
  linkTarget?: HTMLAttributeAnchorTarget;
  actionConfig?: {
    action: string;
    callback: (player: Player) => void;
    disabledIDs?: number[];
  };
}) => {
  const columns = useMemo(() => {
    const currentColumns = [
      columnHelper.accessor(({ name, pid }) => [name, pid], {
        header: 'Name',
        cell: (props) => {
          const cellValue = props.getValue();
          return (
            <Link
              className="!hover:no-underline ml-2 block text-blue600"
              href={{
                pathname: '/player/[id]',
                query: {
                  id: cellValue[1].toString(),
                },
              }}
              target={linkTarget ?? '_self'}
            >
              <p className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap lg:max-w-[300px]">
                {linkTarget && linkTarget !== '_self' && (
                  <ExternalLinkIcon className="mr-2" />
                )}
                {cellValue[0]}
              </p>
            </Link>
          );
        },
        enableSorting: false,
      }),
      columnHelper.accessor('name', {
        header: () => (
          <TableHeader title="Player Name">Player Name</TableHeader>
        ),
        enableGlobalFilter: true,
      }),
      columnHelper.accessor('username', {
        header: () => <TableHeader title="Username">Username</TableHeader>,
        enableGlobalFilter: true,
      }),
      columnHelper.accessor('position', {
        header: () => <TableHeader title="Position">Position</TableHeader>,
        enableGlobalFilter: true,
      }),
      columnHelper.accessor('totalTPE', {
        header: () => <TableHeader title="Total TPE">Total TPE</TableHeader>,
        enableGlobalFilter: false,
      }),
      columnHelper.accessor('appliedTPE', {
        header: () => (
          <TableHeader title="Applied TPE">Applied TPE</TableHeader>
        ),
        enableGlobalFilter: false,
      }),
      columnHelper.accessor('bankedTPE', {
        header: () => <TableHeader title="Banked TPE">Banked TPE</TableHeader>,
        enableGlobalFilter: false,
      }),
      columnHelper.accessor('draftSeason', {
        header: () => (
          <TableHeader title="Draft Season">Draft Season</TableHeader>
        ),
        enableGlobalFilter: true,
      }),
      columnHelper.accessor('status', {
        header: () => <TableHeader title="Status">Status</TableHeader>,
        enableGlobalFilter: true,
        cell: (props) => startCase(props.getValue()),
      }),
    ];

    if (actionConfig) {
      currentColumns.push(
        columnHelper.display({
          id: 'actions',
          cell: (props) => (
            <Button
              isDisabled={actionConfig.disabledIDs?.includes(
                props.row.original.uid,
              )}
              variant="outline"
              colorScheme="blue"
              onClick={() => actionConfig.callback(props.row.original)}
            >
              {actionConfig.action}
            </Button>
          ),
        }),
      );
    }
    return currentColumns;
  }, [actionConfig, linkTarget]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableGlobalFilter: true,
    globalFilterFn: simpleGlobalFilterFn,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnVisibility: {
        name: false,
      },
    },
  });

  return (
    <>
      <Table<Player> table={table} tableBehavioralFlags={PLAYER_TABLE} />
      {isLoading && <Progress size="xs" isIndeterminate />}
    </>
  );
};
