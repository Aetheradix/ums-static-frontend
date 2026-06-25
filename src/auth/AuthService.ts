import { User } from 'oidc-client-ts';

// Mock user to satisfy oidc-client-ts types
const mockUser = {
  id_token: 'mock_id_token',
  access_token: 'mock_access_token',
  scope: 'openid profile offline_access',
  token_type: 'Bearer',
  profile: {
    iss: 'https://localhost:7221',
    sub: 'mock_user_id',
    aud: 'spa-client',
    exp: Math.floor(Date.now() / 1000) + 3600 * 24,
    iat: Math.floor(Date.now() / 1000),
    name: 'Admin User',
    given_name: 'Admin',
    family_name: 'Admin',
    email: 'admin@ums.local',
  },
  expires_at: Math.floor(Date.now() / 1000) + 3600 * 24,
  state: null,
  expired: false,
  scopes: ['openid', 'profile', 'offline_access'],
} as unknown as User;

export const AuthService = {
  signinRedirect: async () => {
    console.log('Mock signinRedirect');
  },
  signoutRedirect: async () => {
    console.log('Mock signoutRedirect');
  },
  signinRedirectCallback: async () => mockUser,
  getUser: async () => mockUser,
  isAuthenticated: async () => true,
};
