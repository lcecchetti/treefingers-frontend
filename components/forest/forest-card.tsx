import { getForestUrl } from '@/lib/helper/forest';
import { Text, Link, Button } from '@/components/ui';
import { ForestActions } from '@/components/forest/forest-actions';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { graphql, useFragment, type FragmentType } from '@/lib/graphql/generated';

// colocated with the component that owns it, per Apollo's fragment
// guidance - this is codegen's type-level fragment masking (not Apollo
// Client's runtime dataMasking, which isn't enabled on any client in this
// app), so `useFragment` below is a plain type-cast safe to call from any
// component, RSC or client - see lib/graphql/generated/fragment-masking.ts
export const ForestCard_ForestFragment = graphql(`
  fragment ForestCard_forest on Forest {
    id
    name
    excerpt
    commentsCount
    membersCount
    currentUserMembership {
      id
    }
  }
`);

interface ForestCardProps {
  className?: string;
  forest: FragmentType<typeof ForestCard_ForestFragment>;
}

export const ForestCard = ({ className, forest: forestRef }: ForestCardProps) => {
  const forest = useFragment(ForestCard_ForestFragment, forestRef);

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
