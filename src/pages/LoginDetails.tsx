import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select, { SingleValue } from 'react-select';
import logoSvg from '../assets/alvinlogo1.svg';
import { RiLoader2Fill } from "react-icons/ri";
import { HiSearch } from "react-icons/hi";

// TypeScript interfaces
interface Organization {
  value: string;
  label: string;
}

interface UserActivity {
  users: User[];
}

interface User {
  full_name: string;
  email: string;
  first_login: string | null;
  last_login: string | null;
}

// Styled components for table and message
const Card = styled.div`
  background: ${({ theme }) => theme.glass};
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease-in-out;
  position: relative;
  max-width: 25rem;
  margin: 2rem auto;
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

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 1rem;
`;

const TableCard = styled.div`
  background: ${({ theme }) => theme.glass};
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease-in-out;
  margin: 2rem auto;
  background: #fff;
  width: 80%;
  padding: 2rem;
  border-radius: 20px;

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 10px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    white-space: nowrap;

    @media (max-width: 768px) {
      padding: 8px 10px;
      font-size: 14px;
    }
  }
  th {
    background-color: #f4f4f4;
    font-weight: bold;

    @media (max-width: 768px) {
      font-size: 14px;
    }
  }
`;

const NoDataGraphic = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 2rem;
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

const LoadingIcon = () => <StyledLoader size="24px" />;

const UserActivityTable: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<SingleValue<Organization>>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userActivity, setUserActivity] = useState<UserActivity | null>(null);
  const navigate = useNavigate();

  const baseUrl = 'http://localhost:5001';
  const fetchOrgsUrl = `${baseUrl}/organizations/all`;
  const fetchUserActivityUrl = `${baseUrl}/users/organization_users/logins/${selectedOrg?.value}`;

  // Fetch organizations
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

  // Fetch user activity when an organization is selected
  const handleFetchUserActivity = () => {
    if (selectedOrg) {
      setIsLoading(true);
      axios.get(fetchUserActivityUrl)
        .then(response => {
          setUserActivity(response.data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching user activity:', error);
          setIsLoading(false);
        });
    }
  };

  return (
    <MainContainer>
      <LogoContainer>
        <img src={logoSvg} alt="Alvin Logo" />
      </LogoContainer>
      <Card>
        <TitleText>Users Login Activity</TitleText>
        <Select
          id="organizationName"
          options={organizations}
          onChange={setSelectedOrg}
          onMenuClose={() => setUserActivity(null)}
          value={selectedOrg}
          isClearable
          isSearchable
          placeholder="Select an organization"
          styles={selectStyles}
        />

        <ButtonContainer>
          <Button onClick={handleFetchUserActivity} disabled={!selectedOrg}>
            {isLoading ? <LoadingIcon /> : <HiSearch size="14" />} Get User Activity
          </Button>
          <BackButton onClick={() => navigate('/')}>Back</BackButton>
        </ButtonContainer>
      </Card>

      {selectedOrg && userActivity && userActivity.users.length > 0 ? (
        <TableCard>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th></th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>First Login</th>
                  <th>Last Login</th>
                </tr>
              </thead>
              <tbody>
                {userActivity.users.sort((a, b) => a.full_name.localeCompare(b.full_name)).map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.first_login ? new Date(user.first_login).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'User hasn\'t logged in yet'}
                    </td>
                    <td>
                      {user.last_login ? new Date(user.last_login).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'User hasn\'t logged in yet'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </TableCard>
      ) : userActivity && userActivity.users.length === 0 ? (
        <NoDataGraphic>
          <p>No user activity found for this organization.</p>
        </NoDataGraphic>
      ) : null}
    </MainContainer>
  );
};

export default UserActivityTable;

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