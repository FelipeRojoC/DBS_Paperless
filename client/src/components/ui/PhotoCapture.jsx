import { useState } from 'react';
import { Camera, Trash2, Image as ImageIcon } from 'lucide-react';

export default function PhotoCapture({ onCapture, photos = [], maxPhotos = 5 }) {

    const handleCapture = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // In a real app we'd upload this to get a URL, 
                // but for now we store the base64 preview
                onCapture([...photos, {
                    id: Date.now(),
                    url: reader.result,
                    name: file.name
                }]);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = (id) => {
        onCapture(photos.filter(p => p.id !== id));
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Photo Previews */}
                {photos.map((photo) => (
                    <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                        <img src={photo.url} alt="Evidence" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                onClick={() => removePhoto(photo.id)}
                                className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add Button */}
                {photos.length < maxPhotos && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-blue-500">
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={handleCapture}
                        />
                        <Camera className="w-8 h-8 mb-2" />
                        <span className="text-xs font-bold">Tomar Foto</span>
                    </label>
                )}
            </div>

            <div className="flex justify-between items-center text-xs text-gray-400 px-1">
                <span>{photos.length} / {maxPhotos} fotos adjuntas</span>
                {photos.length === 0 && <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Se recomienda mín. 1 foto</span>}
            </div>
        </div>
    );
}
