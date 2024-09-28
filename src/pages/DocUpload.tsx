import React, { useState, useEffect, DragEvent, ChangeEvent } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select, { SingleValue } from 'react-select';
import logoSvg from '../assets/alvinlogo1.svg';
import { RiLoader2Fill } from "react-icons/ri";
import { HiUpload } from "react-icons/hi";

// TypeScript interfaces for types
interface Organization {
  value: string;
  label: string;
}

interface OnboardingState {
  value: string;
  label: string;
  stepNumber: number;
}

interface DocumentType {
  value: string;
  label: string;
}

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
  margin: 2rem auto;
  background: #fff;
  width: 100%;
  padding: 2rem;
  border-radius: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  padding: 15px 20px;
  border: none;
  width: 100%;
  background-color: #042EBD;
  color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px -1px #9BB0F7, 0 8px 16px -1px #9BB0F7;
  cursor: pointer;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #042EBE;
  }
  &:disabled {
    background-color: #ccc;
    box-shadow: none;
    cursor: not-allowed;
  }
`;

const UploadArea = styled.div`
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 1rem;
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
  cursor: pointer;
  &:hover {
    border-color: #0639ec;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const FileInfo = styled.div`
  margin-top: 10px;
  font-size: 16px;
  color: #101010;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  padding: 2rem 0;
`;

const BackButton = styled.button`
  padding: 15px 20px;
  border: none;
  width: 100%;
  background-color: white;
  color: #042EBD;
  border-radius: 12px;
  box-shadow: 0 2px 4px -1px #9BB0F7, 0 8px 16px -1px #9BB0F7;
  border: 1px solid #042EBD;
  cursor: pointer;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  &:disabled {
    background-color: #ccc;
    box-shadow: none;
    cursor: not-allowed;
  }
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

// Document type options
const documentTypeOptions: DocumentType[] = [
  { value: 'Launchpad document', label: 'Launchpad document' },
  { value: 'Sales presentation', label: 'Sales presentation' },
  { value: 'Product briefing', label: 'Product briefing' },
  { value: 'Administrative', label: 'Administrative' },
  { value: 'Compliance', label: 'Compliance' },
  { value: 'Other', label: 'Other' }
];

const selectStyles = {
  control: (styles: any) => ({
    ...styles,
    backgroundColor: 'white',
    borderRadius: '12px',
    border: 'none',
    height: '50px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  }),
  option: (styles: any, { isFocused }: { isFocused: boolean }) => ({
    ...styles,
    backgroundColor: isFocused ? '#0639ec' : 'white',
    color: isFocused ? 'white' : '#101010',
    borderRadius: '8px',
    cursor: 'pointer'
  }),
  menu: (styles: any) => ({
    ...styles,
    borderRadius: '12px',
    border: '2px solid #ccc',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
  }),
  menuList: (styles: any) => ({
    ...styles,
    padding: 2,
    borderRadius: '12px'
  }),
  placeholder: (styles: any) => ({
    ...styles,
    color: '#101010'
  }),
  singleValue: (styles: any) => ({
    ...styles,
    color: '#101010'
  })
};

const DocUpload: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<SingleValue<Organization>>(null);
  const [onboardingStates, setOnboardingStates] = useState<OnboardingState[]>([]);
  const [selectedOnboardingState, setSelectedOnboardingState] = useState<SingleValue<OnboardingState>>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<SingleValue<DocumentType>>(null);
  const [documentName, setDocumentName] = useState<string>('');
  const navigate = useNavigate();

  const baseUrl = 'http://localhost:5001';
  const uploadUrl = `${baseUrl}/onboarding_steps/document/${selectedOrg?.value}/upload_document`;
  const fetchOrgsUrl = `${baseUrl}/organizations/all`;
  const fetchStepsUrl = `${baseUrl}/onboarding_steps/organization/${selectedOrg?.value}/steps`;

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const droppedFile = event.dataTransfer.files[0];
      setFile(droppedFile);
      setDocumentName(droppedFile.name.replace(/\.[^/.]+$/, '')); // Remove file extension from name
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0] || null;
    setFile(uploadedFile);
    if (uploadedFile) {
      setDocumentName(uploadedFile.name.replace(/\.[^/.]+$/, '')); // Remove file extension from name
    }
  };

  const handleUpload = async () => {
    setIsLoading(true);
    if (!file || !selectedOrg || !selectedOnboardingState || !documentType || !documentName) {
      alert("Please select all required fields, enter a document name, and upload a file.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('data', JSON.stringify({
      step_number: selectedOnboardingState?.stepNumber,
      link_type: 'pdf',
      document_name: documentName,
      document_type: documentType?.value
    }));

    try {
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Upload successful:', response.data);
      resetForm();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedOnboardingState(null);
    setSelectedOrg(null);
    setFile(null);
    setDocumentType(null);
    setDocumentName('');
  };

  useEffect(() => {
    axios.get(fetchOrgsUrl)
      .then(response => {
        setOrganizations(response.data.map((org: any) => ({
          value: org.id,
          label: org.name
        })).sort((a: Organization, b: Organization) => a.label.localeCompare(b.label)));
      })
      .catch(error => console.error('Error fetching organizations:', error));
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      axios.get(fetchStepsUrl)
        .then(response => {
          setOnboardingStates(response.data.map((state: any) => ({
            value: state.id,
            label: state.step_name,
            stepNumber: state.step_number
          })));
        })
        .catch(error => console.error('Error fetching organization steps:', error));
    } else {
      setOnboardingStates([]);
      setSelectedOnboardingState(null);
    }
  }, [selectedOrg]);

  return (
    <MainContainer>
      <LogoContainer>
        <img src={logoSvg} alt="Alvin Logo" />
      </LogoContainer>
      <Card>
        <TitleText>Upload Document</TitleText>
        <Select
          id="organizationName"
          options={organizations}
          onChange={setSelectedOrg}
          value={selectedOrg}
          isClearable
          isSearchable
          placeholder="Select an organization"
          styles={selectStyles}
        />

        <Select
          id="onboardingState"
          options={onboardingStates}
          onChange={setSelectedOnboardingState}
          value={selectedOnboardingState}
          isDisabled={!selectedOrg}
          isClearable
          isSearchable
          placeholder="Select onboarding state"
          styles={selectStyles}
        />

        <Select
          id="documentType"
          options={documentTypeOptions}
          onChange={setDocumentType}
          value={documentType}
          isClearable
          isSearchable
          placeholder="Select document type"
          styles={selectStyles}
        />

        <Input
          id="documentName"
          type="text"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          placeholder="Enter document name"
        />

        <UploadArea onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => document.getElementById('fileInput')?.click()}>
          Drag and drop or <span style={{ color: '#0639ec', textDecoration: 'underline' }}>browse</span> files
        </UploadArea>
        <input id="fileInput" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
        {file && (
          <FileInfo>
            {file.name} - {(file.size / 1024 / 1024).toFixed(2)} MB
          </FileInfo>
        )}

        <ButtonContainer>
          <Button onClick={handleUpload} disabled={!file || !selectedOrg || !selectedOnboardingState || !documentType || !documentName}>
            {isLoading ? <LoadingIcon /> : <HiUpload size="14" />} Upload File
          </Button>
          <BackButton onClick={() => navigate('/')}>Back</BackButton>
        </ButtonContainer>
      </Card>
    </MainContainer>
  );
};

export default DocUpload;