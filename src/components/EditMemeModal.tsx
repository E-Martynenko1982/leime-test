import React from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Meme } from '@/gateways/api';

interface EditMemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMeme: Meme | null;
  editForm: { name: string; imgUrl: string };
  setEditForm: React.Dispatch<React.SetStateAction<{ name: string; imgUrl: string }>>;
  handleSubmit: (e: React.FormEvent) => void;
}

const EditMemeModal: React.FC<EditMemeModalProps> = ({
  isOpen,
  onClose,
  selectedMeme,
  editForm,
  setEditForm,
  handleSubmit,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Edit Meme</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                  ID
                </label>
                <Input
                  id="id"
                  type="text"
                  value={selectedMeme?.id || ''}
                  readOnly
                  disabled
                  className="mt-1 bg-gray-100"
                />
              </div>
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
                <label htmlFor="likes" className="block text-sm font-medium text-gray-700">
                  Likes
                </label>
                <Input
                  id="likes"
                  type="number"
                  value={String(selectedMeme?.likes || 0)}
                  readOnly
                  disabled
                  className="mt-1 bg-gray-100"
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
  );
};

export default EditMemeModal; 