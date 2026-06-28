import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { analysisApi } from '../services/api';
import { BaseInput } from './forms/BaseInput';
import { Spinner } from './ui/Spinner';

interface FileUploadProps {
    label?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    helperText?: string;
    onUploadComplete: (extractedText: string, fileName: string) => void;
}

export const FileUpload = ({
    label = 'Resume (PDF)',
    error,
    required,
    disabled = false,
    helperText = 'Upload a PDF file to extract text automatically',
    onUploadComplete
}: FileUploadProps) => {
    const { token } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadFile = async (file: File) => {
        if (!token) {
            setUploadError('You must be logged in to upload');
            return;
        }

        setUploading(true);
        setUploadError(null);

        try {
            const data = await analysisApi.uploadResume(file);
            onUploadComplete(data.extractedText, data.fileName);
            setSelectedFileName(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            setUploadError('Upload failed. Please try again.');
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

    const displayError = error || uploadError;

    return (
        <BaseInput
            label={label}
            error={displayError}
            required={required}
            disabled={disabled}
            helperText={helperText}
        >
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={uploading || disabled}
                    className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                />
                {uploading && (
                    <div className="mt-2">
                        <Spinner size="sm" />
                        <p className="text-sm text-gray-500 mt-1">Uploading and extracting text...</p>
                    </div>
                )}
                {selectedFileName && !uploading && (
                    <p className="text-sm text-green-600 mt-2">✓ Uploaded: {selectedFileName}</p>
                )}
            </div>
        </BaseInput>
    );
};