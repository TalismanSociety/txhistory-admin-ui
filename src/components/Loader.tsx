import { 
  ReactNode, 
  useEffect, 
  useState 
} from "react"
import { Shaka } from "../assets";

type LoaderProps = {
  doneAfter?: number
  icon?: ReactNode
}

export default ({doneAfter, icon}: LoaderProps) => {

  const [isDone, setIsDone] = useState<boolean>(false)

  useEffect(() => {
    if(!doneAfter) return
    setTimeout(() => setIsDone(true), doneAfter)
  }, [doneAfter])

  return <span className={`loader ${!!isDone ? 'complete' : 'loading'}`}>{!!isDone && (icon||<Shaka/>)}</span>
}