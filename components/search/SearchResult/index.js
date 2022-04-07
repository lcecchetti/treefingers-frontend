import clsx from 'clsx';
import { ForestList } from 'components/forest';
import { StoryList } from 'components/story';
import { UserList } from 'components/user';
import { Button } from 'components/ui';
import { useState } from 'react';

const tabs = [
  { key: 'forests', label: 'Forests', Component: ForestList },
  { key: 'stories', label: 'Stories', Component: StoryList, filter: { root: null } },
  { key: 'users', label: 'Users', Component: UserList },
];

const SearchResult = ({ className, query }) => {
  const [currentTab, setCurrentTab] = useState(tabs[0].key);

  return (
    <div className={clsx('', className)}>
      <ul className="flex justify-start gap-md my-md">
        {tabs.map(({ key, label }) => (
          <li key={key}><Button variant={currentTab === key ? 'outlined' : 'primary'} onClick={() => setCurrentTab(key)}>{label}</Button></li>
        ))}
      </ul>

      <div>
        {tabs.map(({ key, Component, filter = {} }) => (
          currentTab === key && <Component key={key} filter={{ query, ...filter }} />   
        ))}
      </div>
    </div>
  );
};

export default SearchResult;