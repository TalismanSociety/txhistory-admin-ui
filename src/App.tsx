import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DatasourceProvider, NodeProvider, AdminProvider, AppProvider } from './providers'
import { Stacked, Centered } from './layout'
import { NodeIndex, Connect } from './routes'
import './style/base.scss'
import './style/components.scss'
import './style/routes.scss'
import './style/animation.scss'
import './style/blur.scss'

export default () => {
  return <BrowserRouter>
    <DatasourceProvider 
      redirectOnConnect={'/'} 
      redirectOnDisconnect={'/connect'}
      >
      <AdminProvider>
        <NodeProvider>
          <AppProvider>
            <Routes>
              <Route path="/" element={<Stacked><NodeIndex /></Stacked> }/>
              <Route path="/connect" element={<Centered><Connect /></Centered>} />
            </Routes>
          </AppProvider>
        </NodeProvider>
      </AdminProvider>
    </DatasourceProvider>
  </BrowserRouter>
}