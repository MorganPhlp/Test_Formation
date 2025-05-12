'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Personnel extends Model {
    static associate(models) {
      // Définition de l'association avec la table Personne
      Personnel.belongsTo(models.Personne, {
        foreignKey: 'personneId',
        onDelete: 'CASCADE'
      });
    }
  }
  
  Personnel.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    personneId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Personne',
        key: 'id'
      }
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 16,
        max: 100
      }
    },
    taille: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: 'Taille en mètres',
      validate: {
        min: 0.5,
        max: 2.5
      }
    },
    poids: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: 'Poids en kilogrammes',
      validate: {
        min: 20,
        max: 300
      }
    }
  }, {
    sequelize,
    modelName: 'Personnel',
    tableName: 'personnel',
    timestamps: false
  });
  
  return Personnel;
};
