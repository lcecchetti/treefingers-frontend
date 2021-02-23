module.exports = {
  query: `
    self: UsersPermissionsUser
  `,
  resolver: {
    Query: {
      self: {
        description: 'Return the full user object',
        resolverOf: 'plugins::users-permissions.user.me',
        resolver: 'plugins::users-permissions.user.self',
      },
    },
  }
}
