import {LegacyCard, Tabs} from '@shopify/polaris';
import {useState, useCallback} from 'react';

export default function Tab() {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );
  const tabs = [
    {
      id: 'all-customers-4',
      content: 'All',
      accessibilityLabel: 'All customers',
      panelID: 'all-customers-content-4',
    },
    {
      id: 'accepts-marketing-4',
      content: 'Active',
      panelID: 'accepts-marketing-content-4',
    },
    {
      id: 'repeat-customers-4',
      content: 'Draft',
      panelID: 'repeat-customers-content-4',
    },
    {
      id: 'prospects-4',
      content: 'Archived',
      panelID: 'prospects-content-4',
    },
  ];

  return (
    <LegacyCard>
      <Tabs 
        tabs={tabs}
        selected={selected}
        onSelect={handleTabChange}
        disclosureText="More views"
      >
        <LegacyCard.Section title={tabs[selected].content}>
          <p>Tab {selected} selected</p>
        </LegacyCard.Section>
      </Tabs>
    </LegacyCard>
  );
}