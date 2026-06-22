import { useState, useEffect, useMemo } from 'react';
import { storageService, type StoredCard } from '../services/storage';
import { pokemonTcgApi, formatImageUrl } from '../services/pokemon-tcg-api';
import { X, Share2, Check } from 'lucide-react';
import { cardGridStyles } from '../styles/cardStyles';
import { CardModal } from './CardModal';

interface WishlistProps {
  sharedCards?: StoredCard[] | null;
  ownerName?: string;
}

export function Wishlist({ sharedCards, ownerName }: WishlistProps) {
  const isViewingShared = sharedCards !== undefined && sharedCards !== null;

  const [localWishlist, setLocalWishlist] = useState<StoredCard[]>(() =>
    storageService.getWishlist(),
  );

  const [loadedSharedCards, setLoadedSharedCards] = useState<StoredCard[]>([]);
  const [loadingShared, setLoadingShared] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 800);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch full card details for shared wishlist
  useEffect(() => {
    if (isViewingShared && sharedCards && sharedCards.length > 0) {
      const fetchCardDetails = async () => {
        setLoadingShared(true);
        try {
          const detailedCards = await Promise.all(
            sharedCards.map(async (card) => {
              // If card already has full data, return it
              if (card.name !== 'Loading...' && card.image) {
                return card;
              }

              // Otherwise fetch from API
              try {
                const fullCard = await pokemonTcgApi.getCard(card.id);
                return {
                  id: fullCard.id,
                  localId: fullCard.localId,
                  name: fullCard.name,
                  image: formatImageUrl(fullCard.image, 'high'),
                  setId: fullCard.set.id,
                  setName: fullCard.set.name,
                  addedAt: card.addedAt,
                };
              } catch (err) {
                console.error(`Failed to fetch card ${card.id}:`, err);
                return card; // Return partial data if fetch fails
              }
            }),
          );
          setLoadedSharedCards(detailedCards);
        } catch (err) {
          console.error('Failed to load shared cards:', err);
        } finally {
          setLoadingShared(false);
        }
      };

      fetchCardDetails();
    }
  }, [isViewingShared, sharedCards]);

  // Use memoized value for cards based on viewing mode
  const cards = useMemo(() => {
    return isViewingShared ? loadedSharedCards : localWishlist;
  }, [isViewingShared, loadedSharedCards, localWishlist]);

  const [selectedCard, setSelectedCard] = useState<StoredCard | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleRemove = (cardId: string) => {
    if (isViewingShared) return; // Can't remove from shared wishlist
    storageService.removeFromWishlist(cardId);
    const wishlist = storageService.getWishlist();
    setLocalWishlist(wishlist);
    // Close modal if the removed card is currently selected
    if (selectedCard && selectedCard.id === cardId) {
      setSelectedCard(null);
    }
  };

  const handleToggleCollection = () => {
    if (!selectedCard) return;

    const collection = storageService.getCollection();
    const inCollection = collection.some((c) => c.id === selectedCard.id);

    if (inCollection) {
      storageService.removeFromCollection(selectedCard.id);
    } else {
      storageService.addToCollection(selectedCard);
    }
    // Force re-render by creating new card object
    setSelectedCard({ ...selectedCard });
  };

  const handleToggleWishlist = () => {
    if (!selectedCard || isViewingShared) return;

    handleRemove(selectedCard.id);
  };

  const handleShare = async () => {
    if (isViewingShared) return;

    const encoded = storageService.encodeWishlistForSharing();
    const shareUrl = `${window.location.origin}${window.location.pathname}?wishlist=${encoded}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback: show the URL in a prompt
      prompt('Copy this link to share your wishlist:', shareUrl);
    }
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCard(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      <CardModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        inCollection={
          selectedCard
            ? storageService
                .getCollection()
                .some((c) => c.id === selectedCard.id)
            : false
        }
        inWishlist={
          isViewingShared
            ? false
            : selectedCard
              ? storageService
                  .getWishlist()
                  .some((c) => c.id === selectedCard.id)
              : false
        }
        onToggleCollection={selectedCard ? handleToggleCollection : undefined}
        onToggleWishlist={
          selectedCard && !isViewingShared ? handleToggleWishlist : undefined
        }
      />
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            marginBottom: '1.5rem',
            gap: isMobile ? '1rem' : 0,
          }}
        >
          <h2
            style={{
              ...cardGridStyles.title,
              fontSize: '2.2rem',
              margin: 0,
              textAlign: isMobile ? 'center' : 'left',
            }}
          >
            {isViewingShared
              ? `${ownerName ? ownerName + "'s" : 'Shared'} Wishlist (${
                  cards.length
                } cards)`
              : `My Wishlist (${cards.length} cards)`}
            {loadingShared && (
              <span
                style={{
                  fontSize: '1rem',
                  color: '#a0a0c0',
                  marginLeft: '1rem',
                }}
              >
                Loading cards...
              </span>
            )}
          </h2>

          {!isViewingShared && cards.length > 0 && (
            <button
              onClick={handleShare}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: copied ? '#10b981' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                width: isMobile ? '100%' : 'auto',
              }}
              onMouseEnter={(e) => {
                if (!copied) {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(59, 130, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!copied) {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 2px 8px rgba(59, 130, 246, 0.3)';
                }
              }}
            >
              {copied ? (
                <>
                  <Check size={20} />
                  Link Copied!
                </>
              ) : (
                <>
                  <Share2 size={20} />
                  Share Wishlist
                </>
              )}
            </button>
          )}
        </div>

        {isViewingShared && (
          <div
            style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
              fontSize: '0.95rem',
              color: '#856404',
            }}
          >
            <strong>👀 Viewing a shared wishlist</strong>
            <p style={{ margin: '0.5rem 0 0 0' }}>
              You can add these cards to your own collection or wishlist. Your
              changes won't affect the shared wishlist.
            </p>
          </div>
        )}

        {cards.length === 0 ? (
          <div style={cardGridStyles.emptyState}>
            <p>
              {isViewingShared
                ? 'This wishlist is empty.'
                : 'Your wishlist is empty. Start adding cards you want to collect!'}
            </p>
          </div>
        ) : (
          <div style={cardGridStyles.grid}>
            {cards.map((card) => (
              <div
                key={card.id}
                style={cardGridStyles.card}
                onMouseEnter={() => setHoveredCardId(card.id)}
                onMouseLeave={() => setHoveredCardId(null)}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '139.5%', // Pokemon card aspect ratio
                    backgroundColor: 'rgba(100, 108, 255, 0.05)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  {!loadedImages.has(card.id) && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          'linear-gradient(90deg, rgba(100, 108, 255, 0.05) 25%, rgba(100, 108, 255, 0.15) 50%, rgba(100, 108, 255, 0.05) 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                      }}
                    />
                  )}
                  <img
                    src={card.image}
                    alt={card.name}
                    loading='lazy'
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                      cursor: 'pointer',
                      opacity: loadedImages.has(card.id) ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                    }}
                    onClick={() => setSelectedCard(card)}
                    onLoad={() => {
                      setLoadedImages((prev) => new Set([...prev, card.id]));
                    }}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (img.src.endsWith('.webp')) {
                        img.src = img.src.replace('.webp', '.png');
                      }
                    }}
                  />
                </div>
                <p style={cardGridStyles.cardName}>{card.name}</p>
                <p style={cardGridStyles.cardId}>#{card.localId}</p>
                {card.setName && (
                  <p
                    style={{
                      fontSize: '0.7rem',
                      color: '#888',
                      marginTop: '0.25rem',
                    }}
                  >
                    {card.setName}
                  </p>
                )}
                {!isViewingShared && (
                  <button
                    className='remove-button'
                    onClick={() => handleRemove(card.id)}
                    style={cardGridStyles.getRemoveButton(
                      isMobile,
                      hoveredCardId === card.id,
                    )}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#cc0000';
                      if (!isMobile) {
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'rgba(255, 68, 68, 0.9)';
                      if (!isMobile) {
                        e.currentTarget.style.transform = 'scale(1)';
                      }
                    }}
                    title='Remove from wishlist'
                  >
                    <X size={16} strokeWidth={2} />
                    {isMobile && <span>Remove</span>}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
