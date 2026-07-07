import { useMenu } from 'config/menu-routes';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'shared/components/Icon/Icon';
import './WaffleMenu.css';

interface WaffleMenuProps {
  isDarkMode?: boolean;
}

const mapColorScheme = (
  colorScheme: string | undefined,
  isDarkMode: boolean
) => {
  const mode = isDarkMode ? 'dark' : 'light';

  return `waffle-icon-${colorScheme || 'gray'}-${mode}`;
};

export default function WaffleMenu({ isDarkMode = false }: WaffleMenuProps) {
  const menuConfig = useMenu();
  const [isWaffleOpen, setIsWaffleOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('waffle_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        const initial = menuConfig
          .slice(0, 4)
          .map(item => item.slug)
          .filter(Boolean) as string[];
        setFavorites(initial);
      }
    } else if (menuConfig.length > 0) {
      const initial = menuConfig
        .slice(0, 4)
        .map(item => item.slug)
        .filter(Boolean) as string[];
      setFavorites(initial);
      localStorage.setItem('waffle_favorites', JSON.stringify(initial));
    }
  }, [menuConfig]);

  useEffect(() => {
    if (!isWaffleOpen) {
      setIsEditing(false); // Reset editing mode when closed
      return;
    }

    const handleOutsideClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.ws-waffle-wrapper')) {
        setIsWaffleOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isWaffleOpen]);

  const toggleFavorite = (slug?: string) => {
    if (!slug) return;
    setFavorites(prev => {
      let updated;
      if (prev.includes(slug)) {
        updated = prev.filter(s => s !== slug);
      } else {
        // Limit to max 8 favorites
        if (prev.length >= 8) {
          return prev;
        }
        updated = [...prev, slug];
      }
      localStorage.setItem('waffle_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const favoriteItems = menuConfig.filter(
    item => item.slug && favorites.includes(item.slug)
  );

  return (
    <div className="ws-waffle-wrapper">
      {/* Trigger */}
      <div
        className={`ws-icon-btn ws-waffle-trigger ${
          isWaffleOpen ? 'ws-active' : ''
        }`}
        onClick={() => setIsWaffleOpen(prev => !prev)}
        title="Waffle Menu"
      >
        <i className="pi pi-th-large" />
      </div>

      {/* Dropdown */}
      {isWaffleOpen && (
        <div
          className={`ws-waffle-dropdown ${isDarkMode ? 'dark' : 'light'} ${isEditing ? 'ws-editing-mode' : ''}`}
        >
          {/* Header */}
          <div className="ws-waffle-header">
            <h3 className="ws-waffle-title">Quick Links</h3>

            <button
              className={`ws-waffle-edit-btn ${isEditing ? 'editing' : ''}`}
              onClick={() => setIsEditing(prev => !prev)}
            >
              <i
                className={isEditing ? 'pi pi-check' : 'pi pi-pen-to-square'}
              />
              <span>{isEditing ? 'Done' : 'Edit'}</span>
            </button>
          </div>

          {/* Favorites */}
          <div className="ws-waffle-section">
            <div className="ws-waffle-section-title">Favorites</div>

            <div className="ws-waffle-grid">
              {favoriteItems.map((item, i) => (
                <div
                  key={item.slug || i}
                  onClick={() => {
                    if (isEditing) {
                      toggleFavorite(item.slug);
                    } else {
                      setIsWaffleOpen(false);
                      if (item.slug) {
                        navigate(`/home/sub-menu/${item.slug}`);
                      }
                    }
                  }}
                  className={`ws-waffle-favorite-card ${isEditing ? 'ws-editing' : ''}`}
                >
                  {isEditing && (
                    <div
                      className="ws-waffle-remove-badge"
                      onClick={e => {
                        e.stopPropagation();
                        toggleFavorite(item.slug);
                      }}
                    >
                      <i className="pi pi-times-circle" />
                    </div>
                  )}

                  <div
                    className={`ws-waffle-icon ${mapColorScheme(
                      item.colorScheme,
                      isDarkMode
                    )}`}
                  >
                    <Icon name={(item.icon as string) || 'grid_view'} />
                  </div>

                  <p className="ws-waffle-card-label">{item.label}</p>
                </div>
              ))}
              {favoriteItems.length === 0 && (
                <div className="col-span-4 py-6 text-center text-xs text-slate-400 dark:text-zinc-500">
                  No favorites added yet. Click Edit to add some!
                </div>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="ws-waffle-section">
            <div className="ws-waffle-section-title">Categories</div>

            <div className="ws-waffle-list">
              {menuConfig.map((item, i) => {
                const isFav = item.slug ? favorites.includes(item.slug) : false;
                return (
                  <div
                    key={item.slug || i}
                    onClick={() => {
                      if (!isEditing) {
                        setIsWaffleOpen(false);
                        if (item.slug) {
                          navigate(`/home/sub-menu/${item.slug}`);
                        }
                      } else {
                        toggleFavorite(item.slug);
                      }
                    }}
                    className={`ws-waffle-list-item ${isEditing ? 'ws-list-editing' : ''}`}
                  >
                    <div className="ws-waffle-item-left">
                      <div
                        className={`ws-waffle-icon ${mapColorScheme(
                          item.colorScheme,
                          isDarkMode
                        )}`}
                      >
                        <Icon name={(item.icon as string) || 'grid_view'} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="ws-waffle-item-title">{item.label}</p>
                        <p className="ws-waffle-item-description">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div
                      className="ws-waffle-item-right"
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        onClick={() => toggleFavorite(item.slug)}
                        className="ws-waffle-star-btn"
                        title={
                          isFav ? 'Remove from Favorites' : 'Add to Favorites'
                        }
                      >
                        <i
                          className={`pi ${isFav ? 'pi-star-fill text-amber-500' : 'pi-star text-slate-300 dark:text-zinc-600'}`}
                        />
                      </button>
                      {!isEditing && (
                        <i className="pi pi-angle-right ws-waffle-arrow" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="ws-waffle-footer">
            <button className="ws-waffle-footer-btn">View All Services</button>
          </div>
        </div>
      )}
    </div>
  );
}
