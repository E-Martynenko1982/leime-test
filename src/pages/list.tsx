import { useState, useEffect } from 'react';
import { Image } from '@heroui/image';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { api, Meme } from '@/gateways/api';
import { getImageUrl } from '@/utils/urlUtils';

export default function ListView() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const data = await api.getAllMemes();
        setMemes(data);
      } catch (error) {
        console.error('Error fetching memes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemes();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Meme Directory - List View</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {memes.map(meme => (
          <Card key={meme.id} className="w-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h4 className="font-bold text-large">
                <a
                  href={meme.imgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {meme.name}
                </a>
              </h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Image
                alt={meme.name}
                src={getImageUrl(meme.imgUrl)}
                width={400}
                height={300}
                radius="lg"
                shadow="sm"
                loading="lazy"
                fallbackSrc="https://placehold.co/400x300/png?text=No+Image"
                onError={() => {
                  console.error('Error loading image for meme:', meme);
                }}
              />
            </CardBody>
            <CardFooter className="gap-3">
              <div className="flex-grow text-small text-default-500">Likes: {meme.likes}</div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
