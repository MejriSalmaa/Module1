import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MatchingDataPoint {
  label: string;
  value: number;
  maxValue: number;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
  color?: string;
}

interface MatchingChartProps {
  title: string;
  data: MatchingDataPoint[];
}

export function MatchingChart({ title, data }: MatchingChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.label}</span>
                {item.trend && (
                  <Badge variant="outline" className="text-xs gap-1">
                    {item.trend.direction === 'up' ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    {item.trend.percentage}%
                  </Badge>
                )}
              </div>
              <span className="text-muted-foreground">
                {item.value} / {item.maxValue}
              </span>
            </div>
            <Progress
              value={(item.value / item.maxValue) * 100}
              className="h-2"
              indicatorClassName={item.color || 'bg-primary'}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
