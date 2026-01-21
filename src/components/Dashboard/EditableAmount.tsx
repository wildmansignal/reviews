import React, { useState, useRef, useEffect } from 'react';

interface EditableAmountProps {
    value: string;
    onChange: (val: string) => void;
    className?: string;
    style?: React.CSSProperties;
    prefix?: string;
}

const EditableAmount: React.FC<EditableAmountProps> = ({ value, onChange, className, style, prefix = '' }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    const handleBlur = () => {
        setIsEditing(false);
        if (tempValue.trim() !== '') {
            onChange(tempValue);
        } else {
            setTempValue(value);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleBlur();
        }
    };

    if (isEditing) {
        return (
            <div className={className} style={{ ...style, display: 'flex', alignItems: 'center' }}>
                {prefix && <span style={{ marginRight: 2 }}>{prefix}</span>}
                <input
                    ref={inputRef}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    style={{
                        fontSize: 'inherit',
                        fontFamily: 'inherit',
                        fontWeight: 'inherit',
                        color: 'inherit',
                        background: 'transparent',
                        border: '1px solid #ccc',
                        borderRadius: 4,
                        padding: '0 4px',
                        width: '100px', // simplified width
                        ...style
                    }}
                />
            </div>
        );
    }

    return (
        <div
            className={className}
            style={{ ...style, cursor: 'pointer' }}
            onClick={() => setIsEditing(true)}
            title="Click to edit"
        >
            {prefix}{value}
        </div>
    );
};

export default EditableAmount;
