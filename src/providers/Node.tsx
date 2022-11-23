import {
  PropsWithChildren,
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useReducer,
  useMemo,
} from 'react'
import { gql } from '@apollo/client';
import { NodeType, DatasourceQueryStatus } from '../types'
import { useDatasourceContext } from './Datasource';
import { useAdminContext } from './Admin';

const FETCH_NODES = gql`
  query{
    indexedChains{
      id,
      currentBlock,
      headBlock,
      archive,
      enabled,
      startBlock,
      info{
        name,
        displayName,
        tokens,
        website,
        description,
        relayChain,
        parachainId,
        genesisHash			
      }
    }
  }
`

const TOGGLE_ENABLED = gql`
  mutation($chainId: String!, $apiKey: String!, $enabled: Boolean) {
    updateChain(chainId: $chainId, apiKey: $apiKey, enabled: $enabled){
      success
      message
    }
  }
`

type ContextProps = {
  nodes: NodeType[]
  status: DatasourceQueryStatus
  hasError: boolean
  errorMessage: string|undefined
  updateNode: (id: string, fields: {[key: string]: any}) => void,
}

type UseNodeType = NodeType & {
  toggleEnabled: () => void
}

const defaultContextProps: ContextProps = {
  nodes: [],
  status: 'INITIALISED',
  hasError: false,
  errorMessage: undefined,
  updateNode: (id, fields) => {},
}

const nodeReducer = (state: NodeType[], action: {type: string, data?: any}): NodeType[] => {
  switch (action.type) {
    case 'add':
      const nodes = [...action.data]
      nodes.sort((a: NodeType, b: NodeType) => a.id.toLowerCase() > b.id.toLowerCase() ? 1 : -1);
      return nodes
      break
    case 'update':
      const updatedNodes = state.map(node => {
        if(node.id === action.data.id){
          node = {
            ...node,
            ...action.data.fields
          }
        }
        return node
      }) 
      return updatedNodes
      break
    case 'reset':
      return []
      break
    default:
      return []
  }
}

const Context = createContext(defaultContextProps)

export const useNode = (id: string): UseNodeType|undefined => {
  
  const { nodes, updateNode } = useContext(Context)
  const { client } = useDatasourceContext()
  const { password } = useAdminContext()
  const [node, setNode] = useState<NodeType|undefined>()

  useEffect(() => {
    const node = nodes.find(node => node.id === id)
    !!node && setNode(node)
  }, [nodes])
  
  const toggleEnabled = useCallback(
    () => {
      if(!client || !password || !node) return      

      client
        .mutate({
          mutation: TOGGLE_ENABLED,
          variables: {
            chainId: node.id,
            apiKey: password,
            enabled: !node.enabled
          }
        })
        .then(({data}) => {
          if(data.updateChain.success === true){
            updateNode(node.id, {enabled: !node.enabled})
          }
        })
    }, [node, password, client]
  )

  return !!node
    ? {
      ...node,
      toggleEnabled
    }
    : undefined
}

export const useNodeContext = () => {
  const { nodes } = useContext<ContextProps>(Context)
  

  return useMemo(
    () => {

      const total = nodes.length
      const indexing = nodes?.filter(node => node.enabled === true).length
      const synced = nodes?.filter(node => node.enabled === true && node?.currentBlock >= node?.headBlock - 1).length
      const syncing = indexing - synced

      return {
        nodes,
        total, 
        indexing, 
        synced,
        syncing
      }
    }, [nodes]
  )
}

export const NodeProvider = ({children}: PropsWithChildren) => {

  const { status: datasourceStatus, client } = useDatasourceContext()
  const [nodes, dispatch] = useReducer(nodeReducer, [])
  const [status, setStatus] = useState<DatasourceQueryStatus>('INITIALISED')
  const [errorMessage, setErrorMessage] = useState<string|undefined>()

  // fetch all nodes
  // would love to make this a subscription based thingo
  const fetchNodes = useCallback(
    () => {
      setErrorMessage(undefined)
      setStatus('FETCHING')

      if(!client) return  
    
      client
        .query({ query: FETCH_NODES })
        .then(({networkStatus, data}) => {
          if(networkStatus !== 7){
            dispatch({type: 'reset'})
            setStatus('ERROR')
            setErrorMessage(`! Couldn't establish connection to endpoint !`)
          }else{
            
            dispatch({type: 'add', data: data.indexedChains})
            setStatus('OK')
            setErrorMessage(undefined)
          }
        })
        .catch(e => {
          dispatch({type: 'reset'})
          setStatus('ERROR')
          setErrorMessage(`! Couldn't establish connection to endpoint !`)
        })
    }, [client, dispatch, setStatus, setErrorMessage]
  )

  // we want to start fetching when a connection is established
  useEffect(() => {
    if(datasourceStatus === 'CONNECTED' && !!client){
      fetchNodes()
    }
  }, [datasourceStatus, client])

  const values = useMemo<ContextProps>(() => {
    return {
      nodes,
      updateNode: (id, fields) => dispatch({type: 'update', data: {id, fields}}),
      status, 
      hasError: !!errorMessage,
      errorMessage
    }
  }, [nodes, status, errorMessage])
  
  return <Context.Provider value={values}>{children}</Context.Provider>
}