declare namespace Menu {
  interface MenuItem {
    label: string;
    icon?: string | React.ReactNode;
    colorScheme?:
      | 'blue'
      | 'purple'
      | 'gray'
      | 'green'
      | 'orange'
      | 'red'
      | 'pink'
      | 'teal'
      | 'indigo'
      | 'amber';
    slug?: string;
    path?: string;
    description?: string;
    category?: string;
    navigationStyle?: 'sidebar' | 'tabs';
    children?: MenuItem[];
    feature?: string;
    action?: string;
  }
}
