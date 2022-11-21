import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react'
import { gql } from '@apollo/client';
import { UserAuthStatus } from '../types'
import { useDatasourceContext } from './Datasource';

type ContextProps = {
  password: string
  setPassword: (password: string) => void
  status: UserAuthStatus
  hasError: boolean
  errorMessage: string|undefined
  login: () => void
  logout: () => void
}

const defaultContextProps: ContextProps = {
  password: '',
  setPassword: (pass) => {},
  status: 'LOGGEDOUT',
  hasError: false,
  errorMessage: undefined,
  login: () => {},
  logout: () => {},
}

const Context = createContext(defaultContextProps)

export const useAdminContext = () => useContext<ContextProps>(Context)

export const AdminProvider = (props: PropsWithChildren) => {

  const { status: datasourceStatus, client } = useDatasourceContext()
  const [password, setPassword] = useState<string>('')
  const [status, setStatus] = useState<UserAuthStatus>('LOGGEDOUT')
  const [errorMessage, setErrorMessage] = useState<string|undefined>()

  const login = useCallback(
    () => {
      setErrorMessage(undefined)
      setStatus('PROCESSING')

      const fail = () => {
        setPassword('')
        setStatus('ERROR')
        setErrorMessage(`Incorrect password`)
      }

      if(!client || !password || password === ''){
        fail()
        return
      }

      client
        .query({
          query: gql`
            query VerifyApiKey($apiKey: String!) {
              verifyApiKey(apiKey: $apiKey)
            }
          `,
          variables: {
            apiKey: password
          }
        })
        .then(({networkStatus, data}: any) => {
          console.log(data.verifyApiKey)
          if(networkStatus !== 7){
            fail()
          }else{
            if(data.verifyApiKey === true){
              setStatus('LOGGEDIN')
              setPassword(password)
              setErrorMessage(undefined)
            }else{
              fail()
            }
          }
        })
        .catch(fail)
    }, [client, password]
  )
  

  const logout = useCallback(
    () => {
      setPassword('')
      setStatus('LOGGEDOUT')
      setErrorMessage(undefined)
    }, []
  )
  
  
  return <Context.Provider 
    value={{
      password,
      setPassword,
      status, 
      hasError: !!errorMessage,
      errorMessage,
      login,
      logout,
    }}
    >
      {props.children}
  </Context.Provider>
}