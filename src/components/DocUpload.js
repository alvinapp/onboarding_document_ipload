import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import logoSvg from '../assets/alvinlogo1.svg';
import { RiLoader2Fill } from "react-icons/ri";
import { HiUpload } from "react-icons/hi";

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
  margin: 10rem auto;
  background: #fff;
  width: 100%;
  padding: 2rem;
  border-radius: 20px;
`;

const Description = styled.div`
  font-size: 1rem;
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
  decoration: underline;
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

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
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

function DocUpload() {
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [onboardingStates, setOnboardingStates] = useState([]);
    const [selectedOnboardingState, setSelectedOnboardingState] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

      const baseUrl = 'http://localhost:5001';
    // const baseUrl = 'https://ent.app.alvinapp.com/';
    // const baseUrl = 'https://finance.app.alvinapp.com/';
    const uploadUrl = `${baseUrl}/onboarding_steps/document/${selectedOrg?.value}/upload_document`;
    const fetchOrgsUrl = `${baseUrl}/organizations/all`;
    const fetchStepsUrl = `${baseUrl}/onboarding_steps/organization/${selectedOrg?.value}/steps`;

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
            const response = await axios.post(uploadUrl, formData, {
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
        axios.get(fetchOrgsUrl)
            .then(response => {
                setOrganizations(response.data.map(org => ({ value: org.id, label: org.name })).sort((a, b) => a.label.localeCompare(b.label)));
            })
            .catch(error => console.error('Error fetching organizations:', error));
    }, []);

    useEffect(() => {
        if (selectedOrg) {
            axios.get(fetchStepsUrl)
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
            <LogoContainer>
                <img src={logoSvg} alt="Alvin Logo" />
            </LogoContainer>
            {/* <Description>Onboarding Document Submission</Description> */}
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
                <BackButton onClick={() => navigate('/')}>Back</BackButton>
            </ButtonContainer>
        </Card>
    );
}

export default DocUpload;

const selectStyles = {
    control: (styles) => ({
        ...styles,
        backgroundColor: 'white',
        borderRadius: '12px',
        border: 'none',
        height: '50px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    }),
    option: (styles, { isFocused }) => ({
        ...styles,
        backgroundColor: isFocused ? '#0639ec' : 'white',
        color: isFocused ? 'white' : '#101010',
        borderRadius: '8px',
        cursor: 'pointer'
    }),
    menu: (styles) => ({
        ...styles,
        borderRadius: '12px',
        border: '2px solid #ccc',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
    }),
    menuList: (styles) => ({
        ...styles,
        padding: 2,
        borderRadius: '12px'
    }),
    placeholder: (styles) => ({
        ...styles,
        color: '#101010'
    }),
    singleValue: (styles) => ({
        ...styles,
        color: '#101010'
    })
};

