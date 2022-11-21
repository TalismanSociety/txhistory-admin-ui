import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react'

type ContextProps = {
  isDarkMode: boolean
  setIsDarkMode: (dark: boolean) => void
}

const defaultContextProps: ContextProps = {
  isDarkMode: true,
  setIsDarkMode: (dark) => {},
}

const Context = createContext<ContextProps>(defaultContextProps)

export const useAppContext = () => useContext<ContextProps>(Context)

export const AppProvider = ({ children }: PropsWithChildren<{}>) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true)

  useEffect(() => {
    document.getElementsByTagName('html')[0].dataset.mode = !!isDarkMode ? 'dark' : 'light'
  }, [isDarkMode])

  return <Context.Provider 
    value={{
      isDarkMode,
      setIsDarkMode 
    }}>
      {children}
  </Context.Provider>
}