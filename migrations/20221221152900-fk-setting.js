"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // Posts 테이블 userId 생성
    await queryInterface.addColumn("Posts", "userId", {
      allowNull: false,
      type: Sequelize.INTEGER,
    });
    await queryInterface.addConstraint("Posts", {
      fields: ["userId"],
      type: "foreign key",
      name: "fk_posts_users_id",
      references: {
        table: "Users",
        field: "userId",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    // commnets 테이블 userId 생성
    await queryInterface.addColumn("Comments", "userId", {
      allowNull: false,
      type: Sequelize.INTEGER,
    });
    await queryInterface.addConstraint("Comments", {
      fields: ["userId"],
      type: "foreign key",
      name: "fk_comments_users_id",
      references: {
        table: "Users",
        field: "userId",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    // commnets 테이블 postId 생성
    await queryInterface.addColumn("Comments", "postId", {
      allowNull: false,
      type: Sequelize.INTEGER,
    });
    await queryInterface.addConstraint("Comments", {
      fields: ["postId"],
      type: "foreign key",
      name: "fk_comments_posts_id",
      references: {
        table: "Posts",
        field: "postId",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("Posts", "userId");
    await queryInterface.removeColumn("Comments", "userId");
    await queryInterface.removeColumn("Comments", "postId");
  },
};
