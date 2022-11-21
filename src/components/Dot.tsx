type TProps = {
  active?: boolean
  blinking?: boolean
  outline?: boolean
  half?: boolean
}

export default ({blinking = false, outline = false, half=false} : TProps) => <span className='dot' data-blinking={blinking} data-type={outline ? 'outline' : half ? 'half' : 'solid'}/>
