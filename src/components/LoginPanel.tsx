import { PropsWithChildren, useEffect, useState } from 'react'
import { useAdminContext } from '../providers'
import Input from './Input'
import Loader from './Loader'
import {
  Surfer,
  Shaka,
  Error
} from '../assets'

type PropsLoginPanel = {
  onClose: () => void
}

type PropsRow =  PropsWithChildren & {
  label?: string
  content?: any
  className?: string
}

const errorMessages = [
  'Bummer dude, wipeout!',
  'Not this time brah!',
  'Grarly wipeout bro!',
  'Closeout dude!',
  'Shoulda stayed in bed!'
]

const successMessages = [
  'Kowabunga dude!',
  'Totally tubular!',
  'Radical!',
  'Pitted, so pitted!',
  'In the green room!'
]

const connectingTimeoutMs = 1500

const Row = ({label, children, className}: PropsRow) => {
  return <div className={`login-panel-row ${className} screen-blur`}>
    <span>$ {label} / &gt;</span>
    <span>{children}</span>
  </div>
}

export default ({onClose = () => {}}: PropsLoginPanel)  => {

  const { password, setPassword, login, status } = useAdminContext()
  const [open, setOpen] = useState<boolean>(false)
  const [additionalRows, setAdditionalRows] = useState<any[]>([])
  const [showInputRow, setShowInputRow] = useState<boolean>(false)

  // se open on mount to trigger the animation
  useEffect(() => {
    setAdditionalRows([])
    setOpen(true)
  }, [])

  // add new rows on status change
  useEffect(() => {
    if(!showInputRow) return
    if(status === 'ERROR'){
      setAdditionalRows([
        ...additionalRows,
        <Row><Error/> {errorMessages[Math.floor(Math.random() * errorMessages.length)]}</Row>
      ])
    }else if(status === 'LOGGEDIN'){
      setShowInputRow(false)
      setAdditionalRows([
        ...additionalRows,
        <Row label={`Creds (↳ to continue)`}>•••••</Row>,
        <Row><Shaka/> {successMessages[Math.floor(Math.random() * successMessages.length)]}</Row>
      ])
      setTimeout(handleClose, 1000)
    }
  }, [status])

  // trigger the display of the input row after 1500ms
  useEffect(() => {
    setTimeout(() => {
      setShowInputRow(true)
    }, connectingTimeoutMs)
  }, []);

  // handle closing and unmounting of the component (from parent)
  const handleClose = () => {
    setOpen(false)
    setTimeout(onClose, 1000)
  }

  return <div className="login-panel" data-open={open}>
    <span className="close" onClick={handleClose}>[close]</span>
    <Row>
      <Loader doneAfter={connectingTimeoutMs} icon={<Surfer/>}/> 
      <span>{!!showInputRow ? 'Surfing the internet' : 'Connecting to the mainframe ...'}</span>
    </Row>
    {additionalRows}
    {!!showInputRow && <Row label={`Creds (↳ to continue)`}>
      {status === 'PROCESSING' || status === 'LOGGEDIN'
        ? <Loader doneAfter={status === 'LOGGEDIN' ? 0 : undefined}/>
        : <Input
            type='password'
            value={password||''} 
            onChange={setPassword}
            onEnter={login}
            placeholder='// enter your password'
            focus
          />
      }
      </Row>
    }
  </div>
}