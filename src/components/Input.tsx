import { 
  useCallback, 
  useEffect, 
  useRef, 
  useState 
} from 'react'

type PropsLoginPanel = {
  value: string
  type?: string
  placeholder?: string
  onChange?: (val: string) => void
  onEnter?: () => void
  className?: string
  focus?: boolean
  maintainFocus?: boolean
  autoExpand?: boolean
}

export default ({value = '', placeholder, type = 'text', onChange = (value) => {}, onEnter = () => {}, className, focus, maintainFocus, autoExpand}: PropsLoginPanel)  => {
  
  const inputReference = useRef<any>(null);
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    updateWidth(value)
  }, [value])
  
  useEffect(() => {
    focus && inputReference?.current?.focus()
  }, [inputReference, focus]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if(e.key === 'Enter'){
        e.stopPropagation()
        e.preventDefault()
        onEnter()
      }
    }, [onEnter]
  )

  const updateWidth = (val: string) => {
    autoExpand && setWidth(val.length * 10)
  }
  
  return <div className={`input ${className}`} data-is-empty={!value || value == ''} onBlur={() => maintainFocus && inputReference?.current?.focus()}>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => handleKeyDown(e)}
      ref={inputReference}
      spellCheck='false'
      style={{width: width}}
    />
  </div>
}