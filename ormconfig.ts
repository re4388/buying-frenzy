module.exports = [
  {
    name: 'seeder',

    migrations: ['src/seeder/*.seeder.ts'],
    cli: {
      migrationsDir: 'src/seeder/*.seeder.ts',
    },
  },
];
