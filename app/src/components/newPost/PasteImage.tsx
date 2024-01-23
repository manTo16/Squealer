import { useEffect, useRef, useState, ClipboardEvent } from 'react';
import { convertToBase64 } from '@root/src/utils';
import Image from 'react-bootstrap/Image';

interface PasteImageProps {
    onImagePaste: (image: string) => void;  
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;  
}

export default function PasteImageComponent({ onImagePaste, onChange }: PasteImageProps) {
    const divRef = useRef<HTMLDivElement | null>(null);
    const [image, setImage] = useState<string | null>(null); // Aggiungi uno stato per l'immagine

    const handlePaste = async (e: ClipboardEvent<HTMLDivElement>) => {
        if (image) {
            // Se un'immagine è già stata incollata, interrompi l'operazione
            e.preventDefault();
            // handleKeyDown(e as any);
            return;
        }

        const clipboardData = e.clipboardData;  
        const items = clipboardData.items || clipboardData.files || []; 
    
        for (let i = 0; i < items.length; i++) {            
            if (items[i].type.indexOf("image") !== -1) {    
                const blob = items[i].getAsFile();          
    
                if (blob) {
                    const base64Image = await convertToBase64(blob); 
                    onImagePaste(base64Image as string); 
                    onChange({ target: { value: base64Image } } as React.ChangeEvent<HTMLTextAreaElement>); 
                    setImage(base64Image as string); // Imposta l'immagine nello stato
                }
            }
        }
    };

    // const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    //     // Previene l'azione predefinita per impedire all'utente di digitare nel div
    //     e.preventDefault();
    // };

    return (
        <>
            <div
                className='bg-secondary rounded h-100 text-white mt-2'
                contentEditable
                suppressContentEditableWarning
                onPaste={handlePaste}
                // onKeyDown={handleKeyDown} // Aggiungi l'evento onKeyDown
                ref={divRef}
            />
            {/* {image ? 
                (   
                    <div className='d-flex align-items-center justify-content-center mt-3'>
                        <Image src={image} alt="Pasted content" />
                    </div>
                    
                ) : (
                    <h2>Incolla un'immagine (125 char)</h2>
                )
            } */}
        </>
    );
}