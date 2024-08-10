'use client';

import * as React from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { HouseSimple as HouseSimpleIcon } from '@phosphor-icons/react/dist/ssr/HouseSimple';
import type { ApexOptions } from 'apexcharts';
import { useTranslation } from 'react-i18next';
import { Chart } from '@/components/core/chart';

const iconMapping = {
  'Devre Mülk': HouseSimpleIcon,
  'Günlük Kiralık': HouseSimpleIcon,
  'Kiralık': HouseSimpleIcon
} as Record<string, Icon>;

export interface TrafficProps {
  sx?: SxProps;
}

export function Traffic({ sx }: TrafficProps): React.JSX.Element {
  const [chartSeries, setChartSeries] = React.useState<number[]>([]);
  const [labels, setLabels] = React.useState<string[]>([]);
  const chartOptions = useChartOptions(labels);
  const {t} = useTranslation();

  React.useEffect(() => {
    const fetchEstateStatusCounts = async () => {
      try {
        const response = await axios.get('http://localhost:5224/api/Estate/counts');
        const data = response.data;

        const total = data.reduce((sum: number, item: { count: number }) => sum + item.count, 0);
        const percentageSeries = data.map((item: { count: number }) => (item.count / total) * 100);

        setChartSeries(percentageSeries);
        setLabels(data.map((item: { statusName: string }) => item.statusName));
      } catch (error) {
        console.error('Error fetching estate status counts:', error);
      }
    };

    fetchEstateStatusCounts();
  }, []);

  return (
    <Card sx={sx}>
      <CardHeader title = {t("statusDistribution")}/>
      <CardContent>
        <Stack spacing={2}>
          <Chart height={300} options={chartOptions} series={chartSeries} type="donut" width="100%" />
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
            {chartSeries.map((item, index) => {
              const label = labels[index];
              const Icon = iconMapping[label] || HouseSimpleIcon;

              return (
                <Stack key={label} spacing={1} sx={{ alignItems: 'center' }}>
                  <Icon fontSize="var(--icon-fontSize-lg)" />
                  <Typography variant="h6">{label}</Typography>
                  <Typography color="text.secondary" variant="subtitle2">
                    {item.toFixed(2)}%
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function useChartOptions(labels: string[]): ApexOptions {
  const theme = useTheme();

  return {
    chart: { background: 'transparent' },
    colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main],
    dataLabels: { enabled: false },
    labels,
    legend: { show: false },
    plotOptions: { pie: { expandOnClick: false } },
    states: { active: { filter: { type: 'none' } }, hover: { filter: { type: 'none' } } },
    stroke: { width: 0 },
    theme: { mode: theme.palette.mode },
    tooltip: { fillSeriesColor: false },
  };
}
