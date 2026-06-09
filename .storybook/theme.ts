import { create } from 'storybook/theming';

const athenaTheme = create({
  base: 'light',

  // Branding
  brandTitle: 'Athena Design System',

  // Colors
  colorPrimary: '#2e7061',   // forest.500
  colorSecondary: '#2e7061', // forest.500

  // App chrome
  appBg: '#ffffff',          // neutral.0
  appContentBg: '#ffffff',   // neutral.0
  appPreviewBg: '#f5f5f5',   // neutral.50
  appBorderColor: '#d4d4d4', // neutral.200
  appBorderRadius: 4,

  // Typography
  fontBase: '"Inter", system-ui, sans-serif',
  fontCode: 'ui-monospace, "Fira Code", monospace',

  // Text
  textColor: '#252525',      // neutral.800
  textMutedColor: '#737373', // neutral.500
  textInverseColor: '#ffffff',

  // Toolbar / nav bar
  barBg: '#ffffff',          // neutral.0
  barTextColor: '#525252',   // neutral.600
  barSelectedColor: '#2e7061', // forest.500
  barHoverColor: '#2e7061',  // forest.500

  // Form inputs
  inputBg: '#ffffff',
  inputBorder: '#b8b8b8',    // neutral.300
  inputTextColor: '#252525', // neutral.800
  inputBorderRadius: 4,

  // Buttons
  buttonBg: '#ffffff',
  buttonBorder: '#d4d4d4',   // neutral.200
  booleanBg: '#e8e8e8',      // neutral.100
  booleanSelectedBg: '#2e7061', // forest.500
});

export default athenaTheme;
