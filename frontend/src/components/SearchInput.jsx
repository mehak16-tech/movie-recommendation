/**
 * Reusable search input with icon and clear button.
 *
 * IMPORTANT: This component is fully controlled when `value` prop is provided,
 * or uncontrolled (internal state) when only `initialValue` is provided.
 * Pass `value` + `onChange` for controlled usage; `initialValue` + `onSearch`
 * for the simpler uncontrolled usage.
 */
import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchInput({
  placeholder = 'Search…',
  onSearch,
  initialValue = '',
  // Controlled mode: pass `value` to fully control the input from outside
  value: controlledValue,
  size = 'md', // 'sm' | 'md' | 'lg'
  id,
  autoFocus = false,
  // If true, fires onSearch only on Enter or Clear (not every keystroke)
  submitOnEnter = false,
}) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(initialValue);
  const inputRef = useRef(null);

  // Sync internal state when initialValue changes (uncontrolled mode)
  useEffect(() => {
    if (!isControlled) {
      setInternalValue(initialValue);
    }
  }, [initialValue, isControlled]);

  const displayValue = isControlled ? controlledValue : internalValue;

  function handleChange(e) {
    const v = e.target.value;
    if (!isControlled) setInternalValue(v);
    if (!submitOnEnter) {
      onSearch?.(v);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') handleClear();
    if (e.key === 'Enter' && submitOnEnter) {
      onSearch?.(displayValue);
    }
  }

  function handleClear() {
    if (!isControlled) setInternalValue('');
    onSearch?.('');
    inputRef.current?.focus();
  }

  const sizeMap = {
    sm: { iconSize: 15, padding: '9px 36px 9px 38px', fontSize: '0.82rem' },
    md: { iconSize: 17, padding: '11px 40px 11px 44px', fontSize: '0.9rem' },
    lg: { iconSize: 20, padding: '15px 48px 15px 52px', fontSize: '1rem' },
  };

  const s = sizeMap[size] || sizeMap.md;

  return (
    <div className="search-input-wrap" style={{ width: '100%' }}>
      <Search
        size={s.iconSize}
        className="search-icon"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        id={id}
        type="search"
        className="search-input"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        autoComplete="off"
        spellCheck="false"
        aria-label={placeholder}
        style={{ padding: s.padding, fontSize: s.fontSize }}
      />
      {displayValue && (
        <button
          className="search-clear-btn"
          onClick={handleClear}
          aria-label="Clear search"
          type="button"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
