type HrProps = {
  length?: number
}
export default ({length = 10} : HrProps) => <p className='hr'>{Array(length).fill('-').join('')}</p>
