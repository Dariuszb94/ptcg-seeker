import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem 1.5rem;
  max-width: 900px;
  margin: 0 auto;
`;

export const SearchSection = styled.div`
  margin-top: 0.5rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  font-weight: 600;
  text-align: center;
  color: #f8f9fa;
`;

export const LoadingText = styled.p`
  color: #d1d5db;
  text-align: center;
  font-size: 1.1rem;
`;

export const ErrorBox = styled.div`
  padding: 1.5rem;
  background-color: rgba(255, 68, 68, 0.2);
  border-radius: 12px;
  color: #ff6b6b;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 68, 68, 0.4);
  text-align: center;
`;

export const SearchWrapper = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
`;

export const SearchInput = styled.input`
  padding: 1rem 1.25rem;
  font-size: 1.05rem;
  width: 100%;
  border-radius: 12px;
  border: 2px solid rgba(100, 108, 255, 0.3);
  background-color: rgba(42, 42, 62, 0.6);
  backdrop-filter: blur(10px);
  color: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

  &:focus {
    border-color: #667eea;
    box-shadow: 0 4px 20px rgba(100, 108, 255, 0.4);
    outline: none;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export const SuggestionsDropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background-color: rgba(42, 42, 62, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 108, 255, 0.3);
  border-radius: 12px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

export const SuggestionItem = styled.div`
  padding: 1rem 1.25rem;
  cursor: pointer;
  border-bottom: 1px solid rgba(100, 108, 255, 0.1);
  transition: all 0.2s ease;
  background-color: transparent;

  &:hover {
    background-color: rgba(100, 108, 255, 0.2);
  }

  &:focus {
    background-color: rgba(100, 108, 255, 0.2);
    outline: 2px solid #667eea;
    outline-offset: -2px;
  }
`;

export const SuggestionTitle = styled.div`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

export const SuggestionMeta = styled.div`
  font-size: 0.9rem;
  color: #d1d5db;
`;

export const SelectedSetContainer = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background-color: rgba(42, 42, 62, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(100, 108, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

export const SetImagesContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

export const SetLogo = styled.img`
  max-width: 250px;
  height: auto;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5));
`;

export const SetSymbol = styled.img`
  max-width: 100px;
  height: auto;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5));
`;
