import { useState, useRef } from 'react';

interface PhotoUploadProps {
  onPhotosUploaded: (photos: { front?: string; side?: string; back?: string }) => void;
  existingPhotos?: { front?: string; side?: string; back?: string };
}

export default function PhotoUpload({ onPhotosUploaded, existingPhotos }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<{ front?: string; side?: string; back?: string }>(existingPhotos || {});
  const [dragOver, setDragOver] = useState<string | null>(null);
  const fileInputRefs = {
    front: useRef<HTMLInputElement>(null),
    side: useRef<HTMLInputElement>(null),
    back: useRef<HTMLInputElement>(null)
  };

  const handleFileSelect = (position: 'front' | 'side' | 'back', file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newPhotos = { ...photos, [position]: result };
        setPhotos(newPhotos);
        onPhotosUploaded(newPhotos);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent, position: 'front' | 'side' | 'back') => {
    e.preventDefault();
    setDragOver(position);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, position: 'front' | 'side' | 'back') => {
    e.preventDefault();
    setDragOver(null);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(position, files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, position: 'front' | 'side' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(position, file);
    }
  };

  const removePhoto = (position: 'front' | 'side' | 'back') => {
    const newPhotos = { ...photos };
    delete newPhotos[position];
    setPhotos(newPhotos);
    onPhotosUploaded(newPhotos);
    
    // Reset file input
    if (fileInputRefs[position].current) {
      fileInputRefs[position].current.value = '';
    }
  };

  const PhotoUploadArea = ({ position, label, icon }: { position: 'front' | 'side' | 'back'; label: string; icon: string }) => (
    <div className="space-y-2">
      <label className="block text-gray-400 text-sm font-medium">{label}</label>
      
      {photos[position] ? (
        <div className="relative group">
          <img 
            src={photos[position]} 
            alt={`${label} progress foto`}
            className="w-full aspect-[3/4] object-cover rounded-lg border border-[#3A3D4A]"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRefs[position].current?.click()}
                className="bg-[#E33412] text-white px-3 py-1 rounded text-sm hover:bg-[#b9260e] transition-colors"
              >
                Vervangen
              </button>
              <button
                onClick={() => removePhoto(position)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
              >
                Verwijderen
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragOver === position
              ? 'border-[#E33412] bg-[#E33412] bg-opacity-10'
              : 'border-[#3A3D4A] hover:border-[#E33412]'
          }`}
          onDragOver={(e) => handleDragOver(e, position)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, position)}
          onClick={() => fileInputRefs[position].current?.click()}
        >
          <div className="text-gray-400 mb-2 text-2xl">{icon}</div>
          <div className="text-gray-400 text-sm mb-2">
            {dragOver === position ? 'Laat foto los...' : 'Klik om foto te uploaden'}
          </div>
          <div className="text-gray-500 text-xs">
            of sleep foto hierheen
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRefs[position]}
        type="file"
        accept="image/*"
        onChange={(e) => handleInputChange(e, position)}
        className="hidden"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-[#2A2D3A] p-4 rounded-lg border-l-4 border-blue-400">
        <h4 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
          <span>💡</span>
          Tips voor goede progress foto's
        </h4>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Maak foto's op hetzelfde tijdstip van de dag</li>
          <li>• Gebruik dezelfde belichting en achtergrond</li>
          <li>• Sta in dezelfde houding voor elke foto</li>
          <li>• Draag minimale, goed passende kleding</li>
          <li>• Gebruik een timer of vraag iemand om te helpen</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PhotoUploadArea position="front" label="Voorkant" icon="📷" />
        <PhotoUploadArea position="side" label="Zijkant" icon="📷" />
        <PhotoUploadArea position="back" label="Achterkant" icon="📷" />
      </div>

      {Object.keys(photos).length > 0 && (
        <div className="flex gap-3 pt-4 border-t border-[#3A3D4A]">
          <button
            onClick={() => {
              setPhotos({});
              onPhotosUploaded({});
              Object.values(fileInputRefs).forEach(ref => {
                if (ref.current) ref.current.value = '';
              });
            }}
            className="bg-[#3A3D4A] text-white px-4 py-2 rounded-lg hover:bg-[#4A4D5A] transition-colors text-sm"
          >
            Alle foto's verwijderen
          </button>
        </div>
      )}
    </div>
  );
} 