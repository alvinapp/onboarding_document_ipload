import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import DocUpload from "./components/DocUpload";
import LoginDetails from "./components/LoginDetails";
import styled from 'styled-components';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Card>
    <Container>
      <h1>Select an Action</h1>
      <ButtonContainer>
        <Button onClick={() => navigate('/login-details')}>Login Activity</Button>
        <Button onClick={() => navigate('/doc-upload')}>Doc Upload</Button>
      </ButtonContainer>
    </Container>
  </Card>
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
  background-color: #042EBD;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #021F8B;
  }
`;