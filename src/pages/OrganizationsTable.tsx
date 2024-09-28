import React, { useMemo } from 'react';
import styled from 'styled-components';
import CustomTable from '../components/CustomTable';
import { useNavigate } from "react-router-dom";
import logoSvg from "../assets/alvinlogo1.svg";

// Styled components for the Organization Table Card
const Card = styled.div`
    background: ${({ theme }) => theme.glass};
    color: ${({ theme }) => theme.text};
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    transition: all 0.3s ease-in-out;
    position: relative;
    margin: 3rem 0;
    padding: 2rem;
    background: #fff;
    border-radius: 8px;
`;

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: auto;
    min-width: 100vw;
    padding: 2rem 0;
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

const LogoContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const TableContainer = styled.div`
    width: 100%;
    overflow-x: auto;
`;

// Define types for table data
interface TableData {
  customerName: string;
  launchpadStage: string;
  lastActivity: string;
  activatedUsers: number;
}

// Define types for columns
interface Column {
  Header: string;
  accessor: keyof TableData;
}

// Organization table component
const OrganizationTable: React.FC = () => {
  const navigate = useNavigate();

  // Columns for the table
  const columns: Column[] = useMemo(
    () => [
      { Header: 'Customer name', accessor: 'customerName' },
      { Header: 'Launchpad stage', accessor: 'launchpadStage' },
      { Header: 'Last activity', accessor: 'lastActivity' },
      { Header: 'Activated users', accessor: 'activatedUsers' },
    ],
    []
  );

  // Dummy data for the table (organization data)
  const data: TableData[] = useMemo(
    () => [
      { customerName: 'I&M Bank', launchpadStage: '2. Scoping & Program Phasing Plan', lastActivity: 'Customer Needs Analysis - 1 PDF uploaded', activatedUsers: 4 },
      { customerName: 'United Capital', launchpadStage: '2. Scoping & Program Phasing Plan', lastActivity: 'Customer Needs Analysis - 3 PDFs uploaded', activatedUsers: 3 },
      { customerName: 'Nestle', launchpadStage: '3. Program Design & Development', lastActivity: 'Customer Needs Analysis - 1 PDF uploaded', activatedUsers: 5 },
      { customerName: 'Coca-Cola', launchpadStage: '1. Project Initiation & Kickoff', lastActivity: 'Customer Needs Analysis - 2 PDFs uploaded', activatedUsers: 2 },
      { customerName: 'Pepsi', launchpadStage: '4. Program Implementation & Execution', lastActivity: 'Customer Needs Analysis - 3 PDFs uploaded', activatedUsers: 1 },
      { customerName: 'Unilever', launchpadStage: '5. Program Evaluation & Review', lastActivity: 'Customer Needs Analysis - 1 PDF uploaded', activatedUsers: 6 },
      { customerName: 'Samsung', launchpadStage: '2. Scoping & Program Phasing Plan', lastActivity: 'Customer Needs Analysis - 2 PDFs uploaded', activatedUsers: 4 },
      { customerName: 'Apple', launchpadStage: '3. Program Design & Development', lastActivity: 'Customer Needs Analysis - 3 PDFs uploaded', activatedUsers: 3 },
      { customerName: 'Microsoft', launchpadStage: '1. Project Initiation & Kickoff', lastActivity: 'Customer Needs Analysis - 1 PDF uploaded', activatedUsers: 2 },
      { customerName: 'Google', launchpadStage: '4. Program Implementation & Execution', lastActivity: 'Customer Needs Analysis - 2 PDFs uploaded', activatedUsers: 1 },
      { customerName: 'Facebook', launchpadStage: '5. Program Evaluation & Review', lastActivity: 'Customer Needs Analysis - 3 PDFs uploaded', activatedUsers: 6 },
    ],
    []
  );

  return (
    <MainContainer>
      <LogoContainer>
        <img src={logoSvg} alt="Alvin logo" />
      </LogoContainer>
      <Card>
        <CardTitle>Organizations</CardTitle>
        <TableContainer>
          <CustomTable />
        </TableContainer>
      </Card>
    </MainContainer>
  );
};

export default OrganizationTable;