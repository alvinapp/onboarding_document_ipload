import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Select from 'react-select';

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
  &:hover {
    box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.35);
  }
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
  background-color: #6a5acd;
  color: white;
  border-radius: 12px;
  margin: 10px;
  cursor: pointer;
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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  width: 90%;
  max-width: 500px;
  text-align: center;
`;

function App() {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [onboardingStates, setOnboardingStates] = useState([]);
  const [selectedOnboardingState, setSelectedOnboardingState] = useState(null);
  const [documentLink, setDocumentLink] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/organizations/all')
      .then(response => {
        setOrganizations(response.data.map(org => ({ value: org.id, label: org.name })));
      })
      .catch(error => console.error('Error fetching organizations:', error));
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      setLoading(true);
      axios.get(`http://localhost:5000/onboarding_steps/organization/${selectedOrg.value}/steps`)
        .then(response => {
          setOnboardingStates(response.data.map(state => ({ value: state.id, label: state.step_name, stepNumber: state.step_number })));
        })
        .catch(error => console.error('Error fetching organization steps:', error))
        .finally(() => setLoading(false));
    } else {
      setOnboardingStates([]);
      setSelectedOnboardingState(null);
    }
  }, [selectedOrg]);

  const handleSubmit = () => {
    setLoading(true);
    axios.post(`http://localhost:5000/onboarding_steps/document/${selectedOrg.value}/add_document`, {
      organization_id: selectedOrg.value,
      onboarding_step_id: selectedOnboardingState.value,
      document_link: documentLink,
      link_type: 'pdf',
      step_number: selectedOnboardingState.stepNumber
    })
      .then(response => console.log('Document added:', response.data))
      .catch(error => console.error('Error adding document:', error))
      .finally(() => {
        setLoading(false);
        setShowModal(false);
      });
  }

  return (
    <Card>
      <Description>
      Onboarding Document Submission
    </Description>
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
        isDisabled={!selectedOrg || loading}
        isClearable
        isSearchable
        placeholder="Select onboarding state"
      />

      <Label htmlFor="documentLink">Document Link</Label>
      <input
        id="documentLink"
        type="text"
        placeholder="Enter document link"
        value={documentLink}
        onChange={e => setDocumentLink(e.target.value)}
        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', width: '95%' }}
      />

      <Button
        onClick={() => setShowModal(true)}
        disabled={!selectedOrg || !selectedOnboardingState || !documentLink || loading}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </Button>

      {showModal && (
        <Modal>
          <ModalContent>
            <h4>Confirm Submission</h4>
            <p>Are you sure you want to submit these details?</p>
            <Button onClick={handleSubmit}>Yes, Submit</Button>
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
          </ModalContent>
        </Modal>
      )}
    </Card>
  );
}

export default App;
