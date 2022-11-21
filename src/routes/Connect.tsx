import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useDatasourceContext } from '../providers'
import { Hamsa } from "../assets";
import {
  Hr,
  Input,
  Loader
} from '../components'

const Title = () => <div className='ascii-logo' style={{padding: '1rem 0'}}>
  <div>_&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
  <div>__&nbsp;&nbsp;__&nbsp;&nbsp;&nbsp;&nbsp;___|&nbsp;|__&nbsp;&nbsp;&nbsp;__&nbsp;_(_)_&nbsp;__&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;|___&nbsp;&nbsp;__&nbsp;&nbsp;|&nbsp;|__&nbsp;(_)___|&nbsp;|_&nbsp;___&nbsp;&nbsp;_&nbsp;__&nbsp;_&nbsp;&nbsp;&nbsp;_&nbsp;</div>
  <div>\&nbsp;\/&nbsp;/__&nbsp;/&nbsp;__|&nbsp;'_&nbsp;\&nbsp;/&nbsp;_`&nbsp;|&nbsp;|&nbsp;'_&nbsp;\&nbsp;&nbsp;&nbsp;|&nbsp;__\&nbsp;\/&nbsp;/&nbsp;&nbsp;|&nbsp;'_&nbsp;\|&nbsp;/&nbsp;__|&nbsp;__/&nbsp;_&nbsp;\|&nbsp;'__|&nbsp;|&nbsp;|&nbsp;|</div>
  <div>&nbsp;{`>`}&nbsp;&nbsp;{`<`}___|&nbsp;(__|&nbsp;|&nbsp;|&nbsp;|&nbsp;(_|&nbsp;|&nbsp;|&nbsp;|&nbsp;|&nbsp;|&nbsp;&nbsp;|&nbsp;|_&nbsp;{`>`}&nbsp;&nbsp;{`<`}&nbsp;&nbsp;&nbsp;|&nbsp;|&nbsp;|&nbsp;|&nbsp;\__&nbsp;\&nbsp;||&nbsp;(_)&nbsp;|&nbsp;|&nbsp;&nbsp;|&nbsp;|_|&nbsp;|</div>
  <div>/_/\_\&nbsp;&nbsp;&nbsp;\___|_|&nbsp;|_|\__,_|_|_|&nbsp;|_|&nbsp;&nbsp;&nbsp;\__/_/\_\&nbsp;&nbsp;|_|&nbsp;|_|_|___/\__\___/|_|&nbsp;&nbsp;&nbsp;\__,&nbsp;|</div>
  <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{display: 'inline-flex', alignItems: 'center', transform: 'translateY(3px)'}}><span>POWERED_BY_TALISMAN_</span><Hamsa style={{height: '14px'}}/></span>|___/&nbsp;</div>
</div>

export default () => {
  const { url, setUrl, isValidUrl, connect, status, errorMessage } = useDatasourceContext()
  let navigate = useNavigate();

  useEffect(() => {
    if(status === 'CONNECTED') navigate('/')
  }, [status]);

  return <div className='connect-route'>
      <p>
        Initialising Talisman TX History Controller 9000 v0.1.1<br/>
        Copyright (c) 2099 Talisman Foundation {`<talisman.xyz>`}
      </p>
      <Hr length={64}/>
      <Title/>
      <Hr length={64}/>
      <p>Enter a URL to establish a connection to your indexooor</p>
      <Hr length={64}/>
      <div className='connect-form'>
        <label>{`$ / >`}</label>
        <span>
          <Input
            value={url} 
            onChange={setUrl}
            onEnter={() => connect(url)}
            placeholder='// enter a url'
            focus
            maintainFocus
            autoExpand
          />
        </span>
        <button
          disabled={!isValidUrl}
          onClick={() => status !== 'PROCESSING' && connect(url)}
          >
          {status === 'PROCESSING' ? <>Connecting <Loader/></> : 'Connect'}
        </button>
      </div>
      <p className='connect-error-message'>{errorMessage}</p>
  </div>
}