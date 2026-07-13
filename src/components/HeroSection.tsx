import styled from 'styled-components';
import { BookMarked, Heart, Search } from 'lucide-react';

const HeroContainer = styled.div`
  padding: 2rem 1.5rem 3rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroContent = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  margin-bottom: 1rem;
  color: #f8f9fa;
  line-height: 1.2;
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: #e8e8f2;
  max-width: 700px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const FeaturesGrid = styled.div`
  margin-top: 3rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 3rem auto 0;
`;

const FeatureCard = styled.div`
  padding: 2rem;
  background-color: rgba(42, 42, 62, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(100, 108, 255, 0.3);
  text-align: center;
`;

const FeatureIcon = styled.div<{ $bgColor: string }>`
  display: inline-flex;
  padding: 1rem;
  background-color: ${(props) => props.$bgColor};
  border-radius: 12px;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #ffffff;
`;

const FeatureDescription = styled.p`
  color: #d4d4e8;
  line-height: 1.6;
`;

export function HeroSection() {
  return (
    <HeroContainer>
      <HeroContent>
        <HeroTitle>Your Ultimate Pokemon TCG Collection Manager</HeroTitle>
        <HeroSubtitle>
          Track your collection, build your wishlist, and discover amazing
          Pokemon cards from every set
        </HeroSubtitle>
      </HeroContent>

      <FeaturesGrid>
        <FeatureCard>
          <FeatureIcon $bgColor='rgba(76, 175, 80, 0.25)'>
            <BookMarked size={32} color='#5FD068' aria-hidden='true' />
          </FeatureIcon>
          <FeatureTitle>Track Your Collection</FeatureTitle>
          <FeatureDescription>
            Keep track of all your Pokemon cards organized by set and rarity
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon $bgColor='rgba(255, 64, 129, 0.25)'>
            <Heart size={32} color='#FF6B9D' aria-hidden='true' />
          </FeatureIcon>
          <FeatureTitle>Build Your Wishlist</FeatureTitle>
          <FeatureDescription>
            Create and share wishlists of cards you're hunting for
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon $bgColor='rgba(100, 108, 255, 0.25)'>
            <Search size={32} color='#7B8CFF' aria-hidden='true' />
          </FeatureIcon>
          <FeatureTitle>Explore All Sets</FeatureTitle>
          <FeatureDescription>
            Browse through every Pokemon TCG set ever released
          </FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>
    </HeroContainer>
  );
}
