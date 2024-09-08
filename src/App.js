import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import Select from 'react-select';
import { RiLoader2Fill } from "react-icons/ri";
import { HiUpload } from "react-icons/hi";

// Styled components
const Card = styled.div`
  background: ${({ theme }) => theme.glass};
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease-in-out;
  position: relative;
  max-width: 30rem;
  margin: 10rem auto;
  background: #fff;
  width: 100%;
  padding: 3rem 5rem 2rem;
  border-radius: 20px;
`;

const Description = styled.div`
  font-size: 1.2rem;
  line-height: 1.5;
  color: #101010;
  line-spacing: 1.5;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const Button = styled.button`
  padding: 12px 20px;
  border: none;
  width: 100%;
  background-color: #6a5acd;
  color: white;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #483d8b;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

const UploadArea = styled.div`
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  text-align: center;
  cursor: pointer;
  &:hover {
    border-color: #0639ec;
  }
`;

const FileInfo = styled.div`
  margin-top: 10px;
  font-size: 16px;
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 20px;
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StyledLoader = styled(RiLoader2Fill)`
  color: white;
  animation: ${spin} 2s linear infinite;
`;

const LoadingIcon = () => (
  <StyledLoader size="24px" />
);

function App() {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [onboardingStates, setOnboardingStates] = useState([]);
  const [selectedOnboardingState, setSelectedOnboardingState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    setIsLoading(true);
    if (!file || !selectedOrg || !selectedOnboardingState) {
      alert("Please select all required fields and a file.");
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('data', JSON.stringify({
      step_number: selectedOnboardingState.stepNumber,
      link_type: 'pdf'  // Example data, adjust as necessary
    }));

    try {
      const response = await axios.post(`http://localhost:5000/onboarding_steps/document/${selectedOrg.value}/upload_document`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Upload successful:', response.data);
      setSelectedOnboardingState(null);
      setSelectedOrg(null);
      setFile(null);
      setIsLoading(false);
    } catch (error) {
      console.error('Upload failed:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    axios.get('http://localhost:5000/organizations/all')
      .then(response => {
        setOrganizations(response.data.map(org => ({ value: org.id, label: org.name })).sort((a, b) => a.label.localeCompare(b.label)));
      })
      .catch(error => console.error('Error fetching organizations:', error));
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      axios.get(`http://localhost:5000/onboarding_steps/organization/${selectedOrg.value}/steps`)
        .then(response => {
          setOnboardingStates(response.data.map(state => ({ value: state.id, label: state.step_name, stepNumber: state.step_number })));
        })
        .catch(error => console.error('Error fetching organization steps:', error));
    } else {
      setOnboardingStates([]);
      setSelectedOnboardingState(null);
    }
  }, [selectedOrg]);

  return (
    <Card>
      <Description>Onboarding Document Submission</Description>
      <Label htmlFor="organizationName">Organization Name</Label>
      <Select
        id="organizationName"
        options={organizations}
        onChange={setSelectedOrg}
        value={selectedOrg}
        isClearable
        isSearchable
        placeholder="Select an organization"
      />

      <Label htmlFor="onboardingState">Onboarding State</Label>
      <Select
        id="onboardingState"
        options={onboardingStates}
        onChange={setSelectedOnboardingState}
        value={selectedOnboardingState}
        isDisabled={!selectedOrg}
        isClearable
        isSearchable
        placeholder="Select onboarding state"
      />

      <UploadArea onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => document.getElementById('fileInput').click()}>
        Drag and drop or <span style={{ color: '#0639ec', textDecoration: 'underline' }}>browse</span> files
      </UploadArea>
      <input id="fileInput" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
      {file && (
        <FileInfo>
          {file.name} - {(file.size / 1024 / 1024).toFixed(2)} MB
        </FileInfo>
      )}
      <ButtonContainer>
        <Button onClick={handleUpload} disabled={!file || !selectedOrg || !selectedOnboardingState}>
          {isLoading ? <LoadingIcon /> : <HiUpload size="14" />} Upload File
        </Button>
      </ButtonContainer>
    </Card>
  );
}

export default App;
