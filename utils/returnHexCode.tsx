export const returnHexCode = (theme: AppTheme) => {
  switch (theme) {
    case "blue": 
      return '#60a5fa';
    case "emerald":
      return '#34d399';
    case 'rose':
      return '#fb7185';
    case 'violet':
      return '#a78bfa'
  }
}