import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import type { Item } from '@/lib/mock-data';

export function ItemCard({ item }: { item: Item }) {
  return (
    <Link href={`/items/${item.id}`} className="group block">
      <Card className="overflow-hidden h-full border-2 border-transparent transition-all hover:border-black/10 hover:shadow-xl bg-white rounded-2xl">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover grayscale transition-transform group-hover:scale-105"
            data-ai-hint={item.category.toLowerCase()}
          />
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/90 text-black border-none font-bold hover:bg-white shadow-sm">
              {item.category}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-headline text-lg font-bold leading-tight group-hover:text-black transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {item.location}
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="bg-black/5 text-black border-none text-[10px] uppercase font-bold tracking-wider">
              {item.condition}
            </Badge>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}