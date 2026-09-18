import React from 'react';
import { HeroSection } from '../components/sections/HeroSection';

interface HomePageProps {
  onTriggerVenom: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onTriggerVenom }) => {
  return <HeroSection onTriggerVenom={onTriggerVenom} />;
};

export default HomePage;
