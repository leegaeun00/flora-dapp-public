import { createGlobalStyle } from 'styled-components';
import './globalFont.css';

const GlobalStyle = createGlobalStyle`
  body {
    background: floralWhite;
    margin-top: 30px;
    margin-bottom: 30px;
    margin-left: 50px;
    margin-right: 50px;
    padding: 0;
    font-family: Raleway;
  }
`;

export default GlobalStyle;