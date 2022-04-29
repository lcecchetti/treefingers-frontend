import clsx from 'clsx';
import { ForestList } from 'components/forest';
import { StoryList } from 'components/story';
import { UserList } from 'components/user';
import { Button, Text } from 'components/ui';
import { useState } from 'react';

const SearchResult = ({ className, query }) => {
  const [forestsCount, setForestsCount] = useState(0);
  const [storiesCount, setStoriesCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);

  const tabs = [
    { key: 'forests', label: 'Forests', Component: ForestList, totalCount: forestsCount, setTotalCount: setForestsCount },
    { key: 'stories', label: 'Stories', Component: StoryList, filter: { root: null }, totalCount: storiesCount, setTotalCount: setStoriesCount },
    { key: 'users', label: 'Users', Component: UserList, totalCount: usersCount, setTotalCount: setUsersCount },
  ];

  const [currentTab, setCurrentTab] = useState(tabs[0].key);

  return (!!query && (
    <div className={clsx('', className)}>
      <ul className="flex justify-start gap-md my-md">
        {tabs.map(({ key, label, totalCount }) => (
          <li key={key}><Button variant={currentTab === key ? 'outlined' : 'primary'} onClick={() => setCurrentTab(key)}>{label} ({totalCount})</Button></li>
        ))}
      </ul>

      <div>
        {tabs.map(({ key, Component, filter = {}, totalCount, setTotalCount }) => (
          <div key={key} className={clsx(currentTab === key && 'block', currentTab !== key && 'hidden')}>
            {!totalCount &&
              <Text>No results.</Text>
            }
            <Component filter={{ query, ...filter }} setTotalCount={setTotalCount} />   
          </div>  
        ))}
      </div>
    </div>
  ));
};

export default SearchResult;