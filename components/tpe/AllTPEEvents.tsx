import { useQuery } from '@tanstack/react-query';

import { TPEEvent } from '../../typings';
import { query } from '../../utils/query';
import { TPEEventsTable } from '../common/tables/TPEEventsTable';

export const AllTPEEvents = () => {
  const { data = [], isLoading } = useQuery<TPEEvent[]>({
    queryKey: ['allTPEEvents'],
    queryFn: () => query('api/v1/tpeevents'),
  });

  return <TPEEventsTable isLoading={isLoading} allDetail data={data} />;
};
