import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select, { SingleValue } from 'react-select';
import logoSvg from '../assets/alvinlogo1.svg';
import { RiLoader2Fill } from "react-icons/ri";
import { HiSearch } from "react-icons/hi";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

// TypeScript interfaces
interface Organization {
  value: string;
  label: string;
}

interface OrganizationUser {
  value: string;
  label: string;
}

interface RawOrganizationUser {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface UserDetails {
  email: string;
  first_name: string;
  last_name: string;
}

interface PasswordValidationProps {
  password: string;
}

// Styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 2rem;
  transition: all 0.5s ease;
`;

const slideIn = keyframes`
    from {
        transform: translateY(20%);
    }
    to {
        transform: translateY(0);
    }
`;

const Card = styled.div<{ shiftLeft?: boolean }>`
  background: ${({ theme }) => theme.glass || '#fff'};
  color: ${({ theme }) => theme.text || '#000'};
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  transition: transform 0.8s ease-in-out;
  animation: ${slideIn} 0.5s ease;
  max-width: 25rem;
  padding: 2rem;
  border-radius: 20px;

  ${({ shiftLeft }) =>
    shiftLeft &&
    `
    transform: translateX(-10px);
  `}
`;

const CardTitle = styled.h2`
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

const MainContainer = styled.div`
  margin: auto;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: center;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
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

  @media (max-width: 768px) {
    padding: 10px 15px;
  }
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

const Input = styled.input`
  width: 93%;
  height: 2rem;
  padding: 10px;
  border-radius: 12px;
  border: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  outline: none;

  &:focus {
    border: none;
  }

  &:disabled {
    background-color: #f7f7f7;
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

const ErrorMessage = styled.div`
  border: 1px solid #f7f7f7;
  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.1), 
              inset -4px -4px 8px rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  padding: 10px 5px;
  color: red;
  font-size: 0.85rem;
  margin-top: -10px;
  margin-bottom: 10px;
`;

const PasswordChecklist = styled.ul`
  list-style: none;
  padding: 0;
  font-size: 0.7rem;
  color: #101010;
  padding: 10px;
  border-radius: 8px;
  perspective: 10px;
  margin-top: -10px;
  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.1), 
              inset -4px -4px 8px rgba(255, 255, 255, 0.7);
`;

const ChecklistItem = styled.li<{ isValid: boolean }>`
  display: flex;
  align-items: center;
  color: ${({ isValid }) => (isValid ? 'green' : '#a81616')};
  font-weight: ${({ isValid }) => (isValid ? '600' : '400')};
`;

const IconWrapper = styled.span`
  margin-right: 10px;
`;

const PasswordValidation: React.FC<PasswordValidationProps> = ({ password }) => {
  const validations = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    specialChar: /[$@$!%*?&]/.test(password)
  };

  return (
    <PasswordChecklist>
      <ChecklistItem isValid={validations.length}>
        <IconWrapper>
          {validations.length ? <AiOutlineCheckCircle /> : <AiOutlineCloseCircle />}
        </IconWrapper>
        Minimum 8 characters
      </ChecklistItem>
      <ChecklistItem isValid={validations.lowercase}>
        <IconWrapper>
          {validations.lowercase ? <AiOutlineCheckCircle /> : <AiOutlineCloseCircle />}
        </IconWrapper>
        At least one lowercase letter
      </ChecklistItem>
      <ChecklistItem isValid={validations.uppercase}>
        <IconWrapper>
          {validations.uppercase ? <AiOutlineCheckCircle /> : <AiOutlineCloseCircle />}
        </IconWrapper>
        At least one uppercase letter
      </ChecklistItem>
      <ChecklistItem isValid={validations.number}>
        <IconWrapper>
          {validations.number ? <AiOutlineCheckCircle /> : <AiOutlineCloseCircle />}
        </IconWrapper>
        At least one number
      </ChecklistItem>
      <ChecklistItem isValid={validations.specialChar}>
        <IconWrapper>
          {validations.specialChar ? <AiOutlineCheckCircle /> : <AiOutlineCloseCircle />}
        </IconWrapper>
        At least one special character ($@$!%*?&)
      </ChecklistItem>
    </PasswordChecklist>
  );
};

const LoadingIcon = () => <StyledLoader size="24px" />;

const ResetPassword: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<SingleValue<Organization>>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [organizationUsers, setOrganizationUsers] = useState<OrganizationUser[]>([]);
  const [rawOrganizationUsers, setRawOrganizationUsers] = useState<RawOrganizationUser[]>([]);
  const [selectedOrgUser, setSelectedOrgUser] = useState<SingleValue<OrganizationUser>>(null);
  const [originalUserDetails, setOriginalUserDetails] = useState<RawOrganizationUser | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>({ email: '', first_name: '', last_name: '' });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const navigate = useNavigate();

  const baseUrl = 'http://localhost:5001';
  const fetchOrgsUrl = `${baseUrl}/organizations/all`;
  const fetchOrganizationUsersUrl = `${baseUrl}/users/organization/admin/${selectedOrg?.value}`;
  const editUserDetailsUrl = `${baseUrl}/users/edit/${userDetails?.email}`;
  const editUserPasswordUrl = `${baseUrl}/users/edit_password/${userDetails?.email}/admin`;

