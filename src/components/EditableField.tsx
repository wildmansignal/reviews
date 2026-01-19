import React, { useState, useEffect, useRef } from 'react';
import './EditableField.css';

interface EditableFieldProps {
    value: string | number;
    onChange: (newValue: string) => void;
    className?: string; // To pass specific styling (font weight, color)
    type?: 'text' | 'number';
    prefix?: string;
    suffix?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({ value, onChange, className = '', type = 'text', prefix = '', suffix = '' }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value.toString());
    const inputRef = useRef<HTMLInputElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);
    const [width, setWidth] = useState<number | undefined>(undefined);

    useEffect(() => {
        setInputValue(value.toString());
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    // Update width based on content to make input fit perfectly
    useEffect(() => {
        if (spanRef.current) {
            setWidth(spanRef.current.offsetWidth);
        }
    }, [value, isEditing]);

    const handleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        onChange(inputValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleBlur();
        }
    };

    const displayValue = `${prefix}${value}${suffix}`;

    return (
        <span className={`editable-field-wrapper ${className}`} onClick={!isEditing ? handleClick : undefined}>
            {isEditing ? (
                <input
                    ref={inputRef}
                    type={type}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className="editable-input"
                    style={{ width: width ? width + 10 : 'auto' }} // Add a little buffer
                />
            ) : (
                <span ref={spanRef} className="editable-text" title="Click to edit">
                    {displayValue}
                </span>
            )}
        </span>
    );
};

export default EditableField;
