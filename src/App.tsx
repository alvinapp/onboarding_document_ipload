import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import DocUpload from "./pages/DocUpload";
import logoSvg from './assets/alvinlogo1.svg';
import LoginDetails from "./pages/LoginDetails";
import ResetPassword from "./pages/ResetPassword";
import OrganizationTable from "./pages/OrganizationsTable";
import styled from 'styled-components';

// HomePage Component
const HomePage: React.FC = () => {
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
            <Button onClick={() => navigate('/reset-password')}>Edit User</Button>
            <Button onClick={() => navigate('/organizations')}>Organizations</Button>
          </ButtonContainer>
        </Container>
      </Card>
    </MainContainer>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login-details" element={<LoginDetails />} />
        <Route path="/doc-upload" element={<DocUpload />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/organizations" element={<OrganizationTable />} />
      </Routes>
    </Router>
  );
}

export default App;

// Styled components
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
  padding: 2rem 0;
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
  flex-wrap: wrap;
  justify-content: center; 
  gap: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  width: 150px;
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