import { useEffect, useState } from "react"

type TProps = {
  active?: boolean
  onChange?: (isActive: boolean) => void
  disabled?: boolean
  title?: string
}

export default ({active = false, onChange = (isActive: boolean) => {}, disabled = false, title} : TProps) => {
  
  const [pending, setPending] = useState<boolean>(false)

  useEffect(() => {
    setPending(false)
  }, [active])

  const handleChange = (val: boolean) => {
    setPending(true)
    onChange(val)
  }

  return <span 
    className='toggle' 
    title={title}
    data-active={active}
    data-disabled={disabled}
    data-pending={pending}
    onClick={() => handleChange(!active)}
  /> 
}
