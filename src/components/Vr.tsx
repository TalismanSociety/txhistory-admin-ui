type TProps = {
  large?: boolean
  small?: boolean
}

export default ({large, small}: TProps) => <span className='vr' data-size={!!large ? 'large' : !!small ? 'small' : null}>|</span>