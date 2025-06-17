interface InputFieldProps {
    placeholder?: string
    onChange: (id: string, value: string) => void
    id: string
    value?: string
    disableAutofill?: boolean
}

export default function InputField({ placeholder, onChange, id, value, disableAutofill = false }: InputFieldProps) {
    return (
        <div className={'input-field'}>
            <input
                id={id}
                type="text"
                placeholder={placeholder ?? ''}
                defaultValue={value}
                onChange={(event) => onChange(id, event.target.value)}
                autoComplete={disableAutofill ? "off" : undefined}
            />
        </div>
    )
}
