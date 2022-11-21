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
  Moon
} from '../assets'


export default () => {
  const { isDarkMode, setIsDarkMode } = useAppContext()
  const { nodes } = useNodeContext()
  const { logout, status } = useAdminContext()
  const { url, disconnect } = useDatasourceContext()
  const [panelOpen, setPanelOpen] = useState<boolean>(false)

  const orderedNodes = [...nodes]
  orderedNodes.sort((a, b) => a.id.toLowerCase() > b.id.toLowerCase() ? 1 : -1);

  return <div className='node-index-route'>
    <Talisman/>
    <h1 style={{marginBottom: 0}}>X-Chain TX History</h1>
    <span className='node-status'>CONNECTED: {url} <button className='disconnect-button' onClick={() => {logout(); disconnect()}}>disconnect</button></span>
    <Hr length={64}/>
    <div className={'info'}>
      <span>Nodes Available: {nodes.length||<Loader/>}</span>
      <Vr/>
      <span>Indexing: {nodes.filter(node => node.enabled === true).length||<Loader/>}</span>
      <Vr/>
      <span>
        {
          status === 'LOGGEDIN' 
            ? <>Admin&nbsp;<button className='logout-button' onClick={logout}>logout</button></>
            : <>Anon&nbsp;<button className='login-button' onClick={() => setPanelOpen(true)}>login</button></>
        }
      </span>
      <Vr/>
      <span><Sun/>&nbsp;<Toggle active={!!isDarkMode} onChange={setIsDarkMode}/>&nbsp;<Moon/></span>
    </div>
    <Hr length={64}/>
    <br />
    <section className='node-grid'>
      {nodes.map(({id}) => <Node id={id} key={id}/> )}
    </section>
    {panelOpen && <LoginPanel onClose={() => setPanelOpen(false)}/>}
  </div>
}