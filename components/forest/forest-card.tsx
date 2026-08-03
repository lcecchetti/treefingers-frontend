import { getForestUrl, type ForestRef } from '@/lib/helper/forest';
import { Text, Link, Button } from '@/components/ui';
import { ForestActions, type ForestActionsForest } from '@/components/forest/forest-actions';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ForestCardForest extends ForestActionsForest, ForestRef {
  excerpt: string;
}

interface ForestCardProps {
  className?: string;
  forest: ForestCardForest;
}

export const ForestCard = ({ className, forest }: ForestCardProps) => {
  return (
    <Card className={cn('border-2 bg-base', className)}>
      <CardContent>
        <Link href={getForestUrl(forest)} className="w-full">
          <Text variant="title" className="break-words text-center">{forest.name}</Text>
        </Link>
        <Text variant="p" className="break-words w-full text-center">{forest.excerpt}</Text>
        <Button as={Link} variant="primary" href={getForestUrl(forest)}>Read more</Button>
      </CardContent>
      <CardFooter>
        <div></div>
        <ForestActions forest={forest} />
      </CardFooter>
    </Card>
  );
};
