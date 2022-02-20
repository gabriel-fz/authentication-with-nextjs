import React from 'react';
import HeadDefault from 'next/head';

interface HeadProps {
  title?: string;
}

const Head: React.FC<HeadProps> = ({ title }) => {
  return (
    <HeadDefault>
      <title>{title || 'Autenticação com NextJs'}</title>
    </HeadDefault>
  );
};

export default Head;
