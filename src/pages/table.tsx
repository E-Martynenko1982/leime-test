import { useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/modal';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, getKeyValue } from '@heroui/table';
import { Image } from '@heroui/image';
import { api, Meme } from '@/services/api';

export default function TableView() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    imgUrl: '',
    likes: 0
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'image', label: 'Image' },
    { key: 'likes', label: 'Likes' },
    { key: 'actions', label: 'Actions' }
  ] as const;

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

  const handleEdit = (meme: Meme) => {
    setSelectedMeme(meme);
    setEditForm({
      name: meme.name,
      imgUrl: meme.imgUrl,
      likes: meme.likes
    });
    onOpen();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeme) return;

    try {
      const updatedMeme = await api.updateMeme(selectedMeme.id, editForm);
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

  const renderCell = (meme: Meme, columnKey: string | number) => {
    switch (columnKey) {
      case 'image':
        return (
          <Image
            alt={meme.name}
            src={getImageUrl(meme.imgUrl)}
            width={100}
            height={100}
            radius="lg"
            shadow="sm"
            loading="lazy"
            fallbackSrc="https://placehold.co/100x100/png?text=No+Image"
          />
        );
      case 'actions':
        return (
          <Button
            color="primary"
            variant="flat"
            size="sm"
            onPress={() => handleEdit(meme)}
          >
            Edit
          </Button>
        );
      default:
        return getKeyValue(meme, columnKey.toString());
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Meme Directory - Table View</h1>

      <Table aria-label="Meme table">
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {memes.map((meme) => (
            <TableRow key={meme.id}>
              {(columnKey) => (
                <TableCell>{renderCell(meme, columnKey)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
                <div>
                  <label htmlFor="likes" className="block text-sm font-medium text-gray-700">
                    Likes
                  </label>
                  <Input
                    id="likes"
                    type="text"
                    value={editForm.likes.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d+$/.test(value)) {
                        setEditForm({ ...editForm, likes: value === '' ? 0 : parseInt(value) });
                      }
                    }}
                    required
                    pattern="[0-9]*"
                    inputMode="numeric"
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