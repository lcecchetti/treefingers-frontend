import clsx from 'clsx';
import { ForestList } from 'components/forest';
import { StoryList } from 'components/story';
import { UserList } from 'components/user';
import { Button, Text } from 'components/ui';
import { useState } from 'react';
import * as gtag from 'lib/gtag';

const SearchResult = ({ className, query }) => {
  const [forestsCount, setForestsCount] = useState();
  const [storiesCount, setStoriesCount] = useState();
  const [usersCount, setUsersCount] = useState();

  const tabs = [
    { key: 'stories', label: 'Stories', Component: StoryList, filter: { parent: { eq: null } }, totalCount: storiesCount, setTotalCount: setStoriesCount },
    { key: 'forests', label: 'Forests', Component: ForestList, totalCount: forestsCount, setTotalCount: setForestsCount },
    { key: 'users', label: 'Users', Component: UserList, totalCount: usersCount, setTotalCount: setUsersCount },
  ];

  const [currentTab, setCurrentTab] = useState(tabs[0].key);

  return (!!query && (
    <div className={clsx('', className)}>
      <ul className="flex justify-start gap-md my-md">
        {tabs.map(({ key, label, totalCount }) => (
          <li key={key}>
            <Button variant={currentTab === key ? 'outlined' : 'primary'} onClick={() => {
              setCurrentTab(key);
              gtag.event({
                action: `search-tab-${key}`,
                category: 'search',
              });
            }}>{label} ({totalCount})</Button>
          </li>
        ))}
      </ul>

      <div>
        {tabs.map(({ key, Component, filter = {}, totalCount, setTotalCount }) => (
          <div key={key} className={clsx(currentTab === key && 'block', currentTab !== key && 'hidden')}>
            {totalCount === 0 &&
              <Text>No results.</Text>
            }
            <Component className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-md" filter={{ query, ...filter }} setTotalCount={setTotalCount} />   
          </div>  
        ))}
      </div>
    </div>
  ));
};

export default SearchResult;