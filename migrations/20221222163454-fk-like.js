'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // like 테이블 postId 생성
    await queryInterface.addColumn('Likes', 'postId', {
      allowNull: false,
      type: Sequelize.INTEGER,
    });
    await queryInterface.addConstraint('Likes', {
      fields: ['postId'],
      type: 'foreign key',
      name: 'fk_likes_posts_id',
      references: {
        table: 'Posts',
        field: 'postId',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    // like 테이블 userId 생성
    await queryInterface.addColumn('Likes', 'userId', {
      allowNull: false,
      type: Sequelize.INTEGER,
    });
    await queryInterface.addConstraint('Likes', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_likes_users_id',
      references: {
        table: 'Users',
        field: 'userId',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Likes', 'userId');
    await queryInterface.removeColumn('Likes', 'postId');
  },
};
