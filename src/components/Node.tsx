import { useAdminContext, useNode } from '../providers'
import { Dot } from '../components'
import Toggle from './Toggle'
import ChainLogo from './ChainLogo'

export default ({id}: any) => {
  const node = useNode(id)
  const { status } = useAdminContext()
  
  return <article className='node node-card' data-enabled={node?.enabled}>
    <header>
      <ChainLogo id={id}/>
      <h1 title={`${node?.info?.displayName||node?.id} | ${node?.archive}`}>{node?.info?.displayName||node?.id}<span>{node?.archive}</span></h1>
    </header>

    <div className='node-card-body'>
      <div><span>Network:</span> {node?.info?.relayChain||'-'}</div>
      <div><span>Start Block:</span> {node?.startBlock}</div>
      <div><span>Head Block:</span> {node?.headBlock||'-'}</div>
      <div><span>Synced Block:</span> {node?.currentBlock||0}</div>
      <div><span>Blocks Behind:</span> {(node?.headBlock||0) - (node?.currentBlock||0)}</div>
    </div>

    <footer>
      <span className='node-enabled'>
        {!node?.enabled
          ? <><Dot outline/> Not Indexing</>
          : node?.currentBlock < node?.headBlock - 1
            ? <><Dot half/> Syncing</>
            : <><Dot/> Fully Synced</>
        }
      </span>
      <span>
        <Toggle active={node?.enabled} disabled={status !== 'LOGGEDIN'} onChange={node?.toggleEnabled}/>
      </span>
      
    </footer>
  </article>
}