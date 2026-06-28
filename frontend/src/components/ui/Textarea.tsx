import { forwardRef, useId } from 'react';
import { BaseInput, type BaseInputProps } from '../forms/BaseInput';

interface TextareaProps extends Omit<BaseInputProps, 'children'> {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    name?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ id, value, onChange, placeholder, rows = 4, name, ...props }, ref) => {
        const generatedId = useId();
        const fieldId = id ?? name ?? generatedId;

        return (
            <BaseInput {...props}>
                <textarea
                    ref={ref}
                    id={fieldId}
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={rows}
                    disabled={props.disabled}
                    className={`
                        w-full px-3 py-2 border rounded-lg shadow-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        ${props.error ? 'border-red-500' : 'border-gray-300'}
                        ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                    `}
                />
            </BaseInput>
        );
    }
);

Textarea.displayName = 'Textarea';