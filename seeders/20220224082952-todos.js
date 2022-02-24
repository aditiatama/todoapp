'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const dateNow = new Date();
    const nextweek = new Date(
      dateNow.getFullYear(),
      dateNow.getMonth(),
      dateNow.getDate() + 7,
    );
    await queryInterface.bulkInsert('Todos', [
      {
        title: 'Node Js Training',
        description: 'Node Js Training with Hacktiv8',
        UserId: 1,
        due_date: nextweek,
        createdAt: dateNow,
        updatedAt: dateNow
      },
      {
        title: 'React Js Training',
        description: 'Node Js Training with Hactiv8',
        UserId: 2,
        due_date: nextweek,
        createdAt: dateNow,
        updatedAt: dateNow
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Todos', null, {});
  }
};
