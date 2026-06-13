import { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = 'http://localhost:5216/api';

interface FileUploadProps {
    onUploadComplete: (extractedText: string, fileName: string) => void;
}

export const FileUpload = ({ onUploadComplete }: FileUploadProps) => {
    const { token } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadFile = async (file: File) => {
        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_BASE}/Upload/resume`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            onUploadComplete(response.data.extractedText, response.data.fileName);
            setSelectedFileName(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            setError('Upload failed. Please try again.');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFileName(file.name);
            await uploadFile(file);
        }
    };

    return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={uploading}
                className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
            {uploading && (
                <div className="mt-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-1">Uploading and extracting text...</p>
                </div>
            )}
            {selectedFileName && !uploading && (
                <p className="text-sm text-green-600 mt-2">
                    ✓ Uploaded: {selectedFileName}
                </p>
            )}
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>
    );
};