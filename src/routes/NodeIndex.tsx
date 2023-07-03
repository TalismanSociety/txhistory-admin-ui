import { useState } from 'react'
import { 
  useNodeContext, 
  useAdminContext, 
  useAppContext,
  useDatasourceContext 
} from '../providers'
import { 
  Hr, 
  Vr,
  Node,
  Loader,
  Talisman,
  LoginPanel,
  Toggle,
} from '../components'
import {
  Sun,
  Moon,
  Network,
  Visible,
  Invisible
} from '../assets'


export default () => {
  const { isDarkMode, setIsDarkMode, showInactive, setShowInactive } = useAppContext()
  const { nodes, total, indexing, synced, syncing } = useNodeContext()
  const { logout, status } = useAdminContext()
  const { url, disconnect } = useDatasourceContext()
  const [panelOpen, setPanelOpen] = useState<boolean>(false)

  const orderedNodes = showInactive ? [...nodes] : [...nodes].filter(node => node.enabled)
  orderedNodes.sort((a, b) => a.id.toLowerCase() > b.id.toLowerCase() ? 1 : -1);

  return <div className='node-index-route'>
    <Talisman/>
    <h1 style={{marginBottom: 0}}>X-Chain TX History</h1>
    
    <span className='node-status'>
      <a className='url' href={url} target='_blank'>{url}</a>
      <div className='control'>
        {
          status === 'LOGGEDIN' 
            ? <button className='logout-button' onClick={logout}>logout</button>
            : <button className='login-button' onClick={() => setPanelOpen(true)}>admin</button>
        }
        <button className='grafana-button' onClick={() => {window.open(`https://grafana.infra.gc.subsquid.io/d/Jkgu9rqnz/squid?orgId=1&var-squid=${url.split('/')[3]}-${url.split('/')[5]}`, '_blank')}}>grafana</button>
        <button className='disconnect-button' onClick={() => {logout(); disconnect()}}>disconnect</button>
        <span className='mode'>
          <Sun/>
          <Toggle active={!!isDarkMode} onChange={setIsDarkMode}/>
          <Moon/>
        </span>
        <span className='show-hide'>
          <Invisible/>
          <Toggle active={!!showInactive} onChange={setShowInactive}/>
          <Visible/>
        </span>
      </div>
    </span>
    <Hr length={68}/>
    <div className='info'>
      <Network/>
      <Vr large/>
      <span>Available:&nbsp;{total||<Loader/>}</span>
      <Vr large/>
      <span>Indexing:&nbsp;{indexing||<Loader/>}</span>
      <Vr large/>
      <span>Synced:&nbsp;{synced||<Loader/>}</span>
      <Vr large/>
      <span>Syncing:&nbsp;{syncing||<Loader/>}</span>
    </div>
    <Hr length={68}/>
    <br />
    <section className='node-grid'>
      {orderedNodes.map(({id}) => <Node id={id} key={id}/> )}
    </section>
    {panelOpen && <LoginPanel onClose={() => setPanelOpen(false)}/>}
  </div>
}
