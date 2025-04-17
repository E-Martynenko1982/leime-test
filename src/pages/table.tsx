import { useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import { useDisclosure } from '@heroui/modal';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from '@heroui/table';
import { api, Meme } from '@/gateways/api';
import EditMemeModal from '@/components/EditMemeModal';

export default function TableView() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    imgUrl: '',
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'likes', label: 'Likes' },
    { key: 'actions', label: 'Actions' },
  ];

  const generateRandomLikes = () => Math.floor(Math.random() * 100);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const data = await api.getAllMemes();
        const memesWithLikes = data.map(meme => ({
          ...meme,
          likes: meme.likes || generateRandomLikes(),
        }));
        setMemes(memesWithLikes);
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
    });
    onOpen();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeme) return;

    try {
      const randomLikes = generateRandomLikes();
      const updatedMeme = await api.updateMeme(selectedMeme.id, {
        ...editForm,
        likes: randomLikes,
      });
      setMemes(
        memes.map(meme =>
          meme.id === selectedMeme.id ? { ...updatedMeme, likes: randomLikes } : meme,
        ),
      );
      onClose();
    } catch (error) {
      console.error('Error updating meme:', error);
    }
  };

  const renderCell = (meme: Meme, columnKey: string | number) => {
    const cellValue = getKeyValue(meme, columnKey.toString());

    switch (columnKey) {
      case 'actions':
        return (
          <Button color="primary" variant="flat" size="sm" onPress={() => handleEdit(meme)}>
            Edit
          </Button>
        );
      default:
        return cellValue;
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
          {columns.map(column => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {memes.map(meme => (
            <TableRow key={meme.id}>
              {columnKey => <TableCell>{renderCell(meme, columnKey)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <EditMemeModal
        isOpen={isOpen}
        onClose={onClose}
        selectedMeme={selectedMeme}
        editForm={editForm}
        setEditForm={setEditForm}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
