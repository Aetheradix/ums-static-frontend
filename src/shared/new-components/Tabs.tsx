import {
  TabPanel as PrimeTabPanel,
  TabView as PrimeTabView,
  type TabPanelProps,
  type TabViewProps,
} from 'primereact/tabview';
import React from 'react';
import './Tabs.css';

export interface TabItemProps extends Omit<TabPanelProps, 'header'> {
  title: string | React.ReactNode;
  content: React.ReactNode;
  visible?: boolean;
}

export interface TabsProps extends Omit<TabViewProps, 'children'> {
  tabs: TabItemProps[];
  className?: string;
  panelClassName?: string;
}

export default function Tabs({
  tabs,
  className = '',
  panelClassName = '',
  ...rest
}: TabsProps) {
  const visibleTabs = tabs.filter(tab => tab.visible !== false);

  if (visibleTabs.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      <PrimeTabView {...rest}>
        {visibleTabs.map((tab, index) => {
          const { title, content, ...panelProps } = tab;
          return (
            <PrimeTabPanel
              key={index}
              header={title}
              className={panelClassName}
              {...panelProps}
            >
              {content}
            </PrimeTabPanel>
          );
        })}
      </PrimeTabView>
    </div>
  );
}
