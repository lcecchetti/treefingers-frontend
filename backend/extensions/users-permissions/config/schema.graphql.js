module.exports = {
  definition: /* GraphQL */ `
    extend type UsersPermissionsUser {
      currentUserLike: Like
    }
  `,
  query: `
    self: UsersPermissionsUser
  `,
  resolver: {
    Query: {
      self: {
        description: 'Return the full user object',
        resolver: 'plugins::users-permissions.user.self',
      },
    },
  }
}
