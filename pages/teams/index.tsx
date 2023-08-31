import { Select } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import { Link } from '../../components/common/Link';
import { PageWrapper } from '../../components/common/PageWrapper';
import { TeamCard } from '../../components/TeamCard';
import { Team } from '../../typings';
import { query } from '../../utils/query';

export default () => {
  const [league, setLeague] = useState(0);

  const { data } = useQuery<Team[]>({
    queryKey: ['teamPage', league],
    queryFn: () => query(`/api/v1/teams?league=${league}`, undefined, true),
  });

  const router = useRouter();

  const setLeagueCallback = useCallback(
    (value: number) => {
      router.replace(`/teams?league=${value}`);
    },
    [router],
  );

  useEffect(() => {
    if (router.query?.league) {
      if (Number(router.query.league) !== league)
        setLeague(Number(router.query.league));
    }
  }, [league, router.query.league]);

  return (
    <PageWrapper>
      <div className="flex items-center justify-center">
        <div className="my-4 flex w-11/12 flex-col space-y-4 lg:w-3/5">
          <div className="bg-grey900 p-2 text-xl text-grey100">Teams</div>
          <Select
            defaultValue={0}
            onChange={(e) => {
              setLeagueCallback(parseInt(e.target.value));
            }}
          >
            <option value={0} selected={league === 0}>
              Simulation Hockey League (SHL)
            </option>
            <option value={1} selected={league === 1}>
              Simulation Major Junior Hockey League (SMJHL)
            </option>
            <option value={2} selected={league === 2}>
              IIHF World Championship (IIHF)
            </option>
          </Select>
          <div className="grid auto-rows-[100px] grid-cols-[repeat(auto-fill,_minmax(320px,_1fr))] gap-4 sm:grid-cols-[repeat(auto-fill,_minmax(500px,_1fr))]">
            {data?.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
            {league === 0 && data && (
              <Link
                href={{
                  pathname: '/teams/[league]/[id]',
                  query: {
                    league: 'shl',
                    id: 'ufa',
                  },
                }}
                className="flex h-full w-full items-center rounded-lg bg-grey500 px-4"
              >
                <h2>
                  <span className="block font-mont font-normal tracking-widest">
                    SHL
                  </span>
                  <span className="font-semibold uppercase tracking-[0.15rem]">
                    Unrestricted Free Agents
                  </span>
                </h2>
              </Link>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
