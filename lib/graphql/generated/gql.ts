/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation activateAccount($input: ActivateAccountInput!) {\n    activateAccount(input: $input) {\n      result\n    }\n  }\n": typeof types.ActivateAccountDocument,
    "\n  mutation changePassword($input: ChangePasswordInput!) {\n    changePassword(input: $input) {\n      result\n    }\n  }\n": typeof types.ChangePasswordDocument,
    "\n  mutation forgotPassword($input: ForgotPasswordInput!) {\n    forgotPassword(input: $input) {\n      result\n    }\n  }\n": typeof types.ForgotPasswordDocument,
    "\n  mutation login($input: LoginInput!) {\n    login(input: $input) {\n      currentUser {\n        id\n        username\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation resendActivateAccount($input: ResendActivateAccountInput!) {\n    resendActivateAccount(input: $input) {\n      result\n    }\n  }\n": typeof types.ResendActivateAccountDocument,
    "\n  mutation register($input: RegisterInput!) {\n    register(input: $input) {\n      result\n    }\n  }\n": typeof types.RegisterDocument,
    "\n  query comments($filter: FilterCommentInput, $sort: SortCommentInput, $last: Int, $before: String) {\n    comments(filter: $filter, sort: $sort, last: $last, before: $before) {\n      edges {\n        cursor\n        node {\n          __typename\n          id\n          content\n          createdAt\n          likesCount\n          currentUserLike {\n            id\n          }\n          user {\n            id\n            username\n          }\n          story {\n            id\n            commentsCount\n          }\n          forest {\n            id\n            commentsCount\n          }\n        }\n      }\n      pageInfo {\n        startCursor\n        hasPreviousPage\n      }\n    }\n  }\n": typeof types.CommentsDocument,
    "\n  mutation submitComment($input: CommentInput!) {\n    submitComment(input: $input) {\n      comment {\n        __typename\n        id\n        content\n        createdAt\n        likesCount\n        currentUserLike {\n          id\n        }\n        user {\n          id\n          username\n        }\n        story {\n          id\n          commentsCount\n        }\n        forest {\n          id\n          commentsCount\n        }\n      }\n    }\n  }\n": typeof types.SubmitCommentDocument,
    "\n  mutation like($input: LikeInput!) {\n    like(input: $input) {\n      like {\n        id\n        story {\n          id\n          likesCount\n          currentUserLike {\n            id\n          }\n        }\n        comment {\n          id\n          likesCount\n          currentUserLike {\n            id\n          }\n        }\n      }\n    }\n  }\n": typeof types.LikeDocument,
    "\n  mutation dislike($input: DislikeInput!) {\n    dislike(input: $input) {\n      like {\n        id\n        story {\n          id\n          likesCount\n          currentUserLike {\n            id\n          }\n        }\n        comment {\n          id\n          likesCount\n          currentUserLike {\n            id\n          }\n        }\n      }\n    }\n  }\n": typeof types.DislikeDocument,
    "\n  fragment ForestCard_forest on Forest {\n    id\n    name\n    excerpt\n    commentsCount\n    membersCount\n    currentUserMembership {\n      id\n    }\n  }\n": typeof types.ForestCard_ForestFragmentDoc,
    "\n  fragment ForestContent_forest on Forest {\n    id\n    name\n    about\n    excerpt\n    storiesCount\n    commentsCount\n    membersCount\n    isEditable\n    currentUserMembership {\n      id\n    }\n  }\n": typeof types.ForestContent_ForestFragmentDoc,
    "\n  query forests($filter: FilterForestInput, $sort: SortForestInput, $first: Int, $after: String) {\n    forests(filter: $filter, sort: $sort, first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          name\n          ...ForestCard_forest\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        totalCount\n      }\n    }\n  }\n": typeof types.ForestsDocument,
    "\n  mutation join($input: JoinInput!) {\n    join(input: $input) {\n      membership {\n        id\n        forest {\n          id\n          membersCount\n          currentUserMembership {\n            id\n          }\n        }\n      }\n    }\n  }\n": typeof types.JoinDocument,
    "\n  mutation leave($input: LeaveInput!) {\n    leave(input: $input) {\n      membership {\n        id\n        forest {\n          id\n          membersCount\n          currentUserMembership {\n            id\n          }\n        }\n      }\n    }\n  }\n": typeof types.LeaveDocument,
    "\n  mutation createForest($input: CreateForestInput!) {\n    createForest(input: $input) {\n      forest {\n        id\n        name\n      }\n    }\n  }\n": typeof types.CreateForestDocument,
    "\n  mutation editForest($input: EditForestInput!) {\n    editForest(input: $input) {\n      forest {\n        id\n        about\n      }\n    }\n  }\n": typeof types.EditForestDocument,
    "\n  query forest($filter: FilterForestInput!) {\n    forest(filter: $filter) {\n      ...ForestContent_forest\n    }\n  }\n": typeof types.ForestDocument,
    "\n  mutation readAllNotifications {\n    readAllNotifications {\n      count\n    }\n  }\n": typeof types.ReadAllNotificationsDocument,
    "\n  query notifications($filter: FilterNotificationInput, $sort: SortNotificationInput, $first: Int, $after: String) {\n    notifications(filter: $filter, sort: $sort, first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          type\n          sourceId\n          targetId\n          read\n          createdAt\n          actor {\n            id\n            username\n          }\n          content\n          link\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        totalCount\n      }\n      unreadCount\n    }\n  }\n": typeof types.NotificationsDocument,
    "\n  mutation readNotification($input: ReadNotificationInput!) {\n    readNotification(input: $input) {\n      notification {\n        id\n        read\n      }\n    }\n  }\n": typeof types.ReadNotificationDocument,
    "\n  fragment StoryCard_story on Story {\n    __typename\n    id\n    title\n    excerpt\n    createdAt\n    depth\n    parent {\n      id\n      likesCount\n      descendantsCount\n    }\n    author {\n      id\n      username\n    }\n    tags\n    likesCount\n    commentsCount\n    descendantsCount\n    childrenCount\n    currentUserLike {\n      id\n    }\n  }\n": typeof types.StoryCard_StoryFragmentDoc,
    "\n  fragment StoryContent_story on Story {\n    __typename\n    id\n    title\n    content\n    excerpt\n    createdAt\n    author {\n      id\n      username\n    }\n    tags\n    parent {\n      id\n    }\n    root {\n      id\n      title\n      likesCount\n      descendantsCount\n      childrenCount\n      commentsCount\n      depth\n    }\n    forest {\n      id\n      name\n    }\n    likesCount\n    commentsCount\n    descendantsCount\n    childrenCount\n    depth\n    currentUserLike {\n      id\n    }\n    isEditable\n  }\n": typeof types.StoryContent_StoryFragmentDoc,
    "\n  query stories($filter: FilterStoryInput, $sort: SortStoryInput, $first: Int, $after: String) {\n    stories(filter: $filter, sort: $sort, first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          ...StoryCard_story\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n        totalCount\n      }\n    }\n  }\n": typeof types.StoriesDocument,
    "\n  query chooseForest($filter: FilterForestInput) {\n    forests(filter: $filter, first: 10, sort: { membersCount: DESC }) {\n      edges {\n        node {\n          id\n          name\n          storiesCount\n        }\n      }\n    }\n  }\n": typeof types.ChooseForestDocument,
    "\n  mutation createStory($input: CreateStoryInput!) {\n    createStory(input: $input) {\n      story {\n        id\n        author {\n          id\n          storiesCount\n        }\n      }\n    }\n  }\n": typeof types.CreateStoryDocument,
    "\n  mutation editStory($input: EditStoryInput!) {\n    editStory(input: $input) {\n      story {\n        id\n        title\n        content\n        tags\n      }\n    }\n  }\n": typeof types.EditStoryDocument,
    "\n  query storyTreeShape($filter: FilterStoryInput!) {\n    story(filter: $filter) {\n      id\n      descendantsCount\n      childrenCount\n      depth\n      likesCount\n      commentsCount\n      root {\n        id\n        descendantsCount\n        childrenCount\n        depth\n        likesCount\n        commentsCount\n      }\n    }\n  }\n": typeof types.StoryTreeShapeDocument,
    "\n  query story($filter: FilterStoryInput!) {\n    story(filter: $filter) {\n      ...StoryContent_story\n    }\n  }\n": typeof types.StoryDocument,
    "\n  fragment UserCard_user on User {\n    id\n    excerpt\n    username\n    followersCount\n    currentUserFollowershipAsFollower {\n      id\n    }\n  }\n": typeof types.UserCard_UserFragmentDoc,
    "\n  fragment UserContent_user on User {\n    id\n    bio\n    username\n    followersCount\n    currentUserFollowershipAsFollower {\n      id\n    }\n  }\n": typeof types.UserContent_UserFragmentDoc,
    "\n  mutation editUser($input: EditUserInput!) {\n    editUser(input: $input) {\n      user {\n        id\n        bio\n      }\n    }\n  }\n": typeof types.EditUserDocument,
    "\n  mutation follow($input: FollowInput!) {\n    follow(input: $input) {\n      followership {\n        id\n        followed {\n          id\n          followersCount\n          currentUserFollowershipAsFollower {\n            id\n          }\n        }\n      }\n    }\n  }\n": typeof types.FollowDocument,
    "\n  mutation unfollow($input: UnfollowInput!) {\n    unfollow(input: $input) {\n      followership {\n        id\n        followed {\n          id\n          followersCount\n          currentUserFollowershipAsFollower {\n            id\n          }\n        }\n      }\n    }\n  }\n": typeof types.UnfollowDocument,
    "\n  query users($filter: FilterUserInput, $sort: SortUserInput, $first: Int, $after: String) {\n    users (filter: $filter, sort: $sort, first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          username\n          ...UserCard_user\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        totalCount\n      }\n    }\n  }\n": typeof types.UsersDocument,
    "\n  query user($filter: FilterUserInput!) {\n    user(filter: $filter) {\n      ...UserContent_user\n    }\n  }\n": typeof types.UserDocument,
    "\n  query currentUser {\n    currentUser {\n      id\n      email\n      username\n    }\n  }\n": typeof types.CurrentUserDocument,
};
const documents: Documents = {
    "\n  mutation activateAccount($input: ActivateAccountInput!) {\n    activateAccount(input: $input) {\n      result\n    }\n  }\n": types.ActivateAccountDocument,
    "\n  mutation changePassword($input: ChangePasswordInput!) {\n    changePassword(input: $input) {\n      result\n    }\n  }\n": types.ChangePasswordDocument,
    "\n  mutation forgotPassword($input: ForgotPasswordInput!) {\n    forgotPassword(input: $input) {\n      result\n    }\n  }\n": types.ForgotPasswordDocument,
    "\n  mutation login($input: LoginInput!) {\n    login(input: $input) {\n      currentUser {\n        id\n        username\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation resendActivateAccount($input: ResendActivateAccountInput!) {\n    resendActivateAccount(input: $input) {\n      result\n    }\n  }\n": types.ResendActivateAccountDocument,
    "\n  mutation register($input: RegisterInput!) {\n    register(input: $input) {\n      result\n    }\n  }\n": types.RegisterDocument,
    "\n  query comments($filter: FilterCommentInput, $sort: SortCommentInput, $last: Int, $before: String) {\n    comments(filter: $filter, sort: $sort, last: $last, before: $before) {\n      edges {\n        cursor\n        node {\n          __typename\n          id\n          content\n          createdAt\n          likesCount\n          currentUserLike {\n            id\n          }\n          user {\n            id\n            username\n          }\n          story {\n            id\n            commentsCount\n          }\n          forest {\n            id\n            commentsCount\n          }\n        }\n      }\n      pageInfo {\n        startCursor\n        hasPreviousPage\n      }\n    }\n  }\n": types.CommentsDocument,
    "\n  mutation submitComment($input: CommentInput!) {\n    submitComment(input: $input) {\n      comment {\n        __typename\n        id\n        content\n        createdAt\n        likesCount\n        currentUserLike {\n          id\n        }\n        user {\n          id\n          username\n        }\n        story {\n          id\n          commentsCount\n        }\n        forest {\n          id\n          commentsCount\n        }\n      }\n    }\n  }\n": types.SubmitCommentDocument,
    "\n  mutation like($input: LikeInput!) {\n    like(input: $input) {\n      like {\n        id\n        story {\n          id\n          likesCount\n          currentUserLike {\n            id\n          }\n        }\n        comment {\n          id\n          likesCount\n          currentUserLike {\n            id\n          }\n        }\n      }\n    }\n  }\n": types.LikeDocument,
    "\n  mutation dislike($input: DislikeInput!) {\n    dislike(input: $input) {\n      like {\n        id\n        story {\n          id\n          likesCount\n          currentUserLike {\n            id\n          }\n        }\n        comment {\n          id\n          likesCount\n          currentUserLike {\n            id\n          }\n        }\n      }\n    }\n  }\n": types.DislikeDocument,
    "\n  fragment ForestCard_forest on Forest {\n    id\n    name\n    excerpt\n    commentsCount\n    membersCount\n    currentUserMembership {\n      id\n    }\n  }\n": types.ForestCard_ForestFragmentDoc,
    "\n  fragment ForestContent_forest on Forest {\n    id\n    name\n    about\n    excerpt\n    storiesCount\n    commentsCount\n    membersCount\n    isEditable\n    currentUserMembership {\n      id\n    }\n  }\n": types.ForestContent_ForestFragmentDoc,
    "\n  query forests($filter: FilterForestInput, $sort: SortForestInput, $first: Int, $after: String) {\n    forests(filter: $filter, sort: $sort, first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          name\n          ...ForestCard_forest\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        totalCount\n      }\n    }\n  }\n": types.ForestsDocument,
    "\n  mutation join($input: JoinInput!) {\n    join(input: $input) {\n      membership {\n        id\n        forest {\n          id\n          membersCount\n          currentUserMembership {\n            id\n          }\n        }\n      }\n    }\n  }\n": types.JoinDocument,
    "\n  mutation leave($input: LeaveInput!) {\n    leave(input: $input) {\n      membership {\n        id\n        forest {\n          id\n          membersCount\n          currentUserMembership {\n            id\n          }\n        }\n      }\n    }\n  }\n": types.LeaveDocument,
    "\n  mutation createForest($input: CreateForestInput!) {\n    createForest(input: $input) {\n      forest {\n        id\n        name\n      }\n    }\n  }\n": types.CreateForestDocument,
    "\n  mutation editForest($input: EditForestInput!) {\n    editForest(input: $input) {\n      forest {\n        id\n        about\n      }\n    }\n  }\n": types.EditForestDocument,
    "\n  query forest($filter: FilterForestInput!) {\n    forest(filter: $filter) {\n      ...ForestContent_forest\n    }\n  }\n": types.ForestDocument,
    "\n  mutation readAllNotifications {\n    readAllNotifications {\n      count\n    }\n  }\n": types.ReadAllNotificationsDocument,
    "\n  query notifications($filter: FilterNotificationInput, $sort: SortNotificationInput, $first: Int, $after: String) {\n    notifications(filter: $filter, sort: $sort, first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          type\n          sourceId\n          targetId\n          read\n          createdAt\n          actor {\n            id\n            username\n          }\n          content\n          link\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        totalCount\n      }\n      unreadCount\n    }\n  }\n": types.NotificationsDocument,
    "\n  mutation readNotification($input: ReadNotificationInput!) {\n    readNotification(input: $input) {\n      notification {\n        id\n        read\n      }\n    }\n  }\n": types.ReadNotificationDocument,
    "\n  fragment StoryCard_story on Story {\n    __typename\n    id\n    title\n    excerpt\n    createdAt\n    depth\n    parent {\n      id\n      likesCount\n      descendantsCount\n    }\n    author {\n      id\n      username\n    }\n    tags\n    likesCount\n    commentsCount\n    descendantsCount\n    childrenCount\n    currentUserLike {\n      id\n    }\n  }\n": types.StoryCard_StoryFragmentDoc,
    "\n  fragment StoryContent_story on Story {\n    __typename\n    id\n    title\n    content\n    excerpt\n    createdAt\n    author {\n      id\n      username\n    }\n    tags\n    parent {\n      id\n    }\n    root {\n      id\n      title\n      likesCount\n      descendantsCount\n      childrenCount\n      commentsCount\n      depth\n    }\n    forest {\n      id\n      name\n    }\n    likesCount\n    commentsCount\n    descendantsCount\n    childrenCount\n    depth\n    currentUserLike {\n      id\n    }\n    isEditable\n  }\n": types.StoryContent_StoryFragmentDoc,
    "\n  query stories($filter: FilterStoryInput, $sort: SortStoryInput, $first: Int, $after: String) {\n    stories(filter: $filter, sort: $sort, first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          ...StoryCard_story\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n        totalCount\n      }\n    }\n  }\n": types.StoriesDocument,
    "\n  query chooseForest($filter: FilterForestInput) {\n    forests(filter: $filter, first: 10, sort: { membersCount: DESC }) {\n      edges {\n        node {\n          id\n          name\n          storiesCount\n        }\n      }\n    }\n  }\n": types.ChooseForestDocument,
    "\n  mutation createStory($input: CreateStoryInput!) {\n    createStory(input: $input) {\n      story {\n        id\n        author {\n          id\n          storiesCount\n        }\n      }\n    }\n  }\n": types.CreateStoryDocument,
    "\n  mutation editStory($input: EditStoryInput!) {\n    editStory(input: $input) {\n      story {\n        id\n        title\n        content\n        tags\n      }\n    }\n  }\n": types.EditStoryDocument,
    "\n  query storyTreeShape($filter: FilterStoryInput!) {\n    story(filter: $filter) {\n      id\n      descendantsCount\n      childrenCount\n      depth\n      likesCount\n      commentsCount\n      root {\n        id\n        descendantsCount\n        childrenCount\n        depth\n        likesCount\n        commentsCount\n      }\n    }\n  }\n": types.StoryTreeShapeDocument,
    "\n  query story($filter: FilterStoryInput!) {\n    story(filter: $filter) {\n      ...StoryContent_story\n    }\n  }\n": types.StoryDocument,
    "\n  fragment UserCard_user on User {\n    id\n    excerpt\n    username\n    followersCount\n    currentUserFollowershipAsFollower {\n      id\n    }\n  }\n": types.UserCard_UserFragmentDoc,
    "\n  fragment UserContent_user on User {\n    id\n    bio\n    username\n    followersCount\n    currentUserFollowershipAsFollower {\n      id\n    }\n  }\n": types.UserContent_UserFragmentDoc,
    "\n  mutation editUser($input: EditUserInput!) {\n    editUser(input: $input) {\n      user {\n        id\n        bio\n      }\n    }\n  }\n": types.EditUserDocument,
    "\n  mutation follow($input: FollowInput!) {\n    follow(input: $input) {\n      followership {\n        id\n        followed {\n          id\n          followersCount\n          currentUserFollowershipAsFollower {\n            id\n          }\n        }\n      }\n    }\n  }\n": types.FollowDocument,
    "\n  mutation unfollow($input: UnfollowInput!) {\n    unfollow(input: $input) {\n      followership {\n        id\n        followed {\n          id\n          followersCount\n          currentUserFollowershipAsFollower {\n            id\n          }\n        }\n      }\n    }\n  }\n": types.UnfollowDocument,
    "\n  query users($filter: FilterUserInput, $sort: SortUserInput, $first: Int, $after: String) {\n    users (filter: $filter, sort: $sort, first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          username\n          ...UserCard_user\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        totalCount\n      }\n    }\n  }\n": types.UsersDocument,
    "\n  query user($filter: FilterUserInput!) {\n    user(filter: $filter) {\n      ...UserContent_user\n    }\n  }\n": types.UserDocument,
    "\n  query currentUser {\n    currentUser {\n      id\n      email\n      username\n    }\n  }\n": types.CurrentUserDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation activateAccount($input: ActivateAccountInput!) {\n    activateAccount(input: $input) {\n      result\n    }\n  }\n"): (typeof documents)["\n  mutation activateAccount($input: ActivateAccountInput!) {\n    activateAccount(input: $input) {\n      result\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation changePassword($input: ChangePasswordInput!) {\n    changePassword(input: $input) {\n      result\n    }\n  }\n"): (typeof documents)["\n  mutation changePassword($input: ChangePasswordInput!) {\n    changePassword(input: $input) {\n      result\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation forgotPassword($input: ForgotPasswordInput!) {\n    forgotPassword(input: $input) {\n      result\n    }\n  }\n"): (typeof documents)["\n  mutation forgotPassword($input: ForgotPasswordInput!) {\n    forgotPassword(input: $input) {\n      result\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation login($input: LoginInput!) {\n    login(input: $input) {\n      currentUser {\n        id\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation login($input: LoginInput!) {\n    login(input: $input) {\n      currentUser {\n        id\n        username\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation resendActivateAccount($input: ResendActivateAccountInput!) {\n    resendActivateAccount(input: $input) {\n      result\n    }\n  }\n"): (typeof documents)["\n  mutation resendActivateAccount($input: ResendActivateAccountInput!) {\n    resendActivateAccount(input: $input) {\n      result\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation register($input: RegisterInput!) {\n    register(input: $input) {\n      result\n    }\n  }\n"): (typeof documents)["\n  mutation register($input: RegisterInput!) {\n    register(input: $input) {\n      result\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query comments($filter: FilterCommentInput, $sort: SortCommentInput, $last: Int, $before: String) {\n    comments(filter: $filter, sort: $sort, last: $last, before: $before) {\n      edges {\n        cursor\n        node {\n          __typename\n          id\n          content\n          createdAt\n          likesCount\n          currentUserLike {\n            id\n          }\n          user {\n            id\n            username\n          }\n          story {\n            id\n            commentsCount\n          }\n          forest {\n            id\n            commentsCount\n          }\n        }\n      }\n      pageInfo {\n        startCursor\n        hasPreviousPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query comments($filter: FilterCommentInput, $sort: SortCommentInput, $last: Int, $before: String) {\n    comments(filter: $filter, sort: $sort, last: $last, before: $before) {\n      edges {\n        cursor\n        node {\n          __typename\n          id\n          content\n          createdAt\n          likesCount\n          currentUserLike {\n            id\n          }\n          user {\n            id\n            username\n          }\n          story {\n            id\n            commentsCount\n          }\n          forest {\n            id\n            commentsCount\n          }\n        }\n      }\n      pageInfo {\n        startCursor\n        hasPreviousPage\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation submitComment($input: CommentInput!) {\n    submitComment(input: $input) {\n      comment {\n        __typename\n        id\n        content\n        createdAt\n        likesCount\n        currentUserLike {\n          id\n        }\n        user {\n          id\n          username\n        }\n        story {\n          id\n          commentsCount\n        }\n        forest {\n          id\n          commentsCount\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation submitComment($input: CommentInput!) {\n    submitComment(input: $input) {\n      comment {\n        __typename\n        id\n        content\n        createdAt\n        likesCount\n        currentUserLike {\n          id\n        }\n        user {\n          id\n          username\n        }\n        story {\n          id\n          commentsCount\n        }\n        forest {\n          id\n          commentsCount\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation like($input: LikeInput!) {\n    like(input: $input) {\n      like {\n        id\n        story {\n          id\n          likesCount\n          currentUserLike {\n            id\n          }\n        }\n        comment {\n          id\n          likesCount\n          currentUserLike {\n            id\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation like($input: LikeInput!) {\n    like(input: $input) {\n      like {\n        id\n        story {\n          id\n          likesCount\n          currentUserLike {\n            id\n          }\n        }\n        comment {\n          id\n          likesCount\n          currentUserLike {\n            id\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation dislike($input: DislikeInput!) {\n    dislike(input: $input) {\n      like {\n        id\n        story {\n          id\n          likesCount\n          currentUserLike {\n            id\n          }\n        }\n        comment {\n          id\n          likesCount\n          currentUserLike {\n            id\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation dislike($input: DislikeInput!) {\n    dislike(input: $input) {\n      like {\n        id\n        story {\n          id\n          likesCount\n          currentUserLike {\n            id\n          }\n        }\n        comment {\n          id\n          likesCount\n          currentUserLike {\n            id\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ForestCard_forest on Forest {\n    id\n    name\n    excerpt\n    commentsCount\n    membersCount\n    currentUserMembership {\n      id\n    }\n  }\n"): (typeof documents)["\n  fragment ForestCard_forest on Forest {\n    id\n    name\n    excerpt\n    commentsCount\n    membersCount\n    currentUserMembership {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ForestContent_forest on Forest {\n    id\n    name\n    about\n    excerpt\n    storiesCount\n    commentsCount\n    membersCount\n    isEditable\n    currentUserMembership {\n      id\n    }\n  }\n"): (typeof documents)["\n  fragment ForestContent_forest on Forest {\n    id\n    name\n    about\n    excerpt\n    storiesCount\n    commentsCount\n    membersCount\n    isEditable\n    currentUserMembership {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query forests($filter: FilterForestInput, $sort: SortForestInput, $first: Int, $after: String) {\n    forests(filter: $filter, sort: $sort, first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          name\n          ...ForestCard_forest\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        totalCount\n      }\n    }\n  }\n"): (typeof documents)["\n  query forests($filter: FilterForestInput, $sort: SortForestInput, $first: Int, $after: String) {\n    forests(filter: $filter, sort: $sort, first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          name\n          ...ForestCard_forest\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        totalCount\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation join($input: JoinInput!) {\n    join(input: $input) {\n      membership {\n        id\n        forest {\n          id\n          membersCount\n          currentUserMembership {\n            id\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation join($input: JoinInput!) {\n    join(input: $input) {\n      membership {\n        id\n        forest {\n          id\n          membersCount\n          currentUserMembership {\n            id\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation leave($input: LeaveInput!) {\n    leave(input: $input) {\n      membership {\n        id\n        forest {\n          id\n          membersCount\n          currentUserMembership {\n            id\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation leave($input: LeaveInput!) {\n    leave(input: $input) {\n      membership {\n        id\n        forest {\n          id\n          membersCount\n          currentUserMembership {\n            id\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createForest($input: CreateForestInput!) {\n    createForest(input: $input) {\n      forest {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation createForest($input: CreateForestInput!) {\n    createForest(input: $input) {\n      forest {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation editForest($input: EditForestInput!) {\n    editForest(input: $input) {\n      forest {\n        id\n        about\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation editForest($input: EditForestInput!) {\n    editForest(input: $input) {\n      forest {\n        id\n        about\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query forest($filter: FilterForestInput!) {\n    forest(filter: $filter) {\n      ...ForestContent_forest\n    }\n  }\n"): (typeof documents)["\n  query forest($filter: FilterForestInput!) {\n    forest(filter: $filter) {\n      ...ForestContent_forest\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation readAllNotifications {\n    readAllNotifications {\n      count\n    }\n  }\n"): (typeof documents)["\n  mutation readAllNotifications {\n    readAllNotifications {\n      count\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query notifications($filter: FilterNotificationInput, $sort: SortNotificationInput, $first: Int, $after: String) {\n    notifications(filter: $filter, sort: $sort, first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          type\n          sourceId\n          targetId\n          read\n          createdAt\n          actor {\n            id\n            username\n          }\n          content\n          link\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        totalCount\n      }\n      unreadCount\n    }\n  }\n"): (typeof documents)["\n  query notifications($filter: FilterNotificationInput, $sort: SortNotificationInput, $first: Int, $after: String) {\n    notifications(filter: $filter, sort: $sort, first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          type\n          sourceId\n          targetId\n          read\n          createdAt\n          actor {\n            id\n            username\n          }\n          content\n          link\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        totalCount\n      }\n      unreadCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation readNotification($input: ReadNotificationInput!) {\n    readNotification(input: $input) {\n      notification {\n        id\n        read\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation readNotification($input: ReadNotificationInput!) {\n    readNotification(input: $input) {\n      notification {\n        id\n        read\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment StoryCard_story on Story {\n    __typename\n    id\n    title\n    excerpt\n    createdAt\n    depth\n    parent {\n      id\n      likesCount\n      descendantsCount\n    }\n    author {\n      id\n      username\n    }\n    tags\n    likesCount\n    commentsCount\n    descendantsCount\n    childrenCount\n    currentUserLike {\n      id\n    }\n  }\n"): (typeof documents)["\n  fragment StoryCard_story on Story {\n    __typename\n    id\n    title\n    excerpt\n    createdAt\n    depth\n    parent {\n      id\n      likesCount\n      descendantsCount\n    }\n    author {\n      id\n      username\n    }\n    tags\n    likesCount\n    commentsCount\n    descendantsCount\n    childrenCount\n    currentUserLike {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment StoryContent_story on Story {\n    __typename\n    id\n    title\n    content\n    excerpt\n    createdAt\n    author {\n      id\n      username\n    }\n    tags\n    parent {\n      id\n    }\n    root {\n      id\n      title\n      likesCount\n      descendantsCount\n      childrenCount\n      commentsCount\n      depth\n    }\n    forest {\n      id\n      name\n    }\n    likesCount\n    commentsCount\n    descendantsCount\n    childrenCount\n    depth\n    currentUserLike {\n      id\n    }\n    isEditable\n  }\n"): (typeof documents)["\n  fragment StoryContent_story on Story {\n    __typename\n    id\n    title\n    content\n    excerpt\n    createdAt\n    author {\n      id\n      username\n    }\n    tags\n    parent {\n      id\n    }\n    root {\n      id\n      title\n      likesCount\n      descendantsCount\n      childrenCount\n      commentsCount\n      depth\n    }\n    forest {\n      id\n      name\n    }\n    likesCount\n    commentsCount\n    descendantsCount\n    childrenCount\n    depth\n    currentUserLike {\n      id\n    }\n    isEditable\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query stories($filter: FilterStoryInput, $sort: SortStoryInput, $first: Int, $after: String) {\n    stories(filter: $filter, sort: $sort, first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          ...StoryCard_story\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n        totalCount\n      }\n    }\n  }\n"): (typeof documents)["\n  query stories($filter: FilterStoryInput, $sort: SortStoryInput, $first: Int, $after: String) {\n    stories(filter: $filter, sort: $sort, first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          ...StoryCard_story\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n        totalCount\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query chooseForest($filter: FilterForestInput) {\n    forests(filter: $filter, first: 10, sort: { membersCount: DESC }) {\n      edges {\n        node {\n          id\n          name\n          storiesCount\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query chooseForest($filter: FilterForestInput) {\n    forests(filter: $filter, first: 10, sort: { membersCount: DESC }) {\n      edges {\n        node {\n          id\n          name\n          storiesCount\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createStory($input: CreateStoryInput!) {\n    createStory(input: $input) {\n      story {\n        id\n        author {\n          id\n          storiesCount\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation createStory($input: CreateStoryInput!) {\n    createStory(input: $input) {\n      story {\n        id\n        author {\n          id\n          storiesCount\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation editStory($input: EditStoryInput!) {\n    editStory(input: $input) {\n      story {\n        id\n        title\n        content\n        tags\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation editStory($input: EditStoryInput!) {\n    editStory(input: $input) {\n      story {\n        id\n        title\n        content\n        tags\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query storyTreeShape($filter: FilterStoryInput!) {\n    story(filter: $filter) {\n      id\n      descendantsCount\n      childrenCount\n      depth\n      likesCount\n      commentsCount\n      root {\n        id\n        descendantsCount\n        childrenCount\n        depth\n        likesCount\n        commentsCount\n      }\n    }\n  }\n"): (typeof documents)["\n  query storyTreeShape($filter: FilterStoryInput!) {\n    story(filter: $filter) {\n      id\n      descendantsCount\n      childrenCount\n      depth\n      likesCount\n      commentsCount\n      root {\n        id\n        descendantsCount\n        childrenCount\n        depth\n        likesCount\n        commentsCount\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query story($filter: FilterStoryInput!) {\n    story(filter: $filter) {\n      ...StoryContent_story\n    }\n  }\n"): (typeof documents)["\n  query story($filter: FilterStoryInput!) {\n    story(filter: $filter) {\n      ...StoryContent_story\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment UserCard_user on User {\n    id\n    excerpt\n    username\n    followersCount\n    currentUserFollowershipAsFollower {\n      id\n    }\n  }\n"): (typeof documents)["\n  fragment UserCard_user on User {\n    id\n    excerpt\n    username\n    followersCount\n    currentUserFollowershipAsFollower {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment UserContent_user on User {\n    id\n    bio\n    username\n    followersCount\n    currentUserFollowershipAsFollower {\n      id\n    }\n  }\n"): (typeof documents)["\n  fragment UserContent_user on User {\n    id\n    bio\n    username\n    followersCount\n    currentUserFollowershipAsFollower {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation editUser($input: EditUserInput!) {\n    editUser(input: $input) {\n      user {\n        id\n        bio\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation editUser($input: EditUserInput!) {\n    editUser(input: $input) {\n      user {\n        id\n        bio\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation follow($input: FollowInput!) {\n    follow(input: $input) {\n      followership {\n        id\n        followed {\n          id\n          followersCount\n          currentUserFollowershipAsFollower {\n            id\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation follow($input: FollowInput!) {\n    follow(input: $input) {\n      followership {\n        id\n        followed {\n          id\n          followersCount\n          currentUserFollowershipAsFollower {\n            id\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation unfollow($input: UnfollowInput!) {\n    unfollow(input: $input) {\n      followership {\n        id\n        followed {\n          id\n          followersCount\n          currentUserFollowershipAsFollower {\n            id\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation unfollow($input: UnfollowInput!) {\n    unfollow(input: $input) {\n      followership {\n        id\n        followed {\n          id\n          followersCount\n          currentUserFollowershipAsFollower {\n            id\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query users($filter: FilterUserInput, $sort: SortUserInput, $first: Int, $after: String) {\n    users (filter: $filter, sort: $sort, first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          username\n          ...UserCard_user\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        totalCount\n      }\n    }\n  }\n"): (typeof documents)["\n  query users($filter: FilterUserInput, $sort: SortUserInput, $first: Int, $after: String) {\n    users (filter: $filter, sort: $sort, first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          username\n          ...UserCard_user\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        totalCount\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query user($filter: FilterUserInput!) {\n    user(filter: $filter) {\n      ...UserContent_user\n    }\n  }\n"): (typeof documents)["\n  query user($filter: FilterUserInput!) {\n    user(filter: $filter) {\n      ...UserContent_user\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query currentUser {\n    currentUser {\n      id\n      email\n      username\n    }\n  }\n"): (typeof documents)["\n  query currentUser {\n    currentUser {\n      id\n      email\n      username\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;