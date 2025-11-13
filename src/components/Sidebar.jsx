import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CNavGroup,
  CNavItem,
  CSidebarFooter,
} from '@coreui/react'
import { 
  HomeRounded,
  InsertChartOutlinedRounded,
  BoltRounded,
  MultilineChartRounded,
  CloudUploadRounded,
  GroupsOutlined,
  DescriptionOutlined,
  LogoutOutlined,
  PersonOutlined,
  PaymentOutlined,
  Email,
  SettingsOutlined,
  ManageAccountsOutlined
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext.jsx'
import ProfilePicture from './ProfilePicture.jsx'

export const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAdmin, userProfile, currentUser, logout } = useAuth()

  const handleNavigation = (path) => (e) => {
    e.preventDefault()
    navigate(path)
  }

  const handleLogout = async (e) => {
    e.preventDefault()
    try {
      await logout()
      navigate('/signin')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const displayName = userProfile?.fullName || currentUser?.displayName || 'User'

  return (
    <CSidebar className="border-end" unfoldable>
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand>
          <img 
            src="/Primary Logo grey.svg"
            className="sidebar-brand-full" 
            alt="Logo Full" 
            style={{ height: 32 }} 
          />
          <img 
            src="/Submark.logo.orange.svg"
            className="sidebar-brand-narrow" 
            alt="Logo" 
            style={{ width: 32, height: 32 }} 
          />
        </CSidebarBrand>
      </CSidebarHeader>
      <CSidebarNav>
        <CNavItem 
          href="/" 
          active={location.pathname === '/'}
          onClick={handleNavigation('/')}
        >
          <HomeRounded className="nav-icon" sx={{ fontSize: 20 }} /> Home
        </CNavItem>
        
        <CNavGroup 
          toggler={
            <>
              <GroupsOutlined className="nav-icon" sx={{ fontSize: 20 }} /> Clients
            </>
          }
        >
          <CNavItem 
            href="/clients"
            active={location.pathname === '/clients'}
            onClick={handleNavigation('/clients')}
          >
            <GroupsOutlined className="nav-icon" sx={{ fontSize: 20 }} /> All clients
          </CNavItem>
          <CNavItem 
            href="/renewals"
            active={location.pathname === '/renewals'}
            onClick={handleNavigation('/renewals')}
          >
            <DescriptionOutlined className="nav-icon" sx={{ fontSize: 20 }} /> Contract renewals
          </CNavItem>
        </CNavGroup>
        
        <CNavGroup 
          toggler={
            <>
              <InsertChartOutlinedRounded className="nav-icon" sx={{ fontSize: 20 }} /> Analytics
            </>
          }
        >
          <CNavItem 
            href="/analytics"
            active={location.pathname === '/analytics'}
            onClick={handleNavigation('/analytics')}
          >
            <MultilineChartRounded className="nav-icon" sx={{ fontSize: 20 }} /> KPIs and metrics
          </CNavItem>
          <CNavItem 
            href="/automations"
            active={location.pathname === '/automations'}
            onClick={handleNavigation('/automations')}
          >
            <BoltRounded className="nav-icon" sx={{ fontSize: 20 }} /> Automations
          </CNavItem>
          <CNavItem 
            href="/data"
            active={location.pathname === '/data'}
            onClick={handleNavigation('/data')}
          >
            <CloudUploadRounded className="nav-icon" sx={{ fontSize: 20 }} /> Data Import
          </CNavItem>
        </CNavGroup>
        
        <CNavGroup 
          toggler={
            <>
              <ManageAccountsOutlined className="nav-icon" sx={{ fontSize: 20 }} /> Account
            </>
          }
        >
          {isAdmin && (
            <CNavItem 
              href="/users"
              active={location.pathname === '/users'}
              onClick={handleNavigation('/users')}
            >
              <PersonOutlined className="nav-icon" sx={{ fontSize: 20 }} /> User Management
            </CNavItem>
          )}
          {isAdmin && (
            <CNavItem 
              href="/billing"
              active={location.pathname === '/billing'}
              onClick={handleNavigation('/billing')}
            >
              <PaymentOutlined className="nav-icon" sx={{ fontSize: 20 }} /> Billing
            </CNavItem>
          )}
          {isAdmin && (
            <CNavItem 
              href="/email-templates"
              active={location.pathname === '/email-templates'}
              onClick={handleNavigation('/email-templates')}
            >
              <Email className="nav-icon" sx={{ fontSize: 20 }} /> Email Templates
            </CNavItem>
          )}
        </CNavGroup>

        {/* Spacer to push Settings to bottom */}
        <div style={{ flex: 1 }} />

        {/* Settings at bottom */}
        <CNavItem 
          href="/settings"
          active={location.pathname === '/settings'}
          onClick={handleNavigation('/settings')}
        >
          <SettingsOutlined className="nav-icon" sx={{ fontSize: 20 }} /> Settings
        </CNavItem>
      </CSidebarNav>
      
      <CSidebarFooter className="border-top d-none d-lg-flex" style={{ padding: 0 }}>
        <div style={{ width: '100%' }}>
          {/* User Profile Section */}
          <CNavItem 
            href="/profile"
            onClick={handleNavigation('/profile')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '12px 16px',
              cursor: 'pointer',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '32px'
            }}>
              <ProfilePicture 
                size="sm"
                user={userProfile}
              />
            </div>
            <div className="sidebar-brand-full" style={{ 
              flex: 1, 
              minWidth: 0,
              marginLeft: '12px'
            }}>
              <div style={{ 
                fontWeight: 600, 
                fontSize: '14px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {displayName}
              </div>
              <div style={{ fontSize: '12px', color: '#828392' }}>
                {userProfile?.jobTitle || 'Team Member'}
              </div>
            </div>
          </CNavItem>
          
          {/* Logout Button */}
          <CNavItem 
            href="#"
            onClick={handleLogout}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '32px'
            }}>
              <LogoutOutlined sx={{ fontSize: 20 }} />
            </div>
            <span className="sidebar-brand-full" style={{ marginLeft: '12px' }}>Logout</span>
          </CNavItem>
        </div>
      </CSidebarFooter>
    </CSidebar>
  )
}

export default Sidebar;
