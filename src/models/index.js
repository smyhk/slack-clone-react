import Sequelize from 'sequelize';

const sequelize = new Sequelize({
  database: 'slack-clone',
  username: 'postgres',
  password: 'passwd',
  dialect: 'postgres',
  operatorsAliases: Sequelize.Op,
  define: {
    underscored: 'true'
  }
});

const models = {
  User: sequelize.import('./user'),
  Channel: sequelize.import('./channel'),
  Message: sequelize.import('./message'),
  Team: sequelize.import('./team'),
  Member: sequelize.import('./member')
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
