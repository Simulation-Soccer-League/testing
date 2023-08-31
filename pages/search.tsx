import {
  Collapse,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { PermissionGuard } from '../components/auth/PermissionGuard';
import { PageWrapper } from '../components/common/PageWrapper';
import { PlayerTable } from '../components/common/tables/PlayerTable';
import { TPEChart } from '../components/tpe/TPEChart';
import { Player, TPETimeline } from '../typings';
import { query } from '../utils/query';

export default () => {
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [draftSeason, setDraftSeason] = useState<string>('');

  const queryString = useMemo(() => {
    return [selectedLeague, status, draftSeason]
      .filter((value) => value !== '')
      .join('&');
  }, [draftSeason, selectedLeague, status]);

  const { data, isLoading } = useQuery<Player[]>({
    queryKey: ['searchPlayers', queryString],
    queryFn: () =>
      query(
        `api/v1/player?${queryString}${
          queryString.includes('status=pending') ? '' : '&notStatus=pending'
        }&notStatus=denied`,
      ),
  });

  useEffect(() => {
    if (!isLoading && draftSeason === `draftSeason=0`) {
      setDraftSeason('');
    }
  }, [draftSeason, isLoading]);

  const [comparisonPlayers, setComparisonPlayers] = useState<Player[]>([]);

  const playerComparisonQuery = useMemo(
    () => comparisonPlayers.map((player) => `pid=${player.pid}`).join('&'),
    [comparisonPlayers],
  );

  const { data: timelineData, isLoading: isTimelineLoading } = useQuery<
    TPETimeline[]
  >({
    queryKey: ['tpeTimeline', playerComparisonQuery],
    queryFn: () =>
      query(`/api/v1/tpeevents/timeline?${playerComparisonQuery}`, {
        headers: {},
      }),
    enabled: comparisonPlayers.length > 0,
  });

  const addComparisonPlayer = useCallback(
    (player: Player) => setComparisonPlayers((prev) => [...prev, player]),
    [],
  );

  const removeComparisonPlayer = useCallback(
    (playerName: string) =>
      setComparisonPlayers((prev) =>
        prev.filter((player) => player.name !== playerName),
      ),
    [],
  );

  return (
    <PageWrapper>
      <div className="flex items-center justify-center">
        <div className="my-4 flex w-11/12 flex-col lg:w-3/5">
          <div className="bg-grey900 p-2 text-xl text-grey100">
            Player Search
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-6 py-2 pb-6">
            <div>
              <FormLabel>League</FormLabel>
              <RadioGroup onChange={setSelectedLeague} value={selectedLeague}>
                <Stack direction="row">
                  <Radio value="">All</Radio>
                  <Radio value="leagueID=0">SHL</Radio>
                  <Radio value="leagueID=1">SMJHL</Radio>
                </Stack>
              </RadioGroup>
            </div>
            <div>
              <FormLabel>Status</FormLabel>
              <RadioGroup onChange={setStatus} value={status}>
                <Stack direction="row">
                  <Radio value="">All</Radio>
                  <Radio value="status=active">Active</Radio>
                  <Radio value="status=retired">Retired</Radio>
                  <PermissionGuard userPermissions="canViewPendingPlayers">
                    <Radio value="status=pending">Pending</Radio>
                  </PermissionGuard>
                </Stack>
              </RadioGroup>
            </div>
            <div>
              <FormLabel>Draft Season</FormLabel>
              <Input
                type="number"
                min={0}
                onChange={(e) =>
                  setDraftSeason(`draftSeason=${Number(e.target.value)}`)
                }
              ></Input>
            </div>
          </div>
          <div className="flex w-full flex-col">
            <PlayerTable
              data={data ?? []}
              isLoading={isLoading}
              actionConfig={{
                action: 'Compare',
                callback: addComparisonPlayer,
              }}
            />
          </div>
          <div>
            <Collapse in={comparisonPlayers.length > 0} animateOpacity>
              <>
                <div className="mt-4 bg-grey900 p-2 text-grey100">
                  <div className="flex justify-between font-bold">
                    <span>TPE Comparison</span>
                  </div>
                </div>
                <TPEChart
                  tpeTimelines={timelineData ?? []}
                  isLoading={isTimelineLoading}
                  tagCallback={removeComparisonPlayer}
                />
              </>
            </Collapse>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
