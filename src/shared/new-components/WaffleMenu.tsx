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

  const navigate = useNavigate();

  useEffect(() => {
    if (!isWaffleOpen) return;

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
        <div className={`ws-waffle-dropdown ${isDarkMode ? 'dark' : 'light'}`}>
          {/* Header */}
          <div className="ws-waffle-header">
            <h3 className="ws-waffle-title">Quick Links</h3>

            <button className="ws-waffle-edit-btn">
              <i className="pi pi-pen-to-square" />
              <span>Edit</span>
            </button>
          </div>

          {/* Favorites */}
          <div className="ws-waffle-section">
            <div className="ws-waffle-section-title">Favorites</div>

            <div className="ws-waffle-grid">
              {menuConfig.slice(0, 4).map((item, i) => (
                <div
                  key={item.slug || i}
                  onClick={() => {
                    setIsWaffleOpen(false);

                    if (item.slug) {
                      navigate(`/home/sub-menu/${item.slug}`);
                    }
                  }}
                  className="ws-waffle-favorite-card"
                >
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
            </div>
          </div>

          {/* Categories */}
          <div className="ws-waffle-section">
            <div className="ws-waffle-section-title">Categories</div>

            <div className="ws-waffle-list">
              {menuConfig.map((item, i) => (
                <div
                  key={item.slug || i}
                  onClick={() => {
                    setIsWaffleOpen(false);

                    if (item.slug) {
                      navigate(`/home/sub-menu/${item.slug}`);
                    }
                  }}
                  className="ws-waffle-list-item"
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

                    <div>
                      <p className="ws-waffle-item-title">{item.label}</p>

                      <p className="ws-waffle-item-description">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <i className="pi pi-angle-right ws-waffle-arrow" />
                </div>
              ))}
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
