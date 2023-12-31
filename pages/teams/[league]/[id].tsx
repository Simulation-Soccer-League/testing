import {
  Card,
  CardBody,
  Stack,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import type { GetServerSideProps } from 'next/types';
import { useMemo } from 'react';

import { PageWrapper } from '../../../components/common/PageWrapper';
import { PlayerTable } from '../../../components/common/tables/PlayerTable';
import { TeamBankTable } from '../../../components/common/tables/TeamBankTable';
import { TeamLogo } from '../../../components/TeamLogo';
import { Player, Team } from '../../../typings';
import { InternalLeague } from '../../../typings/portal-db';
import { leagueIdToName, leagueNameToId } from '../../../utils/leagueHelpers';
import { query } from '../../../utils/query';

export default ({
  league,
  teamid,
}: {
  league: InternalLeague;
  teamid: number | string;
}) => {
  const teamPage = useMemo(() => teamid !== 'ufa', [teamid]);

  const leagueID = useMemo(() => leagueNameToId(league), [league]);

  const { data: teamData, isLoading: teamLoading } = useQuery<Team>({
    queryKey: ['team', teamid, leagueID],
    queryFn: () =>
      query(`api/v1/teams/${teamid}?league=${leagueID}`, undefined, true),
    enabled: teamPage,
  });

  const { data: roster, isLoading: playersLoading } = useQuery<Player[]>({
    queryKey: ['teamRoster', teamPage, leagueID, teamid],
    queryFn: () =>
      query(
        `api/v1/player?${
          teamPage
            ? `teamID=${teamid}&leagueID=${leagueID}${
                leagueID === 2 ? '&status=active' : ''
              }`
            : `teamID=${teamid}&status=active`
        }`,
      ),
  });

  const leagueName = useMemo(() => {
    if (teamData?.league !== undefined) {
      return leagueIdToName(teamData?.league);
    }
  }, [teamData?.league]);

  const { data: prospects, isLoading: prospectsLoading } = useQuery<Player[]>({
    queryKey: ['teamProspects', teamid, leagueName, teamPage],
    queryFn: () => query(`api/v1/player?teamRightsID=${teamid}&leagueID=1`),
    enabled: leagueName !== undefined && leagueName === 'shl' && teamPage,
  });

  return (
    <PageWrapper loading={(teamPage ? teamLoading : false) || playersLoading}>
      <div className="flex items-center justify-center">
        <div className="my-4 flex w-11/12 flex-col space-y-4 lg:w-3/5">
          {teamData && (
            <Card
              direction="row"
              overflow="hidden"
              variant="outline"
              style={{ backgroundColor: teamData.colors.primary }}
            >
              {leagueName && teamPage && (
                <TeamLogo
                  teamAbbreviation={teamData.abbreviation}
                  league={leagueName}
                  className="m-2 max-h-20 lg:max-h-28"
                />
              )}
              <Stack>
                <CardBody className="flex">
                  <h1 className="m-auto text-4xl font-bold text-[color:white]">
                    {teamData.name}
                  </h1>
                </CardBody>
              </Stack>
            </Card>
          )}
          <Tabs>
            <TabList>
              <Tab>{teamPage ? 'Roster' : 'Unrestricted Free Agents'}</Tab>
              {leagueName === 'shl' && teamPage && <Tab>Prospects</Tab>}
              <Tab>Bank Accounts</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <PlayerTable data={roster ?? []} isLoading={playersLoading} />
              </TabPanel>
              {leagueName === 'shl' && teamPage && (
                <TabPanel>
                  <PlayerTable
                    data={prospects ?? []}
                    isLoading={prospectsLoading}
                  />
                </TabPanel>
              )}
              <TabPanel>
                <TeamBankTable
                  data={[...(roster ?? []), ...(prospects ?? [])]}
                  isLoading={playersLoading}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </PageWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { league, id } = ctx.query;
  return { props: { league, teamid: id } };
};
