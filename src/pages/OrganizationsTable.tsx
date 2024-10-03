import React, { useMemo } from 'react';
import styled from 'styled-components';
import OrganizationTableComponent from '../components/organizations/OrganizationTableComponent';
import { Card } from "../components/common/Card"
import { useNavigate } from "react-router-dom";
import logoSvg from "../assets/alvinlogo1.svg";
import { motion, AnimatePresence } from "framer-motion"

const TableContainer = styled.div`
    width: 100%;
    overflow-x: auto;
`;

const OrganizationTable: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center mb-8">
        <img src={logoSvg} alt="Alvin Logo" className="h-12" />
      </div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <TableContainer>
              <OrganizationTableComponent />
            </TableContainer>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OrganizationTable;