  const postUserDetails = () => {
    axios.post(editUserDetailsUrl, {
      first_name: userDetails.first_name,
      last_name: userDetails.last_name,
      email: userDetails.email
    })
      .then(response => {
        console.log('User details updated:', response.data);
        setOrganizationUsers([]);
        setSelectedOrgUser(null);
        setOriginalUserDetails(null);
      })
      .catch(error => console.error('Error updating user details:', error));
  };

  const postUserPassword = () => {
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    setConfirmPasswordError('');

    axios.post(editUserPasswordUrl, { password })
      .then(response => {
        console.log('User password updated:', response.data);
        setPassword('');
        setConfirmPassword('');
        setOrganizationUsers([]);
        setSelectedOrgUser(null);
        setOriginalUserDetails(null);
      })
      .catch(error => console.error('Error updating user password:', error));
  };

  // Fetch organizations
  useEffect(() => {
    axios.get(fetchOrgsUrl)
      .then(response => {
        setOrganizations(response.data.map((org: any) => ({ value: org.id, label: org.name })).sort((a: Organization, b: Organization) => a.label.localeCompare(b.label)));
      })
      .catch(error => console.error('Error fetching organizations:', error));
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      axios.get(fetchOrganizationUsersUrl)
        .then(response => {
          setOrganizationUsers(response.data?.users.map((user: RawOrganizationUser) => ({
            value: user.user_id,
            label: `${user.first_name} ${user.last_name} `
          })).sort((a: OrganizationUser, b: OrganizationUser) => a.label.localeCompare(b.label)));
          setRawOrganizationUsers(response.data?.users);
        })
        .catch(error => console.error('Error fetching organization users:', error));
    } else {
      setOrganizationUsers([]);
    }
  }, [selectedOrg]);

  const getUserDetails = () => {
    if (selectedOrgUser) {
      const userDetails = rawOrganizationUsers.find(user => user.user_id === selectedOrgUser.value);
      if (userDetails) {
        setOriginalUserDetails(userDetails);
        setUserDetails({
          email: userDetails.email,
          first_name: userDetails.first_name,
          last_name: userDetails.last_name
        });
      }
    }
  };

  const isFormChanged = () => {
    return (
      userDetails.email !== originalUserDetails?.email ||
      userDetails.first_name !== originalUserDetails?.first_name ||
      userDetails.last_name !== originalUserDetails?.last_name
    );
  };

  return (
    <MainContainer>
      <LogoContainer>
        <img src={logoSvg} alt="Alvin Logo" />
      </LogoContainer>
      <Container>
        <Card shiftLeft={!!originalUserDetails}>
          <CardTitle>Select a User</CardTitle>
          <Select
            id="organizationName"
            options={organizations}
            onChange={setSelectedOrg}
            onMenuClose={() => {
              setSelectedOrgUser(null);
              setOriginalUserDetails(null);
            }}
            value={selectedOrg}
            isClearable
            isSearchable
            placeholder="Select an organization"
            styles={selectStyles}
          />

          <Select
            id="organizationUsers"
            options={organizationUsers}
            onChange={setSelectedOrgUser}
            onMenuClose={() => setOriginalUserDetails(null)}
            value={selectedOrgUser}
            isClearable
            isSearchable
            placeholder="Select a user"
            styles={selectStyles}
          />

          <ButtonContainer>
            <Button onClick={getUserDetails} disabled={!selectedOrgUser}>
              {isLoading ? <LoadingIcon /> : <HiSearch size="14" />} Get User Details
            </Button>
            <BackButton onClick={() => navigate('/')}>Back</BackButton>
          </ButtonContainer>
        </Card>

        {originalUserDetails && (
          <Card>
            <CardTitle>Edit User Details</CardTitle>
            <Input
              type="email"
              value={userDetails.email}
              onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
              placeholder="Email"
            />
            <Input
              type="text"
              value={userDetails.first_name}
              onChange={(e) => setUserDetails({ ...userDetails, first_name: e.target.value })}
              placeholder="First Name"
            />
            <Input
              type="text"
              value={userDetails.last_name}
              onChange={(e) => setUserDetails({ ...userDetails, last_name: e.target.value })}
              placeholder="Last Name"
            />
            <ButtonContainer>
              <Button onClick={() => postUserDetails()} disabled={!isFormChanged() || !userDetails.email || !userDetails.first_name || !userDetails.last_name}>
                Edit
              </Button>
              <BackButton onClick={() => setOriginalUserDetails(null)}>Cancel</BackButton>
            </ButtonContainer>
          </Card>
        )}

        {originalUserDetails && (
          <Card>
            <CardTitle>Reset {userDetails.first_name}'s Password</CardTitle>
            <Input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {password && <PasswordValidation password={password} />}
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPasswordError && <ErrorMessage>{confirmPasswordError}</ErrorMessage>}
            <ButtonContainer>
              <Button onClick={postUserPassword} disabled={!password || !confirmPassword}>
                Reset Password
              </Button>
            </ButtonContainer>
          </Card>
        )}
      </Container>
    </MainContainer>
  );
};

export default ResetPassword;

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