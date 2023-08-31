import {
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Spinner,
} from '@chakra-ui/react';
import classnames from 'classnames';
import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from 'recharts';

import { TPETimeline } from '../../typings';
import { mapTimelineForChart } from '../playerForms/shared';

const COLORS = [
  '#394BA0',
  '#009F75',
  '#FF00BD',
  '#0057E9',
  '#87E911',
  '#E11845',
];

export const TPEChart = ({
  tpeTimelines,
  isLoading,
  tagCallback,
}: {
  tpeTimelines: TPETimeline[];
  isLoading?: boolean;
  tagCallback: (name: string) => void;
}) => {
  const [chartMap, setChartMap] = useState<
    | {
        data: {
          taskDate: string;
        }[];
        names: string[];
      }
    | undefined
  >(undefined);

  useEffect(() => {
    if (tpeTimelines?.length) {
      setChartMap(mapTimelineForChart(tpeTimelines));
    }
  }, [tpeTimelines]);

  return (
    <div className="relative">
      <div
        className={classnames(
          'absolute h-auto w-full rounded-lg bg-grey700 transition-opacity',
          isLoading ? 'visible bg-opacity-10' : 'hidden bg-opacity-0',
        )}
        style={{ height: 400 }}
      >
        <Spinner
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
          size="xl"
        />
      </div>
      <ResponsiveContainer width="100%" height={400} className="my-4">
        <LineChart
          className="font-mont"
          data={chartMap?.data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="taskDate" />
          <YAxis />
          <Tooltip />
          {chartMap?.names.map((name, index) => (
            <Line
              key={name}
              type="monotone"
              connectNulls
              dataKey={name}
              stroke={COLORS[index]}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <HStack spacing={4}>
        {chartMap?.names.map((name, index) => (
          <Tag
            size="sm"
            key={name}
            borderRadius="full"
            variant="solid"
            backgroundColor={COLORS[index]}
          >
            <TagLabel>{name}</TagLabel>
            <TagCloseButton onClick={() => tagCallback(name)} />
          </Tag>
        ))}
      </HStack>
    </div>
  );
};
