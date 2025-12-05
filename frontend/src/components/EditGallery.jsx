import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

export default function EditGalleryModal({
  isOpen,
  onClose,
  editPhoto,
  setEditPhoto,
  handleEditSave,
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-96 relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              onClick={onClose}
            >
              <X size={24} />
            </button>

            <Dialog.Title className="text-xl font-semibold text-gray-700 mb-4">
              Edit Photo
            </Dialog.Title>

            {/* Image Upload */}
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded-lg mb-3 text-black"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setEditPhoto((prev) => ({
                    ...prev,
                    imageFile: file,
                    previewUrl: URL.createObjectURL(file),
                  }));
                }
              }}
            />

            {/* Preview Image */}
            {editPhoto.previewUrl && (
              <img
                src={editPhoto.previewUrl}
                alt="Preview"
                className="w-full h-40 object-cover rounded-md mb-3"
              />
            )}

            {/* Description Input */}
            <input
              type="text"
              className="w-full p-2 border rounded-lg mb-3 text-black"
              placeholder="Photo Description"
              value={editPhoto.description}
              onChange={(e) =>
                setEditPhoto((prev) => ({ ...prev, description: e.target.value }))
              }
            />

            {/* Save Button */}
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                onClick={handleEditSave}
              >
                Save Changes
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
