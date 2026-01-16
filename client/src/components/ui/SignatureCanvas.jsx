import { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import { Trash2, CheckCircle } from 'lucide-react';

export default function SignatureCanvas({ onSave, savedSignature, disabled = false, label = "Firma" }) {
    const sigCanvas = useRef({});
    const [isEmpty, setIsEmpty] = useState(true);

    const clear = () => {
        sigCanvas.current.clear();
        setIsEmpty(true);
        onSave(null); // Clear parent state
    };

    const handleSave = () => {
        // Force save attempt even if internal state thinks it's empty (ref consistency check)
        try {
            const canvas = sigCanvas.current.getTrimmedCanvas();
            const signatureData = canvas.toDataURL('image/png');

            // Only save if we have actual data, but trust the canvas more than isEmpty()
            if (signatureData) {
                onSave(signatureData);
            }
        } catch (e) {
            console.error("Signature save error:", e);
        }
    };

    // If already signed & locked/saved, show the image instead of canvas
    if (savedSignature && disabled) {
        return (
            <div className="border-2 border-green-200 bg-green-50 rounded-xl p-4 flex flex-col items-center">
                <img src={savedSignature} alt="Firma Guardada" className="h-24 mix-blend-multiply" />
                <div className="flex items-center gap-2 text-green-700 font-bold text-sm mt-2">
                    <CheckCircle className="w-4 h-4" />
                    Firma Registrada Correctamente
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>

            <div className={`border-2 rounded-xl overflow-hidden bg-white touch-none ${disabled ? 'opacity-50 pointer-events-none border-gray-200' : 'border-gray-300 hover:border-blue-400'}`}>
                <SignaturePad
                    ref={sigCanvas}
                    canvasProps={{
                        className: 'w-full h-40 bg-white cursor-crosshair',
                    }}
                    onBegin={() => setIsEmpty(false)}
                // Removing onEnd automagic to prevent race conditions or confusing UX
                // onEnd={handleSave} 
                />
            </div>

            <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-400">
                    {disabled ? 'Firma bloqueada' : 'Dibuje su firma y presione Confirmar'}
                </p>

                <div className="flex gap-2">
                    {!disabled && !isEmpty && (
                        <button
                            onClick={clear}
                            className="text-red-500 text-xs font-bold flex items-center gap-1 hover:text-red-700 px-2"
                        >
                            <Trash2 className="w-3 h-3" /> Borrar
                        </button>
                    )}

                    {!disabled && (
                        <button
                            onClick={handleSave}
                            className="bg-blue-600 text-white text-xs font-bold py-1 px-3 rounded-lg hover:bg-blue-700 shadow-sm"
                        >
                            Confirmar Firma
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
