import { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const API_BASE = 'http://localhost:5216/api';

interface FileUploadProps {
    onUploadComplete: (extractedText: string, fileName: string) => void;
}

export const FileUpload = ({ onUploadComplete }: FileUploadProps) => {
    const { token } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            return;
        }

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
            setFile(null);
            const fileInput = document.getElementById('file-input') as HTMLInputElement;

            if (fileInput) {
                fileInput.value = '';
            }
        } catch (err) {
            setError('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input 
                id="file-input"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {file && (
                <div>
                    <p className="text-sm text-gray-600 mb-2">Selected: {file.name}</p>
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {uploading ? 'Uploading...' : 'Upload PDF'}        
                    </button>
                </div>
            )}
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>
    );
    
};