import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import DocUpload from "./components/DocUpload";
import logoSvg from './assets/alvinlogo1.svg';
import LoginDetails from "./components/LoginDetails";
import styled from 'styled-components';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <MainContainer>
    <LogoContainer>
          <img src={logoSvg} alt="Alvin Logo" />
    </LogoContainer>
    <Card>
      <Container>
        
        <TitleText>Select an Action</TitleText>
        <ButtonContainer>
          <Button onClick={() => navigate('/login-details')}>Login Activity</Button>
          <Button onClick={() => navigate('/doc-upload')}>Doc Upload</Button>
        </ButtonContainer>
      </Container>
    </Card>
    </MainContainer>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login-details" element={<LoginDetails />} />
        <Route path="/doc-upload" element={<DocUpload />} />
      </Routes>
    </Router>
  );
}

export default App;

const Card = styled.div`
  background: ${({ theme }) => theme.glass};
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease-in-out;
  position: relative;
  max-width: 20rem;
  height: 20rem;
  margin: 10rem auto;
  background: #fff;
  width: 100%;
  padding: 2rem;
  border-radius: 20px;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  padding: 2rem;
`;

const TitleText = styled.h1`
  font-size: 1.5rem;
  font-weight: 400;
  color: #101010;
  font-family: 'Poppins', sans-serif;
  line-height: 1.5;
  text-align: center;
  letter-spacing: 1.5;
  border-bottom: 1px solid #ddd;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 100vh;
  gap: 5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: white;
  box-shadow: 0 2px 4px -1px #9BB0F7, 0 8px 16px -1px #9BB0F7;
  color: #101010;
  border: 1px solid #042EBD;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #021F8B;
    color: white;
    border: none;
    box-shadow: none;
  }
`;