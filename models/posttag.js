'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PostTag.belongsTo(models.Post, { foreignKey: `PostId` })
      PostTag.belongsTo(models.Tag, { foreignKey: `TagId` })
      
    }
  }
  PostTag.init({
    PostId: DataTypes.INTEGER,
    TagId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'PostTag',
  });
  return PostTag;
};