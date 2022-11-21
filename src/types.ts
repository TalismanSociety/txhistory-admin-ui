// node general information
type NodeInfo = {
  name: string
  displayName: string
  tokens: string[]
  website: string
  description: string
  relayChain: string
  parachainId: string
  genesisHash: string
}

// node archive status information
export type NodeType = {
  id: string
  currentBlock: number
  headBlock: number
  archive: string
  enabled: boolean
  startBlock: number
  info: NodeInfo,
  setEnabled: (enabled: boolean) => void
}

// the status of a GQL connection to the squid
export type DatasourceConnectionStatus = 'DISCONNECTED'|'PROCESSING'|'CONNECTED'|'ERROR'

// the status of fetching node information from the squid
export type DatasourceQueryStatus = 'INITIALISED'|'FETCHING'|'OK'|'ERROR'

// the user authentication status
export type UserAuthStatus = 'LOGGEDOUT'|'PROCESSING'|'LOGGEDIN'|'ERROR'