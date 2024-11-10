export const SUPPORTED_NETWORKS = [
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'base', name: 'Base Chain' },
  { id: 'bnb', name: 'BNB Chain' }
] as const;

export const SUPPORTED_TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', icon: '⟠' },
  { symbol: 'USDT', name: 'Tether USD', icon: '₮' },
  { symbol: 'BNB', name: 'BNB', icon: '⟡' },
  { symbol: 'BASE', name: 'Base', icon: '🅱' }
] as const;