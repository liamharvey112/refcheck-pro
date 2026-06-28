import { forwardRef, useId } from 'react';
import { BaseInput, type BaseInputProps } from '../forms/BaseInput';

interface InputProps extends Omit<BaseInputProps, 'children'> {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'number';
    name?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ value, onChange, type = 'text', id, ...props }, ref) => {
        const generatedId = useId();
        const fieldId = id ?? props.name ?? generatedId;

        return (
            <BaseInput {...props}>
                <input
                    ref={ref}
                    id={fieldId}
                    type={type}
                    name={props.name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={props.placeholder}
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

Input.displayName = 'Input';