import { useCallback, useRef, useState } from "react"
import question from '../assets/question.svg'

type TProps = {
  id: string
}

const basePath = `https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/`
const suffixes = [
  `polkadot`, 
  `kusama`, 
  `testnet`
];

export default ({id}: TProps) => {

  const imgRef = useRef<HTMLImageElement>(null);
  
  const [index, setIndex] = useState<number>(0)
  const [source, setSource] = useState<string|null>(`${basePath}${id}.svg`)

  const loadNext = useCallback(
    () => {
      if(index >= suffixes.length) {
        setSource(null)
        return
      }
      setSource(`${basePath}${id}-${suffixes[index]}.svg`)
      setIndex(index+1)
    }
    , [index, suffixes, setSource]
  )
  
  return <img 
    className="chainlogo" 
    src={source||question} 
    ref={imgRef}
    onError={loadNext} 
    data-unknown={!source}
  />
}