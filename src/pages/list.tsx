import { useState, useEffect } from 'react';
import { Image } from "@heroui/image";
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/modal';
import { api, Meme } from '@/services/api';

export default function ListView() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    imgUrl: ''
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  // Function to generate random likes
  const generateRandomLikes = () => Math.floor(Math.random() * 100);

  // Function to create new meme
  const handleCreateMeme = async () => {
    try {
      const newMeme = await api.createMeme({
        name: editForm.name,
        imgUrl: editForm.imgUrl,
        likes: generateRandomLikes()
      });
      setMemes([...memes, newMeme]);
      onClose();
    } catch (error) {
      console.error('Error creating meme:', error);
    }
  };

  const handleEdit = (meme: Meme) => {
    setSelectedMeme(meme);
    setEditForm({
      name: meme.name,
      imgUrl: meme.imgUrl
    });
    onOpen();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeme) return;

    try {
      const updatedMeme = await api.updateMeme(selectedMeme.id, {
        ...editForm,
        likes: generateRandomLikes()
      });
      setMemes(memes.map(meme =>
        meme.id === selectedMeme.id ? updatedMeme : meme
      ));
      onClose();
    } catch (error) {
      console.error('Error updating meme:', error);
    }
  };

  const getImageUrl = (url: string) => {
    console.log('Processing URL:', url);

    // Return placeholder for invalid URLs
    if (!url || url === 'URL_ВАШОЇ_КАРТИНКИ' || !url.startsWith('http')) {
      console.log('Invalid URL, using placeholder');
      return 'https://placehold.co/400x300/png?text=No+Image';
    }

    // Handle Imgur URLs
    if (url.includes('imgur.com')) {
      // Handle imgur.com/a/ format
      if (url.includes('imgur.com/a/')) {
        const imageId = url.split('/').pop();
        return `https://i.imgur.com/${imageId}.jpg`;
      }
      // Handle direct imgur.com links
      if (url.includes('imgur.com/')) {
        const imageId = url.split('/').pop()?.split('.')[0];
        return `https://i.imgur.com/${imageId}.jpg`;
      }
    }

    // Handle direct image URLs
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return url;
    }

    // Return placeholder for unsupported URLs
    console.log('Unsupported URL format, using placeholder');
    return 'https://placehold.co/400x300/png?text=No+Image';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  console.log('First meme:', memes[0]);
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Meme Directory - List View</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memes.map((meme) => (
          <Card key={meme.id} className="w-full">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h4 className="font-bold text-large">{meme.name}</h4>
              <p className="text-tiny text-default-500">ID: {meme.id}</p>
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
              <div className="flex-grow text-small text-default-500">
                Likes: {meme.likes}
              </div>
              <Button
                color="primary"
                variant="flat"
                size="sm"
                onPress={() => handleEdit(meme)}
              >
                Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>Edit Meme</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                    minLength={3}
                    maxLength={100}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="imgUrl" className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <Input
                    id="imgUrl"
                    type="url"
                    value={editForm.imgUrl}
                    onChange={(e) => setEditForm({ ...editForm, imgUrl: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Save
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
} 