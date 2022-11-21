import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react'
import { gql } from '@apollo/client';
import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { useNavigate } from 'react-router-dom'
import { DatasourceConnectionStatus } from '../types'

type ContextProps = {
  url: string
  setUrl: (url: string) => void
  isValidUrl: boolean
  status: DatasourceConnectionStatus
  hasError: boolean
  errorMessage: string|undefined
  connect: (url: string) => void
  disconnect: () => void
  client: ApolloClient<NormalizedCacheObject>|undefined
}

const defaultContextProps: ContextProps = {
  url: '',
  setUrl: (url) => {},
  isValidUrl: false,
  status: 'DISCONNECTED',
  hasError: false,
  errorMessage: undefined,
  connect: (url) => {},
  disconnect: () => {},
  client: undefined
}

type ProviderProps = PropsWithChildren & {
  redirectOnConnect: string
  redirectOnDisconnect: string
}

const Context = createContext(defaultContextProps)

export const useDatasourceContext = () => useContext<ContextProps>(Context)

export const DatasourceProvider = (props: ProviderProps) => {

  const urlIsHardcoded = useMemo(() => !!process.env.REACT_APP_ENDPOINT_URL, [process.env.REACT_APP_ENDPOINT_URL])
  const [url, setUrl] = useState<string>(process.env.REACT_APP_ENDPOINT_URL||'')
  const [redirectOnConnect] = useState(props.redirectOnConnect)
  const [redirectOnDisconnect] = useState(props.redirectOnDisconnect)
  const [status, setStatus] = useState<DatasourceConnectionStatus>('DISCONNECTED')
  const [errorMessage, setErrorMessage] = useState<string|undefined>()
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>|undefined>()
  const navigate = useNavigate();

  const attemptConnection = (url: string) => {
    setErrorMessage(undefined)
    setStatus('PROCESSING')

    const client = new ApolloClient({
      uri: url,
      cache: new InMemoryCache(),
    })

    client
      .query({
        query: gql`
          query VerifyApiKey($apiKey: String!) {
            verifyApiKey(apiKey: $apiKey)
          }
        `,
        variables: {
          apiKey: 'xxx'
        }
      })
      .then(({networkStatus, loading, data}) => {
        if(networkStatus !== 7){
          setStatus('ERROR')
          setErrorMessage(`Couldn't establish endpoint`)
          setClient(undefined)
          navigate(redirectOnDisconnect)
        }else{
          setStatus('CONNECTED')
          setErrorMessage(undefined)
          setClient(client)
          navigate(redirectOnConnect)
        }
      })
      .catch(e => {
        setStatus('ERROR')
        setErrorMessage(`! Couldn't establish connection to endpoint !`)
        setClient(undefined)
        navigate(redirectOnDisconnect)
      })
  }

  const disconnect = () => {
    setStatus('DISCONNECTED')
    setErrorMessage(undefined)
    setClient(undefined)
    navigate(redirectOnDisconnect)
  }

  useEffect(() => {
    setErrorMessage(undefined)
  }, [url])

  // on init, check the configured URL endpoint
  useEffect(() => {
    // no endpoint; redirect to disconnect page
    if(status === 'CONNECTED' && !url){
      navigate(redirectOnDisconnect)
    }
    // we have endpoint but we're  not connected; then attempt to connect
    else if(!!url && status !== 'CONNECTED'){
      attemptConnection(url)
    }
  }, [urlIsHardcoded])

  
  return <Context.Provider 
    value={{
      url,
      setUrl,
      isValidUrl: /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url),
      status, 
      hasError: !!errorMessage,
      errorMessage,
      connect: attemptConnection,
      disconnect,
      client
    }}
    >
      {props.children}
  </Context.Provider>
